import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Download, 
  Printer, 
  CreditCard, 
  Phone, 
  Coins, 
  RotateCcw,
  Check
} from 'lucide-react';
import { SUPPORTED_DOCUMENTS } from './data';
import { DocumentType, Step, PaymentMethod, PaymentDetails } from './types';

export default function App() {
  // Step State
  const [currentStep, setCurrentStep] = useState<Step>('choose');
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  
  // Form State
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  
  // Generation & AI Preview State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [generationError, setGenerationError] = useState<string>('');
  
  // Payment State
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('momo');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  // Print ref
  const previewRef = useRef<HTMLDivElement>(null);

  // Helper to check if form is fully filled
  const isFormComplete = () => {
    if (!selectedDoc) return false;
    return selectedDoc.fields.every(field => {
      const val = formValues[field.id];
      return val && val.trim().length > 0;
    });
  };

  // Step 1: Document selection handler
  const handleSelectDoc = (doc: DocumentType) => {
    setSelectedDoc(doc);
    // Initialize empty form values
    const initialVals: Record<string, string> = {};
    doc.fields.forEach(f => {
      initialVals[f.id] = '';
    });
    setFormValues(initialVals);
    setGenerationError('');
    setPaymentError('');
    // Auto advance to Step 2
    setCurrentStep('fill');
  };

  // Step 2: Form submission trigger
  const handleGenerateClick = async () => {
    if (!selectedDoc || !isFormComplete()) return;
    
    // Go to preview step
    setCurrentStep('preview');
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedText('');

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDoc.id,
          fields: formValues
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to communicate with document writer.');
      }

      setGeneratedText(data.documentText);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'We could not generate your document right now. Please check your internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 4: Payment action handler
  const handlePayClick = () => {
    setPaymentError('');
    
    // Validations based on type
    if (selectedPayment === 'momo' || selectedPayment === 'airtel') {
      const cleanedPhone = phoneNumber.replace(/\s+/g, '');
      if (!cleanedPhone) {
        setPaymentError('Please enter your Mobile Money phone number.');
        return;
      }

      // Ugandan phone format regex (starts with 07 or +2567 or 2567, 10-13 digits)
      const isUgandan = /^(07[0-9]{8}|(256|\\+256)7[0-9]{8})$/.test(cleanedPhone);
      if (!isUgandan) {
        setPaymentError('Please enter a valid Ugandan phone number starting with 07 (e.g., 0772 123456 or 0752 987654).');
        return;
      }

      // Check appropriate prefix if selected momo vs airtel
      if (selectedPayment === 'momo') {
        // MTN prefixes: 77, 78, 76
        const hasMTNPrefix = /^(077|078|076|25677|25678|25676)/.test(cleanedPhone);
        if (!hasMTNPrefix) {
          setPaymentError('The number entered does not appear to be an MTN Mobile Money number. MTN numbers usually begin with 077, 078, or 076.');
          return;
        }
      } else if (selectedPayment === 'airtel') {
        // Airtel prefixes: 70, 75, 74
        const hasAirtelPrefix = /^(075|070|074|25675|25670|25674)/.test(cleanedPhone);
        if (!hasAirtelPrefix) {
          setPaymentError('The number entered does not appear to be an Airtel Money number. Airtel numbers usually begin with 075, 070, or 074.');
          return;
        }
      }
    }

    setIsPaying(true);

    // Simulate Payment network delay (2.5s)
    setTimeout(() => {
      setIsPaying(false);
      const randomRef = 'DCE-' + Math.floor(100000 + Math.random() * 900000);
      setPaymentDetails({
        method: selectedPayment,
        phoneNumber: selectedPayment !== 'card' ? phoneNumber : undefined,
        amount: selectedDoc?.price || 2000,
        reference: randomRef
      });
      setCurrentStep('success');
    }, 2500);
  };

  // Microsoft Word .doc Document Download
  const handleWordDownload = () => {
    if (!selectedDoc || !generatedText) return;

    // Word HTML wrap allows opening formatted layout in Microsoft Word directly
    const title = selectedDoc.name;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Formatting for print-ready letterhead feel inside Word
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${title}</title>
        <style>
          @page {
            size: A4;
            margin: 1in;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000000;
          }
          .header-line {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            text-transform: uppercase;
            margin-bottom: 24pt;
            border-bottom: 2px double #000000;
            padding-bottom: 6pt;
          }
          p {
            margin-bottom: 12pt;
            text-align: justify;
          }
          h1, h2, h3, h4 {
            font-weight: bold;
            margin-top: 18pt;
            margin-bottom: 6pt;
          }
          .date {
            text-align: right;
            margin-bottom: 18pt;
          }
        </style>
      </head>
      <body>
        <div class="header-line">
          THE REPUBLIC OF UGANDA<br/>
          ${title.toUpperCase()}
        </div>
        <div class="date">Date: ${dateStr}</div>
        ${generatedText.replace(/\n/g, '<br/>')}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Friendly file name e.g., formal_letter_24_06_2026.doc
    const cleanName = title.toLowerCase().replace(/\s+/g, '_');
    link.download = `${cleanName}_${new Date().toISOString().slice(0, 10).replace(/-/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerBrowserPrint = () => {
    window.print();
  };

  const handleReset = () => {
    setSelectedDoc(null);
    setFormValues({});
    setGeneratedText('');
    setPhoneNumber('');
    setPaymentError('');
    setPaymentDetails(null);
    setCurrentStep('choose');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-text-primary bg-brand-ivory md:border-8 md:border-brand-navy select-none">
      
      {/* HEADER SECTION (Like a dignified government portal) */}
      <header className="bg-brand-navy text-white shadow-lg border-b border-brand-border/20 print:hidden h-20 flex items-center justify-between px-6 sm:px-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-gold flex items-center justify-center rounded-sm shadow-md flex-shrink-0" id="uganda-seal">
            <span className="text-2xl" role="img" aria-label="Uganda">🇺🇬</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white leading-tight font-bold tracking-tight" id="main-title">DocEase Uganda</h1>
            <p className="text-brand-gold-light text-[10px] sm:text-xs font-semibold tracking-widest uppercase">Professional Document Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-brand-gold-light text-[10px] uppercase font-bold tracking-wider">Service Status</span>
            <span className="text-white flex items-center gap-2 text-xs font-bold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Official Registry Online
            </span>
          </div>
          <div className="flex items-center gap-2 bg-brand-mid-navy px-3 py-1.5 border border-brand-border/30 rounded text-xs sm:text-sm shadow-sm">
            <Coins className="w-4 h-4 text-brand-gold" />
            <span className="font-sans">
              Rate: <strong className="text-brand-gold font-mono">UGX 2,000</strong>
            </span>
          </div>
        </div>
      </header>

      {/* STEP PROGRESS INDICATOR */}
      <nav className="bg-brand-ivory-dark border-b border-brand-border px-4 sm:px-10 h-14 flex items-center justify-between sm:justify-start gap-4 sm:gap-12 overflow-x-auto print:hidden shrink-0">
        {[
          { key: 'choose', label: '1. Select' },
          { key: 'fill', label: '2. Fill Details' },
          { key: 'preview', label: '3. Preview' },
          { key: 'payment', label: '4. Pay' },
          { key: 'success', label: '5. Download' }
        ].map((stepItem, idx) => {
          const steps = ['choose', 'fill', 'preview', 'payment', 'success'];
          const activeIdx = steps.indexOf(currentStep);
          const itemIdx = steps.indexOf(stepItem.key);
          const isCompleted = itemIdx < activeIdx;
          const isActive = stepItem.key === currentStep;

          return (
            <div 
              key={stepItem.key} 
              className={`flex items-center gap-2.5 transition-opacity duration-150 shrink-0 ${
                isActive ? 'opacity-100 font-bold' : isCompleted ? 'opacity-80' : 'opacity-40'
              }`}
            >
              <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                isActive 
                  ? 'bg-brand-navy text-white border border-brand-gold ring-2 ring-brand-gold/30' 
                  : isCompleted
                    ? 'bg-brand-success text-white'
                    : 'border border-brand-navy text-brand-navy'
              }`}>
                {isCompleted ? '✓' : idx + 1}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-brand-navy whitespace-nowrap">
                {stepItem.label.split(' ')[1] || stepItem.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <AnimatePresence mode="wait">
        {currentStep === 'choose' || currentStep === 'success' ? (
          /* Full Width Views for Choose & Success */
          <main key="full-layout" className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 overflow-y-auto">
            {currentStep === 'choose' && (
              <motion.div
                key="step-choose"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy">
                    What official document do you need to write?
                  </h2>
                  <p className="text-brand-text-secondary text-base sm:text-lg leading-relaxed">
                    Select a document category below. Our automated typewriter will ask simple questions and compose a perfect, formal Ugandan document for you.
                  </p>
                </div>

                {/* Grid of friendly, tap-friendly tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="document-grid">
                  {SUPPORTED_DOCUMENTS.map((doc) => (
                    <button
                      key={doc.id}
                      id={`doc-tile-${doc.id}`}
                      onClick={() => handleSelectDoc(doc)}
                      className="flex flex-col text-left p-5 bg-white border border-brand-border rounded shadow-sm hover:border-brand-gold hover:bg-brand-ivory-dark transition-all duration-200 cursor-pointer min-h-[160px] justify-between focus:ring-2 focus:ring-brand-navy outline-none group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-200" role="img" aria-label={doc.name}>
                            {doc.emoji}
                          </span>
                          <h3 className="text-lg font-bold text-brand-navy leading-snug">
                            {doc.name}
                          </h3>
                        </div>
                        <p className="text-sm text-brand-text-secondary leading-relaxed font-sans">
                          {doc.description}
                        </p>
                      </div>
                      
                      <div className="pt-4 mt-auto border-t border-dashed border-brand-border w-full flex justify-between items-center">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-text-tertiary">
                          Standard Fee
                        </span>
                        <span className="bg-brand-gold-light/60 text-brand-navy border border-brand-gold px-3 py-1 rounded text-xs font-bold font-mono">
                          UGX {doc.price.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Elegant informational footer note */}
                <div className="p-6 bg-white border border-brand-border rounded flex items-start gap-4 shadow-sm max-w-2xl mx-auto">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center flex-shrink-0">
                    <span className="font-serif font-bold text-lg">i</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-brand-navy text-sm uppercase tracking-wider">Respecting Your Dignity</h4>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">
                      DocEase Uganda is secure and print-ready. Built specifically for district offices, secondary schools, parish clergy, community associations, and elderly citizens across Uganda.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'success' && selectedDoc && paymentDetails && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Receipt Visual Header Card */}
                <div className="bg-white border border-brand-border rounded shadow-sm overflow-hidden text-center p-8 space-y-6">
                  
                  {/* Large Green Seal */}
                  <div className="w-16 h-16 bg-brand-success-light border border-brand-success rounded-full flex items-center justify-center text-brand-success mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy">
                      Payment Confirmed!
                    </h2>
                    <p className="text-brand-text-secondary max-w-md mx-auto">
                      Your payment was successfully credited to DocEase Uganda. Your professional document is now fully unlocked and ready to print or edit.
                    </p>
                  </div>

                  {/* Receipt Details Table */}
                  <div className="max-w-md mx-auto bg-brand-ivory border border-brand-border rounded p-5 text-left space-y-3 font-sans">
                    <div className="flex justify-between border-b border-brand-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-brand-text-tertiary">Document Type</span>
                      <span className="font-bold text-brand-navy">{selectedDoc.name}</span>
                    </div>
                    
                    {paymentDetails.phoneNumber && (
                      <div className="flex justify-between border-b border-brand-border/60 pb-2">
                        <span className="text-xs uppercase tracking-wider text-brand-text-tertiary">Phone Paid</span>
                        <span className="font-bold text-brand-navy font-mono">{paymentDetails.phoneNumber}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-b border-brand-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-[#718096]">Payment Method</span>
                      <span className="font-bold text-brand-navy uppercase font-mono">{paymentDetails.method === 'momo' ? 'MTN MoMo' : paymentDetails.method === 'airtel' ? 'Airtel Money' : 'Credit Card'}</span>
                    </div>

                    <div className="flex justify-between border-b border-brand-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-[#718096]">Reference Number</span>
                      <span className="font-bold text-brand-success font-mono">{paymentDetails.reference}</span>
                    </div>

                    <div className="flex justify-between pt-1">
                      <span className="text-xs uppercase tracking-wider text-[#718096] font-bold">Total Paid</span>
                      <span className="font-bold text-brand-navy font-mono">UGX {paymentDetails.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Print/Download primary and secondary actions */}
                  <div className="pt-4 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    
                    {/* Download Word Document Action */}
                    <button
                      id="download-doc-button"
                      onClick={handleWordDownload}
                      className="flex-1 h-14 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold text-base rounded shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      <span>⬇ Download for Word</span>
                    </button>

                    {/* Print Document Action */}
                    <button
                      id="print-doc-button"
                      onClick={triggerBrowserPrint}
                      className="flex-1 h-14 bg-brand-navy hover:bg-brand-mid-navy text-white font-bold text-base rounded shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Printer className="w-5 h-5 text-brand-gold" />
                      <span>Print Document</span>
                    </button>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-brand-text-tertiary">
                      Downloading saves a professional Microsoft Word format (.doc) file that you can freely edit on your computer. Tap <strong>Print</strong> to output directly to any paper printer.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-brand-border max-w-md mx-auto">
                    <button
                      id="restart-flow-button"
                      onClick={handleReset}
                      className="w-full h-11 border border-brand-border hover:bg-brand-ivory-dark text-brand-text-secondary font-bold text-sm rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Create Another Document</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </main>
        ) : (
          /* Split screen Sidebar layout for fill, preview, payment details steps */
          <main key="split-layout" className="flex-1 flex overflow-hidden">
            
            {/* Template selection sidebar */}
            <aside className="hidden md:flex flex-col w-80 border-r border-brand-border bg-white overflow-hidden shrink-0">
              <div className="p-6 border-b border-brand-border bg-brand-ivory">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-text-tertiary mb-1">Selected Template</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedDoc?.emoji}</span>
                  <span className="font-serif font-bold text-lg text-brand-navy leading-tight">{selectedDoc?.name}</span>
                </div>
              </div>
              <div className="flex-1 p-4 bg-brand-ivory-dark space-y-3 overflow-y-auto">
                {SUPPORTED_DOCUMENTS.map((doc) => {
                  const isSelected = selectedDoc && doc.id === selectedDoc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc)}
                      className={`w-full flex items-center gap-3 p-3 rounded text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-brand-navy text-white border-brand-gold ring-2 ring-brand-gold/30 shadow-md'
                          : 'bg-white shadow-sm border-brand-border opacity-60 hover:opacity-100 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl shrink-0">{doc.emoji}</span>
                      <div className="text-left">
                        <p className="text-sm font-bold leading-snug">{doc.name}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-brand-gold-light' : 'text-brand-text-tertiary'}`}>
                          {isSelected ? 'SELECTED' : `UGX ${doc.price.toLocaleString()}`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Content pane right-side details container */}
            <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 flex flex-col">
              {currentStep === 'fill' && selectedDoc && (
                <motion.div
                  key="step-fill-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-6">
                      <button
                        id="back-button-fill"
                        onClick={() => setCurrentStep('choose')}
                        className="text-xs font-black tracking-widest uppercase flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-navy mb-4 transition-colors cursor-pointer"
                      >
                        <span>←</span> Change document type
                      </button>
                      <h2 className="text-3xl font-serif font-bold text-brand-navy">{selectedDoc.name} Details</h2>
                      <p className="text-brand-text-secondary mt-1.5 text-sm">Please fill in the information below to generate your official, tailored Ugandan document draft.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6" id="form-container">
                      {selectedDoc.fields.map((field) => (
                        <div key={field.id} className="flex flex-col gap-2">
                          <label 
                            htmlFor={field.id}
                            className="text-[11px] font-black uppercase tracking-wider text-brand-text-secondary"
                          >
                            {field.label} <span className="text-red-600 font-bold">*</span>
                          </label>
                          
                          {field.type === 'textarea' ? (
                            <textarea
                              id={field.id}
                              rows={4}
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              placeholder={field.placeholder}
                              className="p-4 border border-brand-border bg-brand-ivory text-base focus:border-brand-navy focus:bg-white focus:outline-none transition-colors rounded-sm leading-relaxed placeholder:text-brand-text-tertiary/70"
                              style={{ minHeight: '120px' }}
                            />
                          ) : (
                            <input
                              id={field.id}
                              type={field.type === 'number' ? 'number' : 'text'}
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              placeholder={field.placeholder}
                              className="h-14 px-4 border border-brand-border bg-brand-ivory text-base sm:text-lg focus:border-brand-navy focus:bg-white focus:outline-none transition-colors rounded-sm placeholder:text-brand-text-tertiary/70"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar / Page controls and instructions */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-brand-border gap-6">
                    <div className="flex items-center gap-4 text-[#718096]">
                      <span className="text-2xl" role="img" aria-label="info">ℹ️</span>
                      <p className="text-xs leading-relaxed max-w-[280px]">
                        DocEase uses professional Ugandan English. Your document will be formatted with official standards, including letterhead and clear margins.
                      </p>
                    </div>
                    
                    <button
                      id="submit-form-button"
                      disabled={!isFormComplete()}
                      onClick={handleGenerateClick}
                      className={`h-16 px-10 flex items-center gap-4 font-bold text-lg shadow-xl transition-all rounded-sm shrink-0 w-full sm:w-auto justify-center ${
                        isFormComplete()
                          ? 'bg-brand-navy text-white hover:bg-brand-mid-navy cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span>GENERATE MY DOCUMENT</span>
                      <span className="text-xl">→</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'preview' && selectedDoc && (
                <motion.div
                  key="step-preview-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Top controls */}
                  <div className="flex items-center justify-between">
                    <button
                      id="back-button-preview"
                      onClick={() => setCurrentStep('fill')}
                      className="text-xs font-black tracking-widest uppercase flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-navy transition-colors cursor-pointer"
                    >
                      <span>←</span> Back to edit details
                    </button>
                    
                    <span className="text-sm font-sans bg-brand-gold-light/60 text-brand-navy px-3 py-1 rounded font-bold border border-brand-gold">
                      Draft Price: UGX {selectedDoc.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Document Preview Box Container */}
                  <div className="bg-white border border-brand-border rounded shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Header bar (Navy, formal label left, live status indicator right) */}
                    <div className="bg-brand-navy text-white px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-gold" />
                        <span className="font-sans text-xs uppercase tracking-wider font-bold text-brand-gold">
                          OFFICIAL DOCUMENT PREVIEW
                        </span>
                      </div>
                      
                      {/* Live Status indicator */}
                      <div className="flex items-center gap-2">
                        {isGenerating ? (
                          <>
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                            <span className="text-xs font-sans tracking-wide text-brand-gold-light">
                              Writing draft...
                            </span>
                          </>
                        ) : generationError ? (
                          <>
                            <span className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="text-xs font-sans text-red-300 font-medium">
                              Failed
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="relative flex h-3 w-3">
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-sans tracking-wide text-emerald-300 font-bold">
                              ✓ Draft Complete
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Body Paper Panel */}
                    <div className="bg-brand-ivory-dark/40 p-6 sm:p-10 min-h-[300px] flex flex-col justify-between relative">
                      
                      {isGenerating ? (
                        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 space-y-4">
                          <Loader2 className="w-12 h-12 text-brand-navy animate-spin" />
                          <div className="text-center space-y-1">
                            <p className="font-serif font-bold text-lg text-brand-navy">Writing your document...</p>
                            <p className="text-sm text-brand-text-secondary max-w-sm">
                              Our official secretary is composing a formal, polite, and grammatically complete {selectedDoc.name} in proper Ugandan English.
                            </p>
                          </div>
                        </div>
                      ) : generationError ? (
                        <div className="p-6 bg-red-50 border border-red-200 rounded text-red-900 space-y-3">
                          <div className="flex items-center gap-2 font-bold text-base">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span>Document Generation Failed</span>
                          </div>
                          <p className="text-sm leading-relaxed">{generationError}</p>
                          <button 
                            onClick={handleGenerateClick}
                            className="bg-brand-navy text-white text-sm font-bold px-4 py-2 rounded hover:bg-brand-mid-navy transition-colors mt-2"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : (
                        /* The Formal Paper Body Preview (using Lora font for typewriter feeling) */
                        <div 
                          id="printable-document" 
                          ref={previewRef}
                          className="bg-white border border-brand-border/60 rounded p-6 sm:p-8 shadow-sm font-serif text-sm sm:text-base leading-relaxed text-slate-800 whitespace-pre-wrap select-text"
                          style={{ minHeight: '260px', lineHeight: '1.7' }}
                        >
                          {/* Stylized Uganda Emblem Letterhead indicator inside preview */}
                          <div className="text-center border-b-2 border-double border-slate-300 pb-4 mb-6">
                            <p className="text-xs tracking-widest font-sans font-bold text-slate-500 uppercase">THE REPUBLIC OF UGANDA</p>
                            <h1 className="text-lg font-bold text-slate-800 uppercase mt-1">{selectedDoc.name}</h1>
                          </div>
                          
                          {generatedText}
                        </div>
                      )}
                    </div>

                    {/* AI Advice notice bar */}
                    {!isGenerating && !generationError && generatedText && (
                      <div className="bg-brand-gold-light/40 border-t border-brand-border px-5 py-3 text-xs text-brand-text-secondary flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                        <p className="leading-relaxed">
                          <strong>Draft Notification:</strong> This draft has been professionally composed. To edit the input fields again, tap the <strong>← Back to edit details</strong> button. To unlock full high-fidelity downloads and physical printing, proceed to payment.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Payment Actions */}
                  {!isGenerating && !generationError && generatedText && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white border border-brand-border rounded shadow-sm">
                      <div className="text-center sm:text-left">
                        <span className="text-xs text-[#718096] uppercase tracking-wider font-bold">Total Billable Amount</span>
                        <h4 className="text-2xl font-serif font-bold text-brand-navy">UGX {selectedDoc.price.toLocaleString()}</h4>
                      </div>
                      
                      <button
                        id="proceed-payment-button"
                        onClick={() => setCurrentStep('payment')}
                        className="w-full sm:w-auto h-16 px-10 bg-brand-navy hover:bg-brand-mid-navy text-white font-bold text-lg rounded-sm shadow-xl flex items-center justify-center gap-4 transition-all"
                      >
                        <span>SECURE PAYMENT &amp; DOWNLOAD</span>
                        <span className="text-xl">→</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 'payment' && selectedDoc && (
                <motion.div
                  key="step-payment-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <button
                    id="back-button-payment"
                    onClick={() => setCurrentStep('preview')}
                    className="text-xs font-black tracking-widest uppercase flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-navy transition-colors cursor-pointer"
                  >
                    <span>←</span> Back to preview
                  </button>

                  <div className="bg-white border border-brand-border rounded shadow-sm overflow-hidden">
                    <div className="bg-brand-navy text-white p-6 border-b-4 border-brand-gold flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-brand-gold-light">Secured Mobile Money Payment</h3>
                        <p className="text-xs text-brand-border mt-0.5">Approved and routed via Flutterwave Telecom Gateway Uganda</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-brand-border uppercase tracking-wider font-medium block">AMOUNT DUE</span>
                        <span className="text-2xl font-serif font-bold text-brand-gold">UGX {selectedDoc.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      
                      {/* Payment Method Selector Grid */}
                      <div className="space-y-3">
                        <label className="block text-xs uppercase tracking-wider font-bold text-brand-text-secondary">
                          Choose Your Payment Method
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="payment-methods">
                          {/* MTN Mobile Money */}
                          <button
                            type="button"
                            onClick={() => setSelectedPayment('momo')}
                            className={`flex items-center gap-3 p-4 border rounded text-left transition-all cursor-pointer outline-none ${
                              selectedPayment === 'momo'
                                ? 'border-brand-navy bg-brand-gold-light/20 ring-2 ring-brand-navy'
                                : 'border-brand-border bg-brand-ivory hover:bg-brand-ivory-dark'
                            }`}
                          >
                            <div className="w-10 h-10 rounded bg-amber-400 flex items-center justify-center font-bold text-xs text-brand-navy flex-shrink-0">
                              MTN
                            </div>
                            <div>
                              <p className="font-bold text-brand-navy text-base">MTN Mobile Money</p>
                              <p className="text-xs text-[#718096]">Instant SMS Prompt</p>
                            </div>
                          </button>

                          {/* Airtel Money */}
                          <button
                            type="button"
                            onClick={() => setSelectedPayment('airtel')}
                            className={`flex items-center gap-3 p-4 border rounded text-left transition-all cursor-pointer outline-none ${
                              selectedPayment === 'airtel'
                                ? 'border-brand-navy bg-brand-gold-light/20 ring-2 ring-brand-navy'
                                : 'border-brand-border bg-brand-ivory hover:bg-brand-ivory-dark'
                            }`}
                          >
                            <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                              ART
                            </div>
                            <div>
                              <p className="font-bold text-brand-navy text-base">Airtel Money</p>
                              <p className="text-xs text-[#718096]">Instant PIN Prompt</p>
                            </div>
                          </button>
                        </div>

                        {/* Credit/Debit Card Selection */}
                        <button
                          type="button"
                          onClick={() => setSelectedPayment('card')}
                          className={`w-full flex items-center gap-3 p-4 mt-2 border rounded text-left transition-all cursor-pointer outline-none ${
                            selectedPayment === 'card'
                              ? 'border-brand-navy bg-brand-gold-light/20 ring-2 ring-brand-navy'
                              : 'border-brand-border bg-brand-ivory hover:bg-brand-ivory-dark'
                          }`}
                        >
                          <div className="w-10 h-10 rounded bg-brand-navy flex items-center justify-center text-brand-gold flex-shrink-0">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-brand-navy text-base">Mastercard / Visa Credit Card</p>
                            <p className="text-xs text-[#718096]">Pay securely using any International or Local bank card</p>
                          </div>
                        </button>
                      </div>

                      {/* Dynamic Form based on selection */}
                      {selectedPayment !== 'card' ? (
                        <div className="p-4 bg-brand-ivory border border-brand-border rounded space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-brand-navy" />
                            <h4 className="font-bold text-brand-navy text-sm uppercase tracking-wider">
                              Enter Mobile Money Number
                            </h4>
                          </div>
                          
                          <div className="space-y-1.5">
                            <input
                              id="payment-phone-input"
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="e.g. 0772 123456"
                              className="w-full text-lg p-4 bg-white border border-brand-border rounded focus:border-brand-navy outline-none"
                            />
                            <p className="text-xs text-[#718096]">
                              Ensure the phone is registered in your name to receive the automatic PIN authorization prompt on your handset.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-brand-ivory border border-brand-border rounded space-y-3 text-sm text-[#718096] leading-relaxed">
                          <p>
                            On clicking the button below, you will be temporarily routed to a secure encrypted Flutterwave visa portal to input your 16-digit card number. Once confirmed, you will return back to DocEase immediately to download your document.
                          </p>
                        </div>
                      )}

                      {/* Error display box */}
                      {paymentError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-900 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-medium leading-relaxed">{paymentError}</p>
                        </div>
                      )}

                      {/* Merchant badge */}
                      <div className="text-center pt-2">
                        <p className="text-xs text-brand-text-tertiary font-mono">
                          DocEase Merchant #8847 · Secure 256-Bit SSL Encryption
                        </p>
                      </div>

                      {/* Payment Buttons */}
                      <div className="pt-4 border-t border-brand-border">
                        <button
                          id="pay-submit-button"
                          disabled={isPaying}
                          onClick={handlePayClick}
                          className="w-full h-16 bg-brand-navy hover:bg-brand-mid-navy text-white font-bold text-lg rounded-sm shadow-xl flex items-center justify-center gap-4 transition-all cursor-pointer"
                        >
                          {isPaying ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Processing payment. Please check your phone...</span>
                            </>
                          ) : (
                            <>
                              <span>PAY UGX {selectedDoc.price.toLocaleString()} NOW &amp; DOWNLOAD</span>
                              <span className="text-xl">→</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </main>
        )}
      </AnimatePresence>

      {/* FOOTER DETAIL (Official footer with country identity) */}
      <footer className="h-10 bg-[#EDE9DF] border-t border-[#D6CFBF] flex items-center justify-between px-6 sm:px-10 text-[9px] sm:text-[10px] text-[#718096] font-bold uppercase tracking-widest print:hidden shrink-0 overflow-x-auto gap-4">
        <span className="whitespace-nowrap">DocEase Uganda #8847</span>
        <span className="hidden md:inline whitespace-nowrap">Empowering Ugandan Professionals with Dignity</span>
        <div className="flex gap-4 shrink-0">
          <span className="text-[#2F7A4B] whitespace-nowrap">Secure Mobile Money Payment</span>
          <span className="whitespace-nowrap">v1.0.4</span>
        </div>
      </footer>

    </div>
  );
}
