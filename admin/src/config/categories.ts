import type { Category, Subcategory, ProductType } from '@/types';

const id = (prefix: string, n: number) => `${prefix}-${n}`;

export const DEFAULT_CATEGORIES: Category[] = [
  { id: id('cat', 1), name: 'Women', slug: 'women', status: 'active', created_at: '' },
  { id: id('cat', 2), name: 'Men', slug: 'men', status: 'active', created_at: '' },
  { id: id('cat', 3), name: 'Beauty', slug: 'beauty', status: 'active', created_at: '' },
  { id: id('cat', 4), name: 'Accessories', slug: 'accessories', status: 'active', created_at: '' },
  { id: id('cat', 5), name: 'Watches', slug: 'watches', status: 'active', created_at: '' },
  { id: id('cat', 6), name: 'Fragrance', slug: 'fragrance', status: 'active', created_at: '' },
  { id: id('cat', 7), name: 'Home & Living', slug: 'home-living', status: 'active', created_at: '' },
];

export const DEFAULT_SUBCATEGORIES: Subcategory[] = [
  // Women
  { id: id('sub', 1), category_id: id('cat', 1), name: 'Dresses', slug: 'dresses', status: 'active' },
  { id: id('sub', 2), category_id: id('cat', 1), name: 'Tops', slug: 'tops', status: 'active' },
  { id: id('sub', 3), category_id: id('cat', 1), name: 'Handbags', slug: 'handbags', status: 'active' },
  { id: id('sub', 4), category_id: id('cat', 1), name: 'Heels', slug: 'heels', status: 'active' },
  { id: id('sub', 5), category_id: id('cat', 1), name: 'Jewelry', slug: 'jewelry', status: 'active' },
  // Men
  { id: id('sub', 6), category_id: id('cat', 2), name: 'Clothing', slug: 'clothing', status: 'active' },
  { id: id('sub', 7), category_id: id('cat', 2), name: 'T-Shirts', slug: 't-shirts', status: 'active' },
  { id: id('sub', 8), category_id: id('cat', 2), name: 'Shirts', slug: 'shirts', status: 'active' },
  { id: id('sub', 9), category_id: id('cat', 2), name: 'Blazers', slug: 'blazers', status: 'active' },
  { id: id('sub', 10), category_id: id('cat', 2), name: 'Sneakers', slug: 'sneakers', status: 'active' },
  { id: id('sub', 11), category_id: id('cat', 2), name: 'Watches', slug: 'men-watches', status: 'active' },
  // Beauty
  { id: id('sub', 12), category_id: id('cat', 3), name: 'Makeup', slug: 'makeup', status: 'active' },
  { id: id('sub', 13), category_id: id('cat', 3), name: 'Skincare', slug: 'skincare', status: 'active' },
  { id: id('sub', 14), category_id: id('cat', 3), name: 'Bath & Body', slug: 'bath-body', status: 'active' },
  { id: id('sub', 15), category_id: id('cat', 3), name: 'Hair Care', slug: 'hair-care', status: 'active' },
  { id: id('sub', 16), category_id: id('cat', 3), name: 'Beauty Tools', slug: 'beauty-tools', status: 'active' },
  // Accessories
  { id: id('sub', 17), category_id: id('cat', 4), name: 'Handbags', slug: 'acc-handbags', status: 'active' },
  { id: id('sub', 18), category_id: id('cat', 4), name: 'Wallets', slug: 'wallets', status: 'active' },
  { id: id('sub', 19), category_id: id('cat', 4), name: 'Backpacks', slug: 'backpacks', status: 'active' },
  { id: id('sub', 20), category_id: id('cat', 4), name: 'Jewellery', slug: 'jewellery', status: 'active' },
  { id: id('sub', 21), category_id: id('cat', 4), name: 'Sunglasses', slug: 'sunglasses', status: 'active' },
  // Watches
  { id: id('sub', 22), category_id: id('cat', 5), name: "Men's Watches", slug: 'mens-watches', status: 'active' },
  { id: id('sub', 23), category_id: id('cat', 5), name: "Women's Watches", slug: 'womens-watches', status: 'active' },
  { id: id('sub', 24), category_id: id('cat', 5), name: 'Smart Watches', slug: 'smart-watches', status: 'active' },
  { id: id('sub', 25), category_id: id('cat', 5), name: 'Classic Watches', slug: 'classic-watches', status: 'active' },
  // Fragrance
  { id: id('sub', 26), category_id: id('cat', 6), name: 'Perfumes', slug: 'perfumes', status: 'active' },
  { id: id('sub', 27), category_id: id('cat', 6), name: 'Oriental Scents', slug: 'oriental-scents', status: 'active' },
  { id: id('sub', 28), category_id: id('cat', 6), name: 'Gift Sets', slug: 'gift-sets', status: 'active' },
  { id: id('sub', 29), category_id: id('cat', 6), name: 'Mist & Sprays', slug: 'mist-sprays', status: 'active' },
  // Home & Living
  { id: id('sub', 30), category_id: id('cat', 7), name: 'Decor', slug: 'decor', status: 'active' },
  { id: id('sub', 31), category_id: id('cat', 7), name: 'Candles', slug: 'candles', status: 'active' },
  { id: id('sub', 32), category_id: id('cat', 7), name: 'Storage', slug: 'storage', status: 'active' },
  { id: id('sub', 33), category_id: id('cat', 7), name: 'Tabletop', slug: 'tabletop', status: 'active' },
];

