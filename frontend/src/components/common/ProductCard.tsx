import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import type { ProductItem } from '@/types/product';
import { useWishlist } from '@/context/WishlistContext';
import QuickAddPopup from '@/components/common/QuickAddPopup';

interface ProductCardProps {
  product: ProductItem;
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { t, formatPrice, getPrice } = useLocale();
  const { settings } = useSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Find default variant for pricing, image, and wishlist
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];

  // Use default variant image if available, otherwise fall back to product images
  const defaultVariantImageUrl = defaultVariant?.imageUrl;
  const primaryImg = product.images.find(i => i.isPrimary) || product.images[0];
  const displayImageUrl = defaultVariantImageUrl || primaryImg?.url || '/placeholder.png';
  const displayImageAlt = primaryImg ? t(primaryImg.alt) : t(product.name);

  const [wishlistPopupOpen, setWishlistPopupOpen] = useState(false);

  const liked = isInWishlist(product.id);

  // Check if product has selectable variants (more than one color or size)
  const hasVariants = (product.colors && product.colors.length > 1) || (product.sizes && product.sizes.length > 1);

  // Use variant price if available, otherwise fall back to product base price
  const basePriceKWD = defaultVariant?.basePriceKWD ?? product.basePriceKWD;
  const basePriceINR = defaultVariant?.basePriceINR ?? product.basePriceINR;
  const compareAtPriceKWD = defaultVariant?.compareAtPriceKWD ?? product.compareAtPriceKWD;
  const compareAtPriceINR = defaultVariant?.compareAtPriceINR ?? product.compareAtPriceINR;

  const basePrice = getPrice(basePriceKWD, basePriceINR);
  const comparePrice = getPrice(compareAtPriceKWD, compareAtPriceINR);
  const discount = comparePrice
    ? Math.round((1 - basePrice / comparePrice) * 100)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) {
      if (hasVariants) {
        setWishlistPopupOpen(true);
      } else {
        toggleWishlist(product.id, defaultVariant?.id);
      }
    } else {
      // If already liked, remove everything for this product
      toggleWishlist(product.id);
    }
  };

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:shadow-md transition-shadow">
        {/* Image */}
        <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={displayImageUrl}
            alt={displayImageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-2 start-2 flex flex-col gap-1">
            {product.isOnSale && discount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-header text-header-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>
          {/* Wishlist */}
          {settings?.enableWishlist && (
            <button
              onClick={handleWishlist}
              className="absolute top-2 end-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10"
              aria-label="Wishlist"
            >
              <Heart size={16} className={liked ? 'fill-destructive text-destructive' : 'text-muted-foreground'} />
            </button>
          )}
        </Link>

        {/* Info */}
        <div className={`p-3 ${compact ? 'p-2' : 'p-3'}`}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5 truncate">
            {t(product.brand)}
          </p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-foreground leading-tight mb-1.5 line-clamp-2 hover:text-brand transition-colors">
              {t(product.name)}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 mt-6">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={11}
                  className={star <= Math.round(product.rating) ? 'fill-brand text-brand' : 'text-border'}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{formatPrice(basePrice)}</span>
            {comparePrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
            )}
          </div>

          {/* Color swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-4">
              {product.colors.slice(0, 5).map(color => (
                <span
                  key={color.id}
                  className="w-3.5 h-3.5 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={t(color.name)}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Variant Popup */}
      {wishlistPopupOpen && hasVariants && (
        <QuickAddPopup
          product={product}
          open={wishlistPopupOpen}
          onOpenChange={setWishlistPopupOpen}
          mode="wishlist"
        />
      )}
    </>
  );
};

export default ProductCard;
