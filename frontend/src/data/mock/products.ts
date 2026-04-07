import type { ProductItem, ProductColor, ProductSize, ReviewItem, ProductImage } from '@/types/product';
import dressImg from '@/assets/products/dress.jpg';
import handbagImg from '@/assets/products/handbag.jpg';
import blazerImg from '@/assets/products/blazer.jpg';
import sneakersImg from '@/assets/products/sneakers.jpg';
import perfumeImg from '@/assets/products/perfume.jpg';
import watchImg from '@/assets/products/watch.jpg';
import skincareImg from '@/assets/products/skincare.jpg';
import jewelryImg from '@/assets/products/jewelry.jpg';

const IMG: Record<string, string> = {
  dress: dressImg, handbag: handbagImg, blazer: blazerImg,
  sneakers: sneakersImg, perfume: perfumeImg, watch: watchImg,
  skincare: skincareImg, jewelry: jewelryImg,
};

const C: Record<string, ProductColor> = {
  black: { id: 'black', name: { en: 'Black', ar: 'أسود' }, hex: '#1a1a1a' },
  white: { id: 'white', name: { en: 'White', ar: 'أبيض' }, hex: '#fafafa' },
  navy: { id: 'navy', name: { en: 'Navy', ar: 'كحلي' }, hex: '#1b2a4a' },
  beige: { id: 'beige', name: { en: 'Beige', ar: 'بيج' }, hex: '#d4b896' },
  camel: { id: 'camel', name: { en: 'Camel', ar: 'جملي' }, hex: '#c19a6b' },
  blush: { id: 'blush', name: { en: 'Blush Pink', ar: 'وردي فاتح' }, hex: '#de9e9c' },
  olive: { id: 'olive', name: { en: 'Olive', ar: 'زيتوني' }, hex: '#6b7c4e' },
  burgundy: { id: 'burgundy', name: { en: 'Burgundy', ar: 'عنابي' }, hex: '#722f37' },
  gold: { id: 'gold', name: { en: 'Gold', ar: 'ذهبي' }, hex: '#c5a55a' },
  silver: { id: 'silver', name: { en: 'Silver', ar: 'فضي' }, hex: '#c0c0c0' },
  brown: { id: 'brown', name: { en: 'Brown', ar: 'بني' }, hex: '#6b4423' },
  rose: { id: 'rose', name: { en: 'Dusty Rose', ar: 'وردي' }, hex: '#c4868a' },
  nude: { id: 'nude', name: { en: 'Nude', ar: 'بيج فاتح' }, hex: '#e3c9b8' },
  blue: { id: 'blue', name: { en: 'Blue', ar: 'أزرق' }, hex: '#4a6fa5' },
};

const SZ_CL: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL'].map((l, i) => ({
  id: l.toLowerCase(), label: l, stock: [5, 12, 18, 15, 8][i],
}));

const SZ_SH: ProductSize[] = ['36', '37', '38', '39', '40', '41', '42', '43', '44'].map((l, i) => ({
  id: `s${l}`, label: l, stock: [4, 8, 12, 15, 14, 12, 10, 6, 3][i],
}));