export const DEFAULT_PRODUCT_TYPES: ProductType[] = [
  { id: id('pt', 1), subcategory_id: id('sub', 7), name: 'T-Shirt', slug: 't-shirt', status: 'active' },
  { id: id('pt', 2), subcategory_id: id('sub', 8), name: 'Polo Shirt', slug: 'polo-shirt', status: 'active' },
  { id: id('pt', 3), subcategory_id: id('sub', 9), name: 'Blazer', slug: 'blazer', status: 'active' },
  { id: id('pt', 4), subcategory_id: id('sub', 1), name: 'Dress', slug: 'dress', status: 'active' },
  { id: id('pt', 5), subcategory_id: id('sub', 3), name: 'Handbag', slug: 'handbag', status: 'active' },
  { id: id('pt', 6), subcategory_id: id('sub', 26), name: 'Perfume', slug: 'perfume', status: 'active' },
  { id: id('pt', 7), subcategory_id: id('sub', 5), name: 'Earrings', slug: 'earrings', status: 'active' },
  { id: id('pt', 8), subcategory_id: id('sub', 22), name: 'Watch', slug: 'watch', status: 'active' },
  { id: id('pt', 9), subcategory_id: id('sub', 13), name: 'Skincare Serum', slug: 'skincare-serum', status: 'active' },
  { id: id('pt', 10), subcategory_id: id('sub', 4), name: 'Sandals', slug: 'sandals', status: 'active' },
  { id: id('pt', 11), subcategory_id: id('sub', 6), name: 'Shirt', slug: 'shirt', status: 'active' },
  { id: id('pt', 12), subcategory_id: id('sub', 10), name: 'Sneaker', slug: 'sneaker', status: 'active' },
  { id: id('pt', 13), subcategory_id: id('sub', 2), name: 'Blouse', slug: 'blouse', status: 'active' },
  { id: id('pt', 14), subcategory_id: id('sub', 12), name: 'Lipstick', slug: 'lipstick', status: 'active' },
  { id: id('pt', 15), subcategory_id: id('sub', 30), name: 'Vase', slug: 'vase', status: 'active' },
  { id: id('pt', 16), subcategory_id: id('sub', 31), name: 'Candle', slug: 'candle', status: 'active' },
  { id: id('pt', 17), subcategory_id: id('sub', 21), name: 'Sunglasses', slug: 'sunglasses-type', status: 'active' },
  { id: id('pt', 18), subcategory_id: id('sub', 18), name: 'Wallet', slug: 'wallet', status: 'active' },
  { id: id('pt', 19), subcategory_id: id('sub', 14), name: 'Body Wash', slug: 'body-wash', status: 'active' },
  { id: id('pt', 20), subcategory_id: id('sub', 24), name: 'Smart Watch', slug: 'smart-watch', status: 'active' },
];
