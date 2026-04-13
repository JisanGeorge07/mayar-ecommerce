import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage, ProductVariant } from '@/types/product';
import { useLocale } from '@/hooks/useLocale';

interface ProductGalleryProps {
  images: ProductImage[];
  variants?: ProductVariant[];
  selectedColor?: string;
  selectedSize?: string;
}

const ProductGallery = ({ images, variants = [], selectedColor, selectedSize }: ProductGalleryProps) => {
  const { t, dir } = useLocale();
  const [active, setActive] = useState(0);

  // Build the display images list:
  // 1. If variants have images, show variant images (filtered by selected color if applicable)
  // 2. Fall back to product images if no variant images exist
  const displayImages = useMemo(() => {
    // Collect all variant images, deduplicating by URL so we don't show identical thumbnails
    const variantImages: ProductImage[] = [];
    const seenUrls = new Set<string>();

    for (const v of variants) {
      if (v.imageUrl && !seenUrls.has(v.imageUrl)) {
        seenUrls.add(v.imageUrl);
        variantImages.push({
          id: `variant-${v.id}`,
          url: v.imageUrl,
          alt: { en: '', ar: '' },
          colorId: v.colorId,
        });
      }
    }

    if (variantImages.length === 0) {
      // No variant images exist — use product images only
      return images;
    }

    // Variant images exist — show ONLY variant images that match the selected color
    if (selectedColor) {
      const selectedColorImages = variantImages.filter(img => img.colorId === selectedColor);
      return selectedColorImages.length > 0 ? selectedColorImages : variantImages;
    }

    return variantImages;
  }, [variants, images, selectedColor]);

  // Update active index when size changes or selectedColor changes
  useEffect(() => {
    if (selectedSize && selectedColor && variants.length > 0) {
      // Find the variant matching the selected color AND size
      const targetVariant = variants.find(v => v.colorId === selectedColor && v.sizeId === selectedSize);
      if (targetVariant?.imageUrl) {
        // Find this exact image URL in our displayImages gallery
        const idx = displayImages.findIndex(img => img.url === targetVariant.imageUrl);
        if (idx !== -1) {
          setActive(idx);
          return;
        }
      }
    }
    setActive(0);
  }, [selectedColor, selectedSize, displayImages, variants]);

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