const R: ReviewItem[] = [
  { id: 'r1', userName: 'Sarah K.', rating: 5, title: 'Absolutely love it!', comment: 'The quality exceeded my expectations. The fabric is luxurious and the fit is perfect.', date: '2025-12-15', verified: true, helpfulCount: 24 },
  { id: 'r2', userName: 'Fatima A.', rating: 4, title: 'Great quality', comment: 'Beautiful piece, well-made. Slightly different shade than shown but still gorgeous.', date: '2025-11-28', verified: true, helpfulCount: 18 },
  { id: 'r3', userName: 'Noor M.', rating: 5, title: 'Perfect gift', comment: 'Bought this as a gift and it was a huge hit. Premium packaging too!', date: '2025-11-10', verified: true, helpfulCount: 12 },
  { id: 'r4', userName: 'Layla H.', rating: 3, title: 'Decent but pricey', comment: 'Good quality but I expected more for the price. Delivery was quick.', date: '2025-10-22', verified: false, helpfulCount: 6 },
  { id: 'r5', userName: 'Ahmed R.', rating: 5, title: 'Excellent purchase', comment: 'Exactly as described. Comfortable and stylish. Will buy again.', date: '2025-10-05', verified: true, helpfulCount: 31 },
  { id: 'r6', userName: 'Maya S.', rating: 4, title: 'Very nice', comment: 'Lovely item. The color is beautiful in person. Good value.', date: '2025-09-18', verified: true, helpfulCount: 9 },
  { id: 'r7', userName: 'Omar J.', rating: 5, title: 'Top notch quality', comment: 'Premium quality and fast shipping. My new favorite.', date: '2026-01-08', verified: true, helpfulCount: 15 },
  { id: 'r8', userName: 'Hana D.', rating: 4, title: 'Love the design', comment: 'Stylish and comfortable. Runs slightly large, consider sizing down.', date: '2026-01-20', verified: true, helpfulCount: 22 },
  { id: 'r9', userName: 'Rania F.', rating: 5, title: 'Best purchase this year', comment: 'Cannot say enough good things. Attention to detail is remarkable.', date: '2026-02-14', verified: true, helpfulCount: 28 },
  { id: 'r10', userName: 'Khalid B.', rating: 4, title: 'Solid quality', comment: 'Well-constructed and looks great. Happy with my purchase.', date: '2026-02-28', verified: true, helpfulCount: 11 },
];

interface PD {
  id: string; s: string;
  b: [string, string]; n: [string, string];
  c: string; sc: string; g: 'women' | 'men' | 'unisex';
  p: number; op?: number; ik: string;
  cols?: string[]; sz?: 'c' | 's';
  nw?: boolean; bs?: boolean; ft?: boolean; sl?: boolean;
  rt: number; rc: number; rel?: string[]; rv?: ReviewItem[];
}

function mk(d: PD): ProductItem {
  const colors = (d.cols || []).map(k => C[k]).filter(Boolean);
  const sizes = d.sz === 'c' ? SZ_CL : d.sz === 's' ? SZ_SH : [];
  const imgUrl = IMG[d.ik] || IMG.dress;
  const imgs: ProductImage[] = [
    { id: `${d.id}-1`, url: imgUrl, alt: { en: d.n[0], ar: d.n[1] }, isPrimary: true },
    { id: `${d.id}-2`, url: imgUrl, alt: { en: `${d.n[0]} - view 2`, ar: `${d.n[1]} - عرض 2` } },
  ];
  return {
    id: d.id, slug: d.s,
    brand: { en: d.b[0], ar: d.b[1] },
    name: { en: d.n[0], ar: d.n[1] },
    shortDescription: { en: `Premium ${d.n[0].toLowerCase()} by ${d.b[0]}`, ar: `${d.n[1]} الفاخر من ${d.b[1]}` },
    fullDescription: { en: `Discover the ${d.n[0]} from ${d.b[0]}. Crafted with exceptional attention to detail and premium materials, this piece embodies modern elegance perfect for any occasion.`, ar: `اكتشف ${d.n[1]} من ${d.b[1]}. صُنع بعناية فائقة بمواد فاخرة، يجسد الأناقة العصرية المثالية لكل مناسبة.` },
    categoryId: d.c, subcategoryId: d.sc, gender: d.g,
    images: imgs, colors, sizes,
    variants: [{ id: `${d.id}-v1`, colorId: colors[0]?.id || '', sku: `MYR-${d.id.toUpperCase()}`, stock: 25, price: d.p, compareAtPrice: d.op, images: [`${d.id}-1`] }],
    basePriceKWD: d.p, compareAtPriceKWD: d.op,
    rating: d.rt, reviewCount: d.rc,
    isNew: d.nw, isBestSeller: d.bs, isFeatured: d.ft, isOnSale: d.sl,
    inStock: true,
    specifications: [
      { label: { en: 'Material', ar: 'الخامة' }, value: { en: 'Premium quality', ar: 'جودة عالية' } },
      { label: { en: 'Origin', ar: 'المنشأ' }, value: { en: 'Imported', ar: 'مستورد' } },
    ],
    shippingInfo: { en: 'Free delivery on orders above KWD 20. Standard delivery 2-4 business days.', ar: 'توصيل مجاني للطلبات فوق 20 د.ك. التوصيل العادي 2-4 أيام عمل.' },
    returnInfo: { en: 'Easy returns within 14 days. Items must be unworn with original tags.', ar: 'إرجاع سهل خلال 14 يوماً. يجب أن تكون القطع غير مستخدمة.' },
    careInstructions: [
      { en: 'Follow garment care label', ar: 'اتبع تعليمات العناية' },
    ],
    reviews: d.rv || [],
    relatedProductIds: d.rel || [],
  };
}

