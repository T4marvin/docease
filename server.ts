import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { SUPPORTED_DOCUMENTS } from './src/data';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily as required by security guidelines
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing in secrets/settings');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for generating documents
app.post('/api/generate-document', async (req, res) => {
  try {
    const { documentId, fields } = req.body;
    if (!documentId || !fields) {
      return res.status(400).json({ success: false, error: 'Document ID and fields are required.' });
    }

    const docType = SUPPORTED_DOCUMENTS.find(d => d.id === documentId);
    if (!docType) {
      return res.status(404).json({ success: false, error: 'Document type not found.' });
    }

    const ai = getGeminiClient();

    // Construct the user prompt mapping labels to the values provided by the user
    let userDetailsPrompt = '';
    for (const field of docType.fields) {
      const val = fields[field.id] || '(Not specified)';
      userDetailsPrompt += `${field.label}: ${val}\n`;
    }

    const systemInstruction = `You are a professional document writer for Ugandan offices, schools, churches, and NGOs. 
Write formal, well-structured documents in proper Ugandan English. 
Use correct official formatting with clear headings, proper salutations, and formal closing lines.
Do not add any explanation or preamble — output ONLY the document itself, ready to print.
Include today's date (formatted as Day Month Year, e.g., 24th June 2026) in the document header.
Write with the tone of an experienced government secretary, school headmistress, parish priest, or NGO administrator.
Documents should be complete, thorough, and ready to submit or present without editing.`;

    const prompt = `Write a complete, professional ${docType.name.toUpperCase()} using these details:

${userDetailsPrompt}

Make it thorough, formal, and ready to present or submit. 
Include all standard sections for this type of document.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3, // Lower temperature for formal, reliable document structure
      },
    });

    const generatedText = response.text;
    if (!generatedText) {
      throw new Error('No content returned from AI model');
    }

    res.json({ success: true, documentText: generatedText });
  } catch (error: any) {
    console.error('Error generating document:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred during document generation.' 
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DocEase Uganda Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
