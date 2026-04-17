import { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
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
  const primaryImg = product.images.find(i => i.isPrimary) || product.images[0];

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [wishlistPopupOpen, setWishlistPopupOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(defaultVariant?.colorId || '');
  const [hoveredColorId, setHoveredColorId] = useState<string | null>(null);

  const liked = isInWishlist(product.id);

  // Check if product has selectable variants (more than one color or size)
  const hasVariants = (product.colors && product.colors.length > 1) || (product.sizes && product.sizes.length > 1);

  // Use hovered or selected color to determine the variant image
  const activeColorId = hoveredColorId || selectedColorId;
  const activeVariant = product.variants.find(v => v.colorId === activeColorId) || defaultVariant;
  
  const displayImageUrl = activeVariant?.imageUrl || primaryImg?.url || '/placeholder.png';
  const displayImageAlt = primaryImg ? t(primaryImg.alt) : t(product.name);

  // Use variant price if available, otherwise fall back to product base price
  const basePriceKWD = activeVariant?.basePriceKWD ?? product.basePriceKWD;
  const basePriceINR = activeVariant?.basePriceINR ?? product.basePriceINR;
  const compareAtPriceKWD = activeVariant?.compareAtPriceKWD ?? product.compareAtPriceKWD;
  const compareAtPriceINR = activeVariant?.compareAtPriceINR ?? product.compareAtPriceINR;

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(true);
  };

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:shadow-md transition-shadow flex flex-col h-full">
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
        <div className={`p-3 flex-1 flex flex-col ${compact ? 'p-2' : 'p-3'}`}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5 truncate">
            {t(product.brand)}
          </p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-foreground leading-tight mb-1.5 line-clamp-2 hover:text-brand transition-colors">
              {t(product.name)}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 mt-auto pt-2">
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

          {/* Color swatches + Cart Button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 min-w-0">
              {product.colors.length > 0 && (
                <>
                  {product.colors.slice(0, 5).map(color => (
                    <button
                      key={color.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColorId(color.id);
                      }}
                      onMouseEnter={() => setHoveredColorId(color.id)}
                      onMouseLeave={() => setHoveredColorId(null)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all`}
                      style={{ backgroundColor: color.hex }}
                      title={t(color.name)}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
                  )}
                </>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-1.5 rounded bg-header text-header-foreground hover:bg-header/90 transition-colors flex-shrink-0 ms-auto"
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>


      {/* Quick Add Popup for Cart */}
      {quickAddOpen && (
        <QuickAddPopup
          product={product}
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
          mode="cart"
        />
      )}

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
