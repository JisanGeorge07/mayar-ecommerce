import type { TranslatedText } from '@/types';

export interface SizeGuideRow {
  size: string;
  [key: string]: string;
}

export interface SizeGuideData {
  id: string;
  title: TranslatedText;
  fitNote?: TranslatedText;
  modelNote?: TranslatedText;
  columns: { key: string; label: TranslatedText }[];
  rows: SizeGuideRow[];
}

const sizeGuides: Record<string, SizeGuideData> = {
  dresses: {
    id: 'dresses',
    title: { en: 'Dresses Size Guide', ar: 'دليل مقاسات الفساتين' },
    fitNote: { en: 'True to size. If between sizes, we recommend sizing up.', ar: 'المقاس مطابق. إذا كنتِ بين مقاسين، ننصح بالمقاس الأكبر.' },
    modelNote: { en: 'Model is wearing size S. Height: 175 cm.', ar: 'العارضة ترتدي مقاس S. الطول: 175 سم.' },
    columns: [
      { key: 'size', label: { en: 'Size', ar: 'المقاس' } },
      { key: 'bust', label: { en: 'Bust (cm)', ar: 'الصدر (سم)' } },
      { key: 'waist', label: { en: 'Waist (cm)', ar: 'الخصر (سم)' } },
      { key: 'hip', label: { en: 'Hip (cm)', ar: 'الورك (سم)' } },
      { key: 'length', label: { en: 'Length (cm)', ar: 'الطول (سم)' } },
    ],
    rows: [
      { size: 'XS', bust: '80-84', waist: '60-64', hip: '86-90', length: '130' },
      { size: 'S', bust: '84-88', waist: '64-68', hip: '90-94', length: '132' },
      { size: 'M', bust: '88-92', waist: '68-72', hip: '94-98', length: '134' },
      { size: 'L', bust: '92-96', waist: '72-76', hip: '98-102', length: '136' },
      { size: 'XL', bust: '96-100', waist: '76-80', hip: '102-106', length: '138' },
    ],
  },
  tops: {
    id: 'tops',
    title: { en: 'Tops & T-Shirts Size Guide', ar: 'دليل مقاسات البلوزات والتيشيرتات' },
    fitNote: { en: 'Relaxed fit. Consider sizing down for a more fitted look.', ar: 'قصة واسعة. اختاري مقاسًا أصغر للقصة الضيقة.' },
    columns: [
      { key: 'size', label: { en: 'Size', ar: 'المقاس' } },
      { key: 'chest', label: { en: 'Chest (cm)', ar: 'الصدر (سم)' } },
      { key: 'waist', label: { en: 'Waist (cm)', ar: 'الخصر (سم)' } },
      { key: 'length', label: { en: 'Length (cm)', ar: 'الطول (سم)' } },
    ],
    rows: [
      { size: 'XS', chest: '82-86', waist: '62-66', length: '62' },
      { size: 'S', chest: '86-90', waist: '66-70', length: '64' },
      { size: 'M', chest: '90-94', waist: '70-74', length: '66' },
      { size: 'L', chest: '94-98', waist: '74-78', length: '68' },
      { size: 'XL', chest: '98-102', waist: '78-82', length: '70' },
    ],
  },
  shirts: {
    id: 'shirts',
    title: { en: 'Shirts Size Guide', ar: 'دليل مقاسات القمصان' },
    fitNote: { en: 'Slim fit. True to size.', ar: 'قصة ضيقة. المقاس مطابق.' },
    columns: [
      { key: 'size', label: { en: 'Size', ar: 'المقاس' } },
      { key: 'chest', label: { en: 'Chest (cm)', ar: 'الصدر (سم)' } },
      { key: 'neck', label: { en: 'Neck (cm)', ar: 'الرقبة (سم)' } },
      { key: 'sleeve', label: { en: 'Sleeve (cm)', ar: 'الكم (سم)' } },
    ],
    rows: [
      { size: 'XS', chest: '86-90', neck: '36', sleeve: '60' },
      { size: 'S', chest: '90-94', neck: '37', sleeve: '62' },
      { size: 'M', chest: '94-98', neck: '38-39', sleeve: '64' },
      { size: 'L', chest: '98-102', neck: '40-41', sleeve: '66' },
      { size: 'XL', chest: '102-106', neck: '42-43', sleeve: '68' },
    ],
  },
  blazers: {
    id: 'blazers',
    title: { en: 'Blazers & Jackets Size Guide', ar: 'دليل مقاسات البليزرات والجاكيتات' },
    fitNote: { en: 'Regular fit. Allows layering underneath.', ar: 'قصة عادية. تسمح بالطبقات تحتها.' },
    columns: [
      { key: 'size', label: { en: 'Size', ar: 'المقاس' } },
      { key: 'chest', label: { en: 'Chest (cm)', ar: 'الصدر (سم)' } },
      { key: 'shoulder', label: { en: 'Shoulder (cm)', ar: 'الكتف (سم)' } },
      { key: 'length', label: { en: 'Length (cm)', ar: 'الطول (سم)' } },
    ],
    rows: [
      { size: 'XS', chest: '88-92', shoulder: '40', length: '66' },
      { size: 'S', chest: '92-96', shoulder: '42', length: '68' },
      { size: 'M', chest: '96-100', shoulder: '44', length: '70' },
      { size: 'L', chest: '100-104', shoulder: '46', length: '72' },
      { size: 'XL', chest: '104-108', shoulder: '48', length: '74' },
    ],
  },
  trousers: {
    id: 'trousers',
    title: { en: 'Trousers & Pants Size Guide', ar: 'دليل مقاسات البنطلونات' },
    fitNote: { en: 'True to size. Slim fit through the leg.', ar: 'المقاس مطابق. قصة ضيقة على الساق.' },
    columns: [
      { key: 'size', label: { en: 'Size', ar: 'المقاس' } },
      { key: 'waist', label: { en: 'Waist (cm)', ar: 'الخصر (سم)' } },
      { key: 'hip', label: { en: 'Hip (cm)', ar: 'الورك (سم)' } },
      { key: 'inseam', label: { en: 'Inseam (cm)', ar: 'طول الساق (سم)' } },
    ],
    rows: [
      { size: 'XS', waist: '62-66', hip: '88-92', inseam: '76' },
      { size: 'S', waist: '66-70', hip: '92-96', inseam: '78' },
      { size: 'M', waist: '70-74', hip: '96-100', inseam: '80' },
      { size: 'L', waist: '74-78', hip: '100-104', inseam: '82' },
      { size: 'XL', waist: '78-82', hip: '104-108', inseam: '84' },
    ],
  },
  abayas: {
    id: 'abayas',
    title: { en: 'Abayas Size Guide', ar: 'دليل مقاسات العباءات' },
    fitNote: { en: 'Loose fit. Choose based on your height for ideal length.', ar: 'قصة واسعة. اختاري بناءً على طولك للطول المثالي.' },
    columns: [
      { key: 'size', label: { en: 'Size', ar: 'المقاس' } },
      { key: 'bust', label: { en: 'Bust (cm)', ar: 'الصدر (سم)' } },
      { key: 'length', label: { en: 'Length (cm)', ar: 'الطول (سم)' } },
      { key: 'sleeve', label: { en: 'Sleeve (cm)', ar: 'الكم (سم)' } },
    ],
    rows: [
      { size: 'XS', bust: '100', length: '138', sleeve: '55' },
      { size: 'S', bust: '104', length: '140', sleeve: '56' },
      { size: 'M', bust: '108', length: '142', sleeve: '57' },
      { size: 'L', bust: '112', length: '144', sleeve: '58' },
      { size: 'XL', bust: '116', length: '146', sleeve: '59' },
    ],
  },
  shoes: {
    id: 'shoes',
    title: { en: 'Shoes Size Guide', ar: 'دليل مقاسات الأحذية' },
    fitNote: { en: 'True to size. If between sizes, size up for comfort.', ar: 'المقاس مطابق. إذا كنت بين مقاسين، اختر الأكبر للراحة.' },
    columns: [
      { key: 'size', label: { en: 'EU', ar: 'EU' } },
      { key: 'uk', label: { en: 'UK', ar: 'UK' } },
      { key: 'us', label: { en: 'US', ar: 'US' } },
      { key: 'cm', label: { en: 'CM', ar: 'سم' } },
    ],
    rows: [
      { size: '36', uk: '3.5', us: '5.5', cm: '22.5' },
      { size: '37', uk: '4', us: '6', cm: '23' },
      { size: '38', uk: '5', us: '7', cm: '24' },
      { size: '39', uk: '6', us: '8', cm: '25' },
      { size: '40', uk: '6.5', us: '8.5', cm: '25.5' },
      { size: '41', uk: '7.5', us: '9.5', cm: '26' },
      { size: '42', uk: '8', us: '10', cm: '27' },
      { size: '43', uk: '9', us: '11', cm: '28' },
      { size: '44', uk: '10', us: '12', cm: '29' },
    ],
  },
};

