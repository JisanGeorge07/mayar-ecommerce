/**
 * Mock MyFatoorah Hosted Payment Page
 *
 * Simulates the external payment gateway page the user is redirected to.
 * Shows mock payment details and action buttons for Success / Failed / Pending / Cancelled.
 */

import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Shield, CreditCard, Loader2 } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { getPendingPayment } from '@/services/payment/myfatoorahService';

const PaymentHostedPage = () => {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { lang, formatPrice } = useLocale();
  const isAr = lang === 'ar';
  const [processing, setProcessing] = useState<string | null>(null);

  const invoiceId = params.get('invoiceId') || '';
  const amount = parseFloat(params.get('amount') || '0');
  const currency = params.get('currency') || 'KWD';
  const pending = getPendingPayment();

  const simulate = (status: string) => {
    setProcessing(status);
    setTimeout(() => {
      nav(`/payment/callback?paymentId=${invoiceId}&status=${status}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-[#1a3a5c] text-white rounded-t-xl px-6 py-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield size={20} />
            <span className="text-lg font-bold tracking-wide">MyFatoorah</span>
          </div>
          <p className="text-xs text-white/70">{isAr ? 'بوابة دفع آمنة' : 'Secure Payment Gateway'}</p>
        </div>

        {/* Body */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-5">
          {/* Amount */}
          <div className="text-center pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{isAr ? 'المبلغ المطلوب' : 'Amount Due'}</p>
            <p className="text-3xl font-bold text-gray-900 font-numeric">
              {currency} {amount.toFixed(3)}
            </p>
            {pending?.customerName && (
              <p className="text-xs text-gray-400 mt-1">{pending.customerName}</p>
            )}
          </div>

          {/* Invoice info */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">{isAr ? 'رقم الفاتورة' : 'Invoice ID'}</span>
              <span className="font-medium text-gray-700 font-numeric">{invoiceId}</span>
            </div>
            {pending?.orderNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">{isAr ? 'مرجع الطلب' : 'Order Ref'}</span>
                <span className="font-medium text-gray-700 font-numeric">{pending.orderNumber}</span>
              </div>
            )}
            {pending?.customerEmail && (
              <div className="flex justify-between">
                <span className="text-gray-500">{isAr ? 'البريد' : 'Email'}</span>
                <span className="font-medium text-gray-700">{pending.customerEmail}</span>
              </div>
            )}
          </div>

          {/* Mock card visual */}
          <div className="bg-gradient-to-br from-[#1a3a5c] to-[#2d5a8e] rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} />
              <span className="text-xs text-white/60">{isAr ? 'بطاقة اختبار' : 'Test Card'}</span>
            </div>
            <p className="text-sm tracking-[0.25em] font-numeric mb-2">•••• •••• •••• 4242</p>
            <div className="flex justify-between text-[10px] text-white/50">
              <span>DEMO / TEST</span>
              <span>12/28</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-400">
            {isAr ? 'هذه صفحة دفع تجريبية — اختر نتيجة لمحاكاة الدفع' : 'This is a demo payment page — choose a result to simulate payment'}
          </p>

          {/* Action buttons */}
          {processing ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
              <Loader2 size={18} className="animate-spin" />
              {isAr ? 'جاري المعالجة...' : 'Processing...'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => simulate('PAID')}
                className="col-span-2 h-12 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                {isAr ? '✓ دفع ناجح' : '✓ Pay Successfully'}
              </button>
              <button
                onClick={() => simulate('FAILED')}
                className="h-10 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-xs"
              >
                {isAr ? 'فشل الدفع' : 'Fail Payment'}
              </button>
              <button
                onClick={() => simulate('PENDING')}
                className="h-10 bg-amber-50 text-amber-600 font-medium rounded-lg hover:bg-amber-100 transition-colors text-xs"
              >
                {isAr ? 'معلق' : 'Pending'}
              </button>
              <button
                onClick={() => simulate('CANCELED')}
                className="col-span-2 h-10 border border-gray-200 text-gray-500 font-medium rounded-lg hover:bg-gray-50 transition-colors text-xs"
              >
                {isAr ? 'إلغاء الدفع' : 'Cancel Payment'}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-4">
          {isAr ? 'محمي بواسطة MyFatoorah — بيئة تجريبية' : 'Secured by MyFatoorah — Demo Environment'}
        </p>
      </div>
    </div>
  );
};

export default PaymentHostedPage;
