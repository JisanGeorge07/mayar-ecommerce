import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage, ProductVariant } from '@/types/product';
import { useLocale } from '@/hooks/useLocale';

interface ProductGalleryProps {
  images: ProductImage[];
  variants?: ProductVariant[];
  selectedColor?: string;
}

const ProductGallery = ({ images, variants = [], selectedColor }: ProductGalleryProps) => {
  const { t, dir } = useLocale();
  const [active, setActive] = useState(0);

  // Build the display images list:
  // 1. If variants have images, show variant images (filtered by selected color if applicable)
  // 2. Fall back to product images if no variant images exist
  const displayImages = useMemo(() => {
    // Collect all variant images
    const variantImages: ProductImage[] = variants
      .filter(v => v.imageUrl)
      .map(v => ({
        id: `variant-${v.id}`,
        url: v.imageUrl!,
        alt: { en: '', ar: '' },
        colorId: v.colorId,
      }));

    if (variantImages.length === 0) {
      // No variant images exist — use product images only
      return images;
    }

    // Variant images exist — show ONLY variant images (no product images)
    if (selectedColor) {
      const selectedVariantImage = variantImages.find(img => img.colorId === selectedColor);
      const otherVariantImages = variantImages.filter(img => img.colorId !== selectedColor);
      return selectedVariantImage
        ? [selectedVariantImage, ...otherVariantImages]
        : variantImages;
    }

    return variantImages;
  }, [variants, images, selectedColor]);

  // Reset active index to 0 when selectedColor changes (to show the matching variant image)
  useEffect(() => {
    setActive(0);
  }, [selectedColor]);

  const prev = () => setActive(i => (i - 1 + displayImages.length) % displayImages.length);
  const next = () => setActive(i => (i + 1) % displayImages.length);

  if (!displayImages.length) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px]">
        {displayImages.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-md overflow-hidden border-2 transition-colors ${
              i === active ? 'border-brand' : 'border-border hover:border-muted-foreground'
            }`}
          >
            <img src={img.url} alt={t(img.alt)} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-[3/4] rounded-lg overflow-hidden bg-secondary group">
        <img
          src={displayImages[active]?.url}
          alt={displayImages[active] ? t(displayImages[active].alt) : ''}
          className="w-full h-full object-cover"
        />
        {displayImages.length > 1 && (
          <>
            <button onClick={prev} className="absolute top-1/2 start-2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 hover:bg-background transition-colors opacity-0 group-hover:opacity-100">
              {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button onClick={next} className="absolute top-1/2 end-2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 hover:bg-background transition-colors opacity-0 group-hover:opacity-100">
              {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
