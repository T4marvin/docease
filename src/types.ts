export interface DocumentField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'number';
}

export interface DocumentType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
  fields: DocumentField[];
}

export type Step = 'choose' | 'fill' | 'preview' | 'payment' | 'success';

export type PaymentMethod = 'momo' | 'airtel' | 'card';

export interface PaymentDetails {
  method: PaymentMethod;
  phoneNumber?: string;
  amount: number;
  reference: string;
}

export interface GenerationRequest {
  documentId: string;
  fields: Record<string, string>;
}

export interface GenerationResponse {
  success: boolean;
  documentText?: string;
  error?: string;
}
