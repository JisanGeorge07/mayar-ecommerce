import type { ShippingMethod, PaymentMethod } from '@/types/checkout';

export const shippingMethods: ShippingMethod[] = [
  {
    id: 'local',
    name: { en: 'Local Delivery (Kuwait)', ar: 'توصيل محلي (الكويت)' },
    description: { en: 'Standard delivery within Kuwait', ar: 'توصيل عادي داخل الكويت' },
    estimatedDays: { en: '2–3 business days', ar: '٢–٣ أيام عمل' },
    price: 0,
  },
  {
    id: 'international',
    name: { en: 'International Shipping', ar: 'شحن دولي' },
    description: { en: 'Worldwide delivery via express courier', ar: 'توصيل عالمي عبر شركة شحن سريع' },
    estimatedDays: { en: '7–14 business days', ar: '٧–١٤ يوم عمل' },
    price: 5.0,
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'knet', name: { en: 'KNET', ar: 'كي نت' } },
  { id: 'card', name: { en: 'Credit / Debit Card', ar: 'بطاقة ائتمان / خصم' } },
  { id: 'myfatoorah', name: { en: 'MyFatoorah', ar: 'ماي فاتورة' } },
];

export const kuwaitAreas = [
  { en: 'Salmiya', ar: 'السالمية' },
  { en: 'Hawally', ar: 'حولي' },
  { en: 'Kuwait City', ar: 'مدينة الكويت' },
  { en: 'Jabriya', ar: 'الجابرية' },
  { en: 'Farwaniya', ar: 'الفروانية' },
  { en: 'Mangaf', ar: 'المنقف' },
  { en: 'Fintas', ar: 'الفنطاس' },
  { en: 'Mahboula', ar: 'المهبولة' },
  { en: 'Sabah Al Salem', ar: 'صباح السالم' },
  { en: 'Mishref', ar: 'مشرف' },
  { en: 'Rumaithiya', ar: 'الرميثية' },
  { en: 'Bayan', ar: 'بيان' },
  { en: 'Salwa', ar: 'سلوى' },
  { en: 'Other', ar: 'أخرى' },
];
