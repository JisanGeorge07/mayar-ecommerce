export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const generateSKU = (brand: string, name: string, variant?: string): string => {
  const b = brand.substring(0, 3).toUpperCase();
  const n = name.substring(0, 4).toUpperCase().replace(/\s/g, '');
  const v = variant ? `-${variant.substring(0, 3).toUpperCase()}` : '';
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${b}-${n}${v}-${rand}`;
};

export const calcDiscountPercent = (base: number, compare: number): number => {
  if (!compare || compare <= base) return 0;
  return Math.round(((compare - base) / compare) * 100);
};
