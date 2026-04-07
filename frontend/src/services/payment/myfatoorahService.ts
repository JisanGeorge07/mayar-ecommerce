/**
 * MyFatoorah Hosted Payment Service
 *
 * Production flow:
 *   POST /api/payment/initiate → server creates invoice via MyFatoorah API
 *   POST /api/payment/verify   → server verifies payment via GetPaymentStatus
 *   POST /api/payment/webhook  → server handles async payment updates
 *
 * In development (when API fails), falls back to mock hosted page flow.
 */

import api from '@/lib/axios';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentVerificationResult,
  PaymentInvoiceStatus,
} from '@/types/payment';

const PENDING_PAYMENT_KEY = 'mayar_pending_payment';
const USE_MOCK_PAYMENT = import.meta.env.VITE_USE_MOCK_PAYMENT === 'true';

// ── Create hosted payment session ──

export const createMyFatoorahPayment = async (
  request: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  // Get existing pending data (may have original currency info from StepPayment)
  const existingPending = getPendingPayment();

  // Merge with new request data, preserving original currency info for UI display
  const pendingData = {
    ...existingPending,
    orderId: request.orderId,
    orderNumber: request.orderNumber,
    // Keep original amount/currency if already set (for UI display)
    amount: existingPending?.amount ?? request.amount,
    currency: existingPending?.currency ?? request.currency,
    // Store payment amount/currency for MyFatoorah (always KWD)
    paymentAmount: request.amount,
    paymentCurrency: request.currency,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    callbackUrl: request.callbackUrl,
    errorUrl: request.errorUrl,
    createdAt: existingPending?.createdAt || new Date().toISOString(),
  };
  sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(pendingData));

  // Use mock payment in development if configured
  if (USE_MOCK_PAYMENT) {
    return createMockPayment(request);
  }

  try {
    const response = await api.post<{
      paymentUrl: string;
      invoiceId: string;
      invoiceValue: number;
    }>('/payment/initiate', {
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency,
      countryCode: request.countryCode,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerMobile,
      callbackUrl: request.callbackUrl,
      errorUrl: request.errorUrl,
    });

    // Update pending data with invoice ID
    sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify({
      ...pendingData,
      invoiceId: response.data.invoiceId,
    }));

    return response.data;
  } catch (error: any) {
    console.error('Failed to initiate payment via API:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
    console.error('Error details:', errorMessage);

    // Don't fallback to mock in production - throw the actual error
    if (import.meta.env.PROD) {
      throw new Error(errorMessage);
    }

    console.warn('Falling back to mock payment (development only)');
    // Fallback to mock payment for development
    return createMockPayment(request);
  }
};

// ── Verify payment status ──

export const verifyMyFatoorahPayment = async (
  paymentId: string
): Promise<PaymentVerificationResult> => {
  const pending = getPendingPayment();

  // Only use mock flow if explicitly in mock mode or paymentId indicates mock
  if (USE_MOCK_PAYMENT || paymentId.startsWith('MOCK-') || paymentId.startsWith('INV-')) {
    return completeMockPayment(paymentId, pending);
  }

  // For real MyFatoorah payments, verify via backend API
  try {
    const response = await api.post<PaymentVerificationResult>('/payment/verify', {
      paymentId,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to verify payment via API:', error);

    // For real payments, don't fall back to mock - use URL status instead
    const url = new URL(window.location.href);
    const urlStatus = (url.searchParams.get('status') || 'FAILED') as PaymentInvoiceStatus;

    // Return verification result based on URL status (from MyFatoorah redirect)
    return {
      paymentId,
      invoiceStatus: urlStatus,
      transactionStatus: urlStatus === 'PAID' ? 'SUCCESS' : urlStatus === 'PENDING' ? 'INPROGRESS' : 'FAILED',
      orderId: pending?.orderId || '',
      orderNumber: pending?.orderNumber || '',
      invoiceId: pending?.invoiceId || '',
      paidAmount: pending?.amount || 0,
      paidCurrency: pending?.currency || 'KWD',
      errorMessage: error?.response?.data?.errorMessage || error?.message,
      errorCode: error?.response?.data?.errorCode,
    };
  }
};

// ── Mock implementations for development ──

// Complete mock payment via backend endpoint
const completeMockPayment = async (
  paymentId: string,
  pending: any
): Promise<PaymentVerificationResult> => {
  if (!pending?.orderId) {
    throw new Error('No pending payment data found');
  }

  // Get status from URL (set by mock hosted page)
  const url = new URL(window.location.href);
  const status = (url.searchParams.get('status') || 'PAID') as PaymentInvoiceStatus;

  try {
    // Call backend to create payment record and update order
    const response = await api.post('/payment/mock-complete', {
      orderId: pending.orderId,
      orderNumber: pending.orderNumber,
      invoiceId: pending.invoiceId || `INV-${Date.now().toString(36).toUpperCase()}`,
      paymentId: paymentId || `MOCK-${Date.now().toString(36).toUpperCase()}`,
      amount: pending.amount,
      currency: pending.currency || 'KWD',
      status: status,
    });

    console.log('✅ Mock payment completed via backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend mock payment failed, falling back to client-side:', error);
    // Fallback to client-side mock if backend fails
    return createMockVerification(paymentId, pending);
  }
};

const createMockPayment = async (
  request: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  await new Promise(r => setTimeout(r, 500));

  const invoiceId = `INV-${Date.now().toString(36).toUpperCase()}`;

  // Update session storage with invoice ID
  const pending = getPendingPayment();
  if (pending) {
    sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify({
      ...pending,
      invoiceId,
    }));
  }

  // Redirect to mock hosted payment page
  const paymentUrl = `/payment/hosted?invoiceId=${invoiceId}&amount=${request.amount}&currency=${request.currency}`;

  return { paymentUrl, invoiceId, invoiceValue: request.amount };
};

const createMockVerification = (
  paymentId: string,
  pending: any
): PaymentVerificationResult => {
  // Get status from URL (set by mock hosted page)
  const url = new URL(window.location.href);
  const status = (url.searchParams.get('status') || 'PAID') as PaymentInvoiceStatus;

  return {
    paymentId,
    invoiceStatus: status,
    transactionStatus: status === 'PAID' ? 'SUCCESS' : status === 'PENDING' ? 'INPROGRESS' : 'FAILED',
    orderId: pending?.orderId || '',
    orderNumber: pending?.orderNumber || '',
    invoiceId: pending?.invoiceId || '',
    paidAmount: pending?.amount || 0,
    paidCurrency: pending?.currency || 'KWD',
  };
};

// ── Helpers ──

export const getPendingPayment = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearPendingPayment = () => {
  sessionStorage.removeItem(PENDING_PAYMENT_KEY);
};

export const savePendingPayment = (data: Record<string, any>) => {
  sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(data));
};
