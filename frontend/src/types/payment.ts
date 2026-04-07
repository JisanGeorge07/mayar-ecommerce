import type { TranslatedText } from './index';

export type PaymentProvider = 'myfatoorah';

export type PaymentInvoiceStatus = 'PAID' | 'PENDING' | 'FAILED' | 'CANCELED';
export type PaymentTransactionStatus = 'SUCCESS' | 'FAILED' | 'INPROGRESS' | 'AUTHORIZE' | 'CANCELED';

export type OrderPaymentStatus =
  | 'draft'
  | 'pending_payment'
  | 'payment_redirected'
  | 'paid'
  | 'failed'
  | 'cancelled';

export interface CreatePaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: 'KWD'; // Always KWD for MyFatoorah (INR is converted to KWD)
  /** Mobile country code without + prefix (e.g., "965" for Kuwait) */
  countryCode?: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  callbackUrl: string;
  errorUrl: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  metadata?: Record<string, string>;
}

export interface CreatePaymentResponse {
  paymentUrl: string;
  invoiceId: string;
  invoiceValue: number;
}

export interface PaymentVerificationResult {
  paymentId: string;
  invoiceStatus: PaymentInvoiceStatus;
  transactionStatus?: PaymentTransactionStatus;
  orderId: string;
  orderNumber: string;
  invoiceId: string;
  paidAmount: number;
  paidCurrency: string;
  /** Error message from the payment gateway (e.g., AUTHENTICATION_UNSUCCESSFUL) */
  errorMessage?: string;
  /** Error code from the payment gateway (e.g., MF001) */
  errorCode?: string;
}