/**
 * Map productTypeId / subcategoryId to a size guide key.
 * Falls back gracefully.
 */
const typeMapping: Record<string, string> = {
  // Product type IDs
  'pt-dresses': 'dresses',
  'pt-maxi': 'dresses',
  'pt-midi': 'dresses',
  'pt-mini': 'dresses',
  'pt-tshirts': 'tops',
  'pt-tops': 'tops',
  'pt-blouses': 'tops',
  'pt-shirts': 'shirts',
  'pt-blazers': 'blazers',
  'pt-jackets': 'blazers',
  'pt-coats': 'blazers',
  'pt-trousers': 'trousers',
  'pt-pants': 'trousers',
  'pt-jeans': 'trousers',
  'pt-abayas': 'abayas',
  'pt-sneakers': 'shoes',
  'pt-heels': 'shoes',
  'pt-sandals': 'shoes',
  'pt-boots': 'shoes',
  'pt-shoes': 'shoes',
  'pt-loafers': 'shoes',
  // Subcategory IDs
  'sc-dresses': 'dresses',
  'sc-tops': 'tops',
  'sc-shirts': 'shirts',
  'sc-blazers': 'blazers',
  'sc-trousers': 'trousers',
  'sc-abayas': 'abayas',
  'sc-sneakers': 'shoes',
  'sc-shoes': 'shoes',
  'sc-footwear': 'shoes',
};

/** Category-level fallbacks */
const categoryMapping: Record<string, string> = {
  'cat-women': 'dresses',
  'cat-men': 'shirts',
};

export function getSizeGuide(
  productTypeId?: string,
  subcategoryId?: string,
  categoryId?: string,
  hasSizes?: boolean,
): SizeGuideData | null {
  if (!hasSizes) return null;

  if (productTypeId && typeMapping[productTypeId]) {
    return sizeGuides[typeMapping[productTypeId]] || null;
  }
  if (subcategoryId && typeMapping[subcategoryId]) {
    return sizeGuides[typeMapping[subcategoryId]] || null;
  }
  if (categoryId && categoryMapping[categoryId]) {
    return sizeGuides[categoryMapping[categoryId]] || null;
  }
  // Generic fallback for products that have sizes
  return sizeGuides.dresses;
}

export default sizeGuides;