export const products: ProductItem[] = [
  // ===== WOMEN (12) =====
  mk({ id: 'p1', s: 'silk-pleated-midi-dress', b: ['Splash', 'سبلاش'], n: ['Silk Pleated Midi Dress', 'فستان حرير ميدي مطوي'], c: 'women', sc: 'dresses', g: 'women', p: 28.5, op: 42, ik: 'dress', cols: ['rose', 'navy', 'black'], sz: 'c', nw: true, ft: true, sl: true, rt: 4.8, rc: 156, rel: ['p5', 'p10', 'p6'], rv: [R[0], R[1], R[8]] }),
  mk({ id: 'p2', s: 'embroidered-open-abaya', b: ['Florabella', 'فلورابيلا'], n: ['Embroidered Open Abaya', 'عباية مفتوحة مطرزة'], c: 'women', sc: 'abayas', g: 'women', p: 35, ik: 'dress', cols: ['black', 'beige', 'navy'], sz: 'c', nw: true, rt: 4.6, rc: 89, rel: ['p11', 'p5', 'p1'] }),
  mk({ id: 'p3', s: 'cotton-wrap-blouse', b: ['Iconic', 'أيكونيك'], n: ['Cotton Wrap Blouse', 'بلوزة قطن ملفوفة'], c: 'women', sc: 'tops', g: 'women', p: 12.5, ik: 'dress', cols: ['white', 'blush', 'olive'], sz: 'c', rt: 4.3, rc: 45, rel: ['p8', 'p12', 'p6'] }),
  mk({ id: 'p4', s: 'knit-coord-set', b: ['United Colors of Benetton', 'بينيتون'], n: ['Knit Coord Set', 'طقم تريكو منسق'], c: 'women', sc: 'coord-sets', g: 'women', p: 22, op: 28, ik: 'dress', cols: ['beige', 'black'], sz: 'c', sl: true, rt: 4.5, rc: 67, rel: ['p10', 'p12', 'p1'] }),
  mk({ id: 'p5', s: 'floral-maxi-dress', b: ['Guess', 'جيس'], n: ['Floral Maxi Dress', 'فستان ماكسي زهري'], c: 'women', sc: 'dresses', g: 'women', p: 38, ik: 'dress', cols: ['rose', 'navy'], sz: 'c', nw: true, ft: true, rt: 4.7, rc: 123, rel: ['p1', 'p10', 'p2'], rv: [R[0], R[5]] }),
  mk({ id: 'p6', s: 'satin-slip-skirt', b: ['Splash', 'سبلاش'], n: ['Satin Slip Skirt', 'تنورة ساتان'], c: 'women', sc: 'skirts', g: 'women', p: 15, ik: 'dress', cols: ['black', 'burgundy', 'camel'], sz: 'c', rt: 4.4, rc: 38, rel: ['p3', 'p8', 'p1'] }),
  mk({ id: 'p7', s: 'high-waist-trousers', b: ['Lee Cooper', 'لي كوبر'], n: ['High Waist Trousers', 'بنطلون خصر عالي'], c: 'women', sc: 'trousers', g: 'women', p: 18, op: 24, ik: 'dress', cols: ['black', 'navy', 'beige'], sz: 'c', sl: true, rt: 4.2, rc: 52, rel: ['p3', 'p6', 'p4'] }),
  mk({ id: 'p8', s: 'lace-trim-camisole', b: ['Splash', 'سبلاش'], n: ['Lace Trim Camisole', 'قميص دانتيل داخلي'], c: 'women', sc: 'tops', g: 'women', p: 8.5, ik: 'dress', cols: ['white', 'blush', 'black'], sz: 'c', rt: 4.1, rc: 29, rel: ['p3', 'p6', 'p12'] }),
  mk({ id: 'p9', s: 'oversized-denim-jacket', b: ["Levi's", 'ليفايز'], n: ['Oversized Denim Jacket', 'جاكيت جينز واسع'], c: 'women', sc: 'outerwear', g: 'women', p: 32, ik: 'dress', cols: ['navy'], sz: 'c', bs: true, rt: 4.6, rc: 98, rel: ['p7', 'p1', 'p10'], rv: [R[4], R[7]] }),
  mk({ id: 'p10', s: 'ribbed-knit-dress', b: ['Iconic', 'أيكونيك'], n: ['Ribbed Knit Dress', 'فستان تريكو مضلع'], c: 'women', sc: 'dresses', g: 'women', p: 24, ik: 'dress', cols: ['camel', 'black', 'burgundy'], sz: 'c', bs: true, rt: 4.5, rc: 112, rel: ['p1', 'p5', 'p4'] }),
  mk({ id: 'p11', s: 'printed-kaftan', b: ['Florabella', 'فلورابيلا'], n: ['Printed Kaftan', 'قفطان مطبوع'], c: 'women', sc: 'kaftans', g: 'women', p: 19.5, ik: 'dress', cols: ['beige', 'rose'], sz: 'c', rt: 4.3, rc: 34, rel: ['p2', 'p5', 'p1'] }),
  mk({ id: 'p12', s: 'cropped-cardigan', b: ['United Colors of Benetton', 'بينيتون'], n: ['Cropped Cardigan', 'كارديغان قصير'], c: 'women', sc: 'knitwear', g: 'women', p: 16, ik: 'dress', cols: ['beige', 'rose', 'navy'], sz: 'c', rt: 4.4, rc: 41, rel: ['p4', 'p10', 'p3'] }),

  // ===== MEN (10) =====
  mk({ id: 'p13', s: 'slim-fit-oxford-shirt', b: ['Beverly Hills Polo Club', 'بيفرلي هيلز'], n: ['Slim Fit Oxford Shirt', 'قميص أكسفورد ضيق'], c: 'men', sc: 'shirts', g: 'men', p: 14.5, ik: 'blazer', cols: ['white', 'navy', 'blue'], sz: 'c', rt: 4.5, rc: 87, rel: ['p21', 'p18', 'p15'] }),
  mk({ id: 'p14', s: 'crew-neck-tshirt', b: ['GAP', 'جاب'], n: ['Crew Neck T-Shirt', 'تيشيرت رقبة دائرية'], c: 'men', sc: 't-shirts', g: 'men', p: 7.5, ik: 'blazer', cols: ['white', 'black', 'navy', 'olive'], sz: 'c', rt: 4.3, rc: 156, rel: ['p18', 'p13', 'p16'] }),
  mk({ id: 'p15', s: 'wool-blend-blazer', b: ['Jack & Jones', 'جاك أند جونز'], n: ['Wool Blend Blazer', 'بليزر صوف'], c: 'men', sc: 'blazers', g: 'men', p: 45, ik: 'blazer', cols: ['navy', 'black'], sz: 'c', ft: true, rt: 4.7, rc: 64, rel: ['p13', 'p16', 'p22'], rv: [R[4], R[6], R[9]] }),
  mk({ id: 'p16', s: 'chino-pants', b: ['Aeropostale', 'ايروبوستال'], n: ['Chino Pants', 'بنطلون تشينو'], c: 'men', sc: 'trousers', g: 'men', p: 16, ik: 'blazer', cols: ['beige', 'navy', 'olive'], sz: 'c', rt: 4.4, rc: 73, rel: ['p15', 'p19', 'p13'] }),
  mk({ id: 'p17', s: 'leather-belt-men', b: ['Lee Cooper', 'لي كوبر'], n: ['Leather Belt', 'حزام جلد'], c: 'men', sc: 'accessories', g: 'men', p: 9, ik: 'blazer', cols: ['black', 'brown'], rt: 4.5, rc: 42, rel: ['p28', 'p13', 'p15'] }),
  mk({ id: 'p18', s: 'classic-polo-shirt', b: ['Kappa', 'كابا'], n: ['Classic Polo Shirt', 'بولو كلاسيكي'], c: 'men', sc: 'polos', g: 'men', p: 11, ik: 'blazer', cols: ['white', 'navy', 'black'], sz: 'c', bs: true, rt: 4.6, rc: 189, rel: ['p14', 'p13', 'p21'], rv: [R[4], R[9]] }),
  mk({ id: 'p19', s: 'slim-fit-jeans', b: ["Levi's", 'ليفايز'], n: ['Slim Fit Jeans', 'جينز ضيق'], c: 'men', sc: 'jeans', g: 'men', p: 22, op: 28, ik: 'blazer', cols: ['navy'], sz: 'c', sl: true, rt: 4.4, rc: 134, rel: ['p16', 'p15', 'p14'] }),
  mk({ id: 'p20', s: 'bomber-jacket', b: ['Jack & Jones', 'جاك أند جونز'], n: ['Bomber Jacket', 'جاكيت بومبر'], c: 'men', sc: 'outerwear', g: 'men', p: 35, op: 45, ik: 'blazer', cols: ['black', 'navy'], sz: 'c', sl: true, rt: 4.6, rc: 56, rel: ['p15', 'p22', 'p9'] }),
  mk({ id: 'p21', s: 'linen-shirt', b: ['Splash', 'سبلاش'], n: ['Linen Shirt', 'قميص كتان'], c: 'men', sc: 'shirts', g: 'men', p: 13.5, ik: 'blazer', cols: ['white', 'beige'], sz: 'c', nw: true, rt: 4.3, rc: 28, rel: ['p13', 'p18', 'p14'] }),
  mk({ id: 'p22', s: 'merino-wool-sweater', b: ['Beverly Hills Polo Club', 'بيفرلي هيلز'], n: ['Merino Wool Sweater', 'سويتر صوف مرينو'], c: 'men', sc: 'knitwear', g: 'men', p: 28, ik: 'blazer', cols: ['camel', 'navy', 'burgundy'], sz: 'c', rt: 4.5, rc: 45, rel: ['p15', 'p20', 'p13'] }),

  // ===== ACCESSORIES - BAGS (8) =====
  mk({ id: 'p23', s: 'italian-leather-tote', b: ['Celeste', 'سيليست'], n: ['Italian Leather Tote', 'حقيبة توت جلد إيطالي'], c: 'accessories', sc: 'bags', g: 'women', p: 42, ik: 'handbag', cols: ['camel', 'black', 'burgundy'], ft: true, bs: true, rt: 4.8, rc: 201, rel: ['p24', 'p25', 'p27'], rv: [R[0], R[2], R[8], R[5]] }),
  mk({ id: 'p24', s: 'crossbody-mini-bag', b: ['Bessie London', 'بيسي لندن'], n: ['Crossbody Mini Bag', 'حقيبة كروس صغيرة'], c: 'accessories', sc: 'bags', g: 'women', p: 18, op: 24, ik: 'handbag', cols: ['black', 'blush', 'camel'], sl: true, rt: 4.5, rc: 89, rel: ['p23', 'p25', 'p30'] }),
  mk({ id: 'p25', s: 'structured-satchel', b: ['Chrisbella', 'كريسبيلا'], n: ['Structured Satchel', 'حقيبة ساتشل'], c: 'accessories', sc: 'bags', g: 'women', p: 25, ik: 'handbag', cols: ['navy', 'camel'], rt: 4.4, rc: 56, rel: ['p23', 'p24', 'p27'] }),
  mk({ id: 'p26', s: 'canvas-backpack', b: ['Beverly Hills Polo Club', 'بيفرلي هيلز'], n: ['Canvas Backpack', 'حقيبة ظهر قماش'], c: 'accessories', sc: 'bags', g: 'unisex', p: 15, ik: 'handbag', cols: ['navy', 'olive', 'beige'], rt: 4.3, rc: 67, rel: ['p29', 'p28', 'p25'] }),
  mk({ id: 'p27', s: 'evening-clutch', b: ['Celeste', 'سيليست'], n: ['Evening Clutch', 'حقيبة سهرة'], c: 'accessories', sc: 'bags', g: 'women', p: 22, ik: 'handbag', cols: ['gold', 'silver', 'black'], rt: 4.6, rc: 34, rel: ['p23', 'p42', 'p41'] }),
  mk({ id: 'p28', s: 'leather-wallet', b: ['Beverly Hills Polo Club', 'بيفرلي هيلز'], n: ['Leather Wallet', 'محفظة جلد'], c: 'accessories', sc: 'wallets', g: 'unisex', p: 12, ik: 'handbag', cols: ['black', 'brown'], rt: 4.5, rc: 93, rel: ['p17', 'p26', 'p29'] }),
  mk({ id: 'p29', s: 'travel-duffel-bag', b: ['Beverly Hills Polo Club', 'بيفرلي هيلز'], n: ['Travel Duffel Bag', 'حقيبة سفر'], c: 'accessories', sc: 'travel', g: 'unisex', p: 28, op: 35, ik: 'handbag', cols: ['navy', 'camel'], sl: true, rt: 4.4, rc: 47, rel: ['p26', 'p28', 'p31'] }),
  mk({ id: 'p30', s: 'woven-straw-tote', b: ['Splash', 'سبلاش'], n: ['Woven Straw Tote', 'حقيبة قش'], c: 'accessories', sc: 'bags', g: 'women', p: 16, ik: 'handbag', cols: ['beige', 'camel'], nw: true, rt: 4.2, rc: 23, rel: ['p23', 'p24', 'p25'] }),

  // ===== SHOES (8) =====
  mk({ id: 'p31', s: 'leather-block-heels', b: ['Le Confort', 'لو كونفورت'], n: ['Leather Block Heels', 'كعب عريض جلد'], c: 'shoes', sc: 'heels', g: 'women', p: 24, ik: 'sneakers', cols: ['black', 'nude', 'burgundy'], sz: 's', rt: 4.5, rc: 78, rel: ['p36', 'p37', 'p34'] }),
  mk({ id: 'p32', s: 'running-shoes', b: ['Skechers', 'سكيتشرز'], n: ['Running Shoes', 'حذاء جري'], c: 'shoes', sc: 'sneakers', g: 'unisex', p: 22, ik: 'sneakers', cols: ['black', 'white'], sz: 's', bs: true, rt: 4.7, rc: 245, rel: ['p33', 'p38', 'p35'], rv: [R[4], R[6], R[9]] }),
  mk({ id: 'p33', s: 'canvas-sneakers', b: ['Adidas', 'أديداس'], n: ['Canvas Sneakers', 'حذاء رياضي قماش'], c: 'shoes', sc: 'sneakers', g: 'unisex', p: 28, ik: 'sneakers', cols: ['white', 'navy'], sz: 's', rt: 4.6, rc: 167, rel: ['p32', 'p38', 'p35'] }),
  mk({ id: 'p34', s: 'leather-loafers', b: ['Le Confort', 'لو كونفورت'], n: ['Leather Loafers', 'حذاء لوفر جلد'], c: 'shoes', sc: 'loafers', g: 'men', p: 26, ik: 'sneakers', cols: ['brown', 'black'], sz: 's', rt: 4.4, rc: 56, rel: ['p37', 'p31', 'p36'] }),
  mk({ id: 'p35', s: 'sport-sandals', b: ['Puma', 'بوما'], n: ['Sport Sandals', 'صندل رياضي'], c: 'shoes', sc: 'sandals', g: 'unisex', p: 15, op: 18, ik: 'sneakers', cols: ['black', 'navy'], sz: 's', sl: true, rt: 4.3, rc: 89, rel: ['p32', 'p33', 'p38'] }),
  mk({ id: 'p36', s: 'ankle-boots', b: ['Le Confort', 'لو كونفورت'], n: ['Ankle Boots', 'بوت قصير'], c: 'shoes', sc: 'boots', g: 'women', p: 32, ik: 'sneakers', cols: ['black', 'camel'], sz: 's', nw: true, rt: 4.5, rc: 34, rel: ['p31', 'p37', 'p34'] }),
  mk({ id: 'p37', s: 'suede-moccasins', b: ['Le Confort', 'لو كونفورت'], n: ['Suede Moccasins', 'حذاء موكاسين شامواه'], c: 'shoes', sc: 'loafers', g: 'men', p: 20, ik: 'sneakers', cols: ['camel', 'navy'], sz: 's', rt: 4.4, rc: 42, rel: ['p34', 'p36', 'p31'] }),
  mk({ id: 'p38', s: 'mesh-training-shoes', b: ['Adidas', 'أديداس'], n: ['Mesh Training Shoes', 'حذاء تدريب شبكي'], c: 'shoes', sc: 'sneakers', g: 'unisex', p: 25, op: 32, ik: 'sneakers', cols: ['white', 'black'], sz: 's', sl: true, rt: 4.6, rc: 128, rel: ['p32', 'p33', 'p35'] }),

  // ===== WATCHES & JEWELRY (5) =====
  mk({ id: 'p39', s: 'classic-analog-watch', b: ['Beverly Hills Polo Club', 'بيفرلي هيلز'], n: ['Classic Analog Watch', 'ساعة كلاسيكية'], c: 'accessories', sc: 'watches', g: 'unisex', p: 35, ik: 'watch', cols: ['gold', 'silver'], ft: true, rt: 4.7, rc: 112, rel: ['p43', 'p41', 'p42'], rv: [R[2], R[6]] }),
  mk({ id: 'p40', s: 'gold-hoop-earrings', b: ['Splash', 'سبلاش'], n: ['Gold Hoop Earrings', 'أقراط ذهبية دائرية'], c: 'accessories', sc: 'jewelry', g: 'women', p: 8.5, ik: 'jewelry', cols: ['gold'], rt: 4.5, rc: 67, rel: ['p41', 'p42', 'p27'] }),
  mk({ id: 'p41', s: 'layered-necklace-set', b: ['Splash', 'سبلاش'], n: ['Layered Necklace Set', 'طقم قلادات متعددة'], c: 'accessories', sc: 'jewelry', g: 'women', p: 12, ik: 'jewelry', cols: ['gold', 'silver'], rt: 4.4, rc: 45, rel: ['p40', 'p42', 'p27'] }),
  mk({ id: 'p42', s: 'crystal-bracelet', b: ['Splash', 'سبلاش'], n: ['Crystal Bracelet', 'سوار كريستال'], c: 'accessories', sc: 'jewelry', g: 'women', p: 9.5, op: 12, ik: 'jewelry', cols: ['gold', 'silver'], sl: true, rt: 4.3, rc: 34, rel: ['p40', 'p41', 'p39'] }),
  mk({ id: 'p43', s: 'chronograph-sport-watch', b: ['Beverly Hills Polo Club', 'بيفرلي هيلز'], n: ['Chronograph Sport Watch', 'ساعة كرونوغراف رياضية'], c: 'accessories', sc: 'watches', g: 'men', p: 48, ik: 'watch', cols: ['black', 'silver'], rt: 4.8, rc: 89, rel: ['p39', 'p17', 'p28'] }),

  // ===== BEAUTY (10) =====
  mk({ id: 'p44', s: 'matte-liquid-lipstick', b: ['Makeup Revolution', 'ميكب ريفوليوشن'], n: ['Matte Liquid Lipstick', 'أحمر شفاه سائل مات'], c: 'beauty', sc: 'makeup', g: 'women', p: 3.5, ik: 'skincare', rt: 4.6, rc: 234, rel: ['p45', 'p46', 'p47'] }),
  mk({ id: 'p45', s: 'foundation-spf25', b: ['Maybelline', 'ميبيلين'], n: ['Foundation SPF 25', 'كريم أساس واقي'], c: 'beauty', sc: 'makeup', g: 'women', p: 5, ik: 'skincare', rt: 4.4, rc: 187, rel: ['p44', 'p46', 'p53'] }),
  mk({ id: 'p46', s: 'volumizing-mascara', b: ['Bourjois', 'بورجوا'], n: ['Volumizing Mascara', 'ماسكارا تكثيف'], c: 'beauty', sc: 'makeup', g: 'women', p: 4.5, ik: 'skincare', bs: true, rt: 4.7, rc: 312, rel: ['p44', 'p45', 'p47'], rv: [R[0], R[5], R[8]] }),
  mk({ id: 'p47', s: 'eye-shadow-palette', b: ['Rimmel', 'ريميل'], n: ['Eye Shadow Palette', 'باليت ظلال عيون'], c: 'beauty', sc: 'makeup', g: 'women', p: 7, op: 9, ik: 'skincare', sl: true, rt: 4.5, rc: 156, rel: ['p44', 'p46', 'p45'] }),
  mk({ id: 'p48', s: 'oud-rose-parfum', b: ['Splash', 'سبلاش'], n: ['Oud Rose Eau de Parfum', 'عطر عود وورد'], c: 'beauty', sc: 'fragrance', g: 'unisex', p: 18, ik: 'perfume', ft: true, rt: 4.8, rc: 98, rel: ['p51', 'p52', 'p49'], rv: [R[2], R[7]] }),
  mk({ id: 'p49', s: 'vitamin-c-serum', b: ['Iconic', 'أيكونيك'], n: ['Vitamin C Serum', 'سيروم فيتامين سي'], c: 'beauty', sc: 'skincare', g: 'unisex', p: 8, ik: 'skincare', nw: true, bs: true, rt: 4.6, rc: 178, rel: ['p50', 'p51', 'p48'] }),
  mk({ id: 'p50', s: 'hydrating-face-cream', b: ['Iconic', 'أيكونيك'], n: ['Hydrating Face Cream', 'كريم مرطب للوجه'], c: 'beauty', sc: 'skincare', g: 'unisex', p: 6.5, ik: 'skincare', rt: 4.4, rc: 89, rel: ['p49', 'p51', 'p52'] }),
  mk({ id: 'p51', s: 'argan-hair-oil', b: ['Splash', 'سبلاش'], n: ['Argan Hair Oil', 'زيت أرغان للشعر'], c: 'beauty', sc: 'haircare', g: 'unisex', p: 5.5, ik: 'skincare', rt: 4.5, rc: 67, rel: ['p49', 'p50', 'p52'] }),
  mk({ id: 'p52', s: 'body-lotion-gift-set', b: ['Splash', 'سبلاش'], n: ['Body Lotion Gift Set', 'طقم لوشن هدية'], c: 'beauty', sc: 'bath-body', g: 'unisex', p: 12, op: 15, ik: 'skincare', sl: true, rt: 4.3, rc: 56, rel: ['p50', 'p51', 'p48'] }),
  mk({ id: 'p53', s: 'setting-spray', b: ['Essence', 'إيسينس'], n: ['Setting Spray', 'مثبت مكياج'], c: 'beauty', sc: 'makeup', g: 'women', p: 3, ik: 'skincare', rt: 4.2, rc: 145, rel: ['p44', 'p45', 'p46'] }),
];

// Helper exports
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getProductsByCategory = (catId: string) => products.filter(p => p.categoryId === catId);
export const getBestSellers = () => products.filter(p => p.isBestSeller);
export const getNewArrivals = () => products.filter(p => p.isNew);
export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getSaleProducts = () => products.filter(p => p.isOnSale);
export const getRelatedProducts = (productId: string) => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  return product.relatedProductIds.map(id => products.find(p => p.id === id)).filter(Boolean) as ProductItem[];
};
