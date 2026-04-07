import { useState, useMemo } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import type { ProductDto } from '@/services/api/productService';
import { useWishlist } from '@/context/WishlistContext';
import { mapProductDtoToProductItem } from '@/utils/productMapper';
import QuickAddPopup from '@/components/common/QuickAddPopup';

interface ApiProductCardProps {
  product: ProductDto;
  compact?: boolean;
}

const ApiProductCard = ({ product, compact }: ApiProductCardProps) => {
  const { lang, formatPrice, getPrice } = useLocale();
  const { settings } = useSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [wishlistPopupOpen, setWishlistPopupOpen] = useState(false);

  // Find default variant for pricing and wishlist
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];

  const liked = isInWishlist(product.id, defaultVariant?.id);
  const getText = (en?: string, ar?: string) => {
    return lang === 'ar' ? (ar || en || '') : (en || ar || '');
  };

  const primaryImg = product.images?.find(i => i.imageUrl) || product.images?.[0];

  // Use variant price if available, otherwise fall back to product base price
  const basePriceKWD = defaultVariant?.basePriceKWD ?? product.basePriceKWD;
  const basePriceINR = defaultVariant?.basePriceINR ?? product.basePriceINR;
  const compareAtPriceKWD = defaultVariant?.compareAtPriceKWD ?? product.compareAtPriceKWD;
  const compareAtPriceINR = defaultVariant?.compareAtPriceINR ?? product.compareAtPriceINR;

  const basePrice = getPrice(basePriceKWD, basePriceINR);
  const comparePrice = getPrice(compareAtPriceKWD, compareAtPriceINR);
  const discount = comparePrice && basePrice
    ? Math.round((1 - basePrice / comparePrice) * 100)
    : 0;

  // Check if product has variants (colors or sizes)
  const hasVariants = (product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0);

  // Convert to ProductItem for QuickAddPopup (only when popup is open to avoid unnecessary computation)
  const productItem = useMemo(() => {
    if (!quickAddOpen && !wishlistPopupOpen) return null;
    return mapProductDtoToProductItem(product);
  }, [product, quickAddOpen, wishlistPopupOpen]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants && !liked) {
      setWishlistPopupOpen(true);
    } else {
      toggleWishlist(product.id, defaultVariant?.id);
    }
  };

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:shadow-md transition-shadow flex flex-col h-full">
        {/* Image */}
        <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={primaryImg?.imageUrl || '/placeholder.png'}
            alt={primaryImg?.imageAlt || getText(product.nameEnglish, product.nameArabic)}
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
            {getText(product.brandEnglish, product.brandArabic)}
          </p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-foreground leading-tight mb-1.5 line-clamp-2 hover:text-brand transition-colors">
              {getText(product.nameEnglish, product.nameArabic)}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-1 mb-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={11}
                    className={star <= Math.round(product.rating || 0) ? 'fill-brand text-brand' : 'text-border'}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">({product.reviewCount || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{formatPrice(basePrice)}</span>
            {comparePrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
            )}
          </div>

          {/* Color swatches + Cart button */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 min-w-0">
              {product.colors && product.colors.length > 0 && (
                <>
                  {product.colors.slice(0, 5).map(color => (
                    <span
                      key={color.id}
                      className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: color.hex || '#ccc' }}
                      title={getText(color.nameEnglish, color.nameArabic)}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
                  )}
                </>
              )}
            </div>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleAddToCart}
                    className="p-1 rounded bg-header text-header-foreground hover:bg-header/90 transition-colors flex-shrink-0 ms-auto"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={13} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Quick Add Popup for Cart */}
      {quickAddOpen && productItem && (
        <QuickAddPopup
          product={productItem}
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
          mode="cart"
        />
      )}

      {/* Wishlist Variant Popup */}
      {wishlistPopupOpen && hasVariants && productItem && (
        <QuickAddPopup
          product={productItem}
          open={wishlistPopupOpen}
          onOpenChange={setWishlistPopupOpen}
          mode="wishlist"
        />
      )}
    </>
  );
};

export default ApiProductCard;
