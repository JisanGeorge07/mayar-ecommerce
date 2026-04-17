import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, Heart, Share2, Minus, Plus, ShoppingBag, Zap,
  Truck, RotateCcw, Shield, CheckCircle, Package, Clock,
  CreditCard, Award, Gift, Headphones, MapPin, RefreshCw,
  AlertCircle,
  type LucideIcon
} from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import type { ProductItem, ProductVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SizeGuideModal from './SizeGuideModal';
import ShareModal from './ShareModal';

// Icon name to component mapping
const iconMap: Record<string, LucideIcon> = {
  Truck,
  RotateCcw,
  Shield,
  CheckCircle,
  Package,
  Clock,
  CreditCard,
  Award,
  Gift,
  Headphones,
  MapPin,
  RefreshCw,
};

interface ProductInfoProps {
  product: ProductItem;
  selectedColor?: string;
  onColorChange?: (colorId: string) => void;
  selectedSize?: string;
  onSizeChange?: (sizeId: string) => void;
}

const ProductInfo = ({ product, selectedColor: controlledColor, onColorChange, selectedSize: controlledSize, onSizeChange }: ProductInfoProps) => {
  const { t, formatPrice, lang, getPrice } = useLocale();
  const { settings } = useSettings();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  // Check if product has variants
  const hasVariants = product.variants && product.variants.length > 0;

  // Find default variant for initial selection
  const defaultVariant = hasVariants
    ? product.variants.find(v => v.isDefault) || product.variants[0]
    : null;

  // Use controlled color if provided, otherwise use internal state
  const [internalColor, setInternalColor] = useState(defaultVariant?.colorId || product.colors[0]?.id || '');
  const selectedColor = controlledColor ?? internalColor;
  const setSelectedColor = (colorId: string) => {
    setInternalColor(colorId);
    onColorChange?.(colorId);
  };

  const [internalSize, setInternalSize] = useState('');
  const selectedSize = controlledSize ?? internalSize;
  const setSelectedSize = (sizeId: string) => {
    setInternalSize(sizeId);
    onSizeChange?.(sizeId);
  };

  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Get available sizes for selected color (from variants)
  const availableSizesForColor = useMemo(() => {
    if (!hasVariants || !selectedColor) return product.sizes;

    // Get all variants for the selected color
    const colorVariants = product.variants.filter(v => v.colorId === selectedColor);

    // Map to sizes with variant info
    return product.sizes.map(size => {
      const variant = colorVariants.find(v => v.sizeId === size.id);
      return {
        ...size,
        variant,
        available: variant ? variant.inStock : false,
        stockQuantity: variant?.stockQuantity,
      };
    });
  }, [hasVariants, selectedColor, product.variants, product.sizes]);

  // Find the selected variant based on color and size
  const selectedVariant = useMemo((): ProductVariant | null => {
    if (!hasVariants || !selectedColor || !selectedSize) return null;

    return product.variants.find(
      v => v.colorId === selectedColor && v.sizeId === selectedSize
    ) || null;
  }, [hasVariants, selectedColor, selectedSize, product.variants]);

  // Get current variant ID for wishlist check
  const currentVariantId = useMemo(() => {
    if (selectedVariant) return selectedVariant.id;
    if (defaultVariant) return defaultVariant.id;
    return undefined;
  }, [selectedVariant, defaultVariant]);

  const liked = isInWishlist(product.id, currentVariantId);

  // Calculate prices based on selected variant or default
  const displayPrice = useMemo(() => {
    if (selectedVariant) {
      // Use variant prices, fallback to product prices if variant prices are null
      const basePriceKWD = selectedVariant.basePriceKWD ?? product.basePriceKWD;
      const basePriceINR = selectedVariant.basePriceINR ?? product.basePriceINR;
      const comparePriceKWD = selectedVariant.compareAtPriceKWD ?? product.compareAtPriceKWD;
      const comparePriceINR = selectedVariant.compareAtPriceINR ?? product.compareAtPriceINR;
      return {
        base: getPrice(basePriceKWD, basePriceINR),
        compare: getPrice(comparePriceKWD, comparePriceINR),
      };
    }
    if (defaultVariant && !selectedSize) {
      // Use default variant prices, fallback to product prices if variant prices are null
      const basePriceKWD = defaultVariant.basePriceKWD ?? product.basePriceKWD;
      const basePriceINR = defaultVariant.basePriceINR ?? product.basePriceINR;
      const comparePriceKWD = defaultVariant.compareAtPriceKWD ?? product.compareAtPriceKWD;
      const comparePriceINR = defaultVariant.compareAtPriceINR ?? product.compareAtPriceINR;
      return {
        base: getPrice(basePriceKWD, basePriceINR),
        compare: getPrice(comparePriceKWD, comparePriceINR),
      };
    }
    return {
      base: getPrice(product.basePriceKWD, product.basePriceINR),
      compare: getPrice(product.compareAtPriceKWD, product.compareAtPriceINR),
    };
  }, [selectedVariant, defaultVariant, selectedSize, product, getPrice]);

  const basePrice = displayPrice.base;
  const comparePrice = displayPrice.compare;
  const discount = comparePrice
    ? Math.round((1 - basePrice / comparePrice) * 100)
    : 0;

  // Check if add to cart should be enabled
  const canAddToCart = useMemo(() => {
    // If product has no sizes, allow add to cart
    if (product.sizes.length === 0) return true;

    // If product has variants, require size selection
    if (hasVariants) {
      if (!selectedSize) return false;
      return selectedVariant?.inStock ?? false;
    }

    // For non-variant products with sizes, require size selection
    return !!selectedSize;
  }, [product.sizes.length, hasVariants, selectedSize, selectedVariant]);

  // Stock warning message
  const stockWarning = useMemo(() => {
    if (!selectedVariant) return null;

    const stock = selectedVariant.stockQuantity;
    if (stock !== null && stock !== undefined && stock > 0 && stock <= 5) {
      return lang === 'ar'
        ? `باقي ${stock} فقط في المخزون`
        : `Only ${stock} left in stock`;
    }
    return null;
  }, [selectedVariant, lang]);

  // Handle add to cart (works for both guests and logged-in users)
  const handleAddToCart = () => {
    // Check if guest checkout is disabled and user is not logged in
    if (!settings?.enableGuestCheckout && !isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(product, {
      colorId: selectedColor || undefined,
      sizeId: selectedSize || undefined,
      quantity
    });
  };

  // Handle buy now (works for both guests and logged-in users)
  const handleBuyNow = () => {
    // Check if guest checkout is disabled and user is not logged in
    if (!settings?.enableGuestCheckout && !isLoggedIn) {
      navigate('/login');
      return;
    }
    // Add to cart and redirect to checkout
    addToCart(product, {
      colorId: selectedColor || undefined,
      sizeId: selectedSize || undefined,
      quantity
    });
    // Navigate to checkout or cart page after adding
    navigate('/cart');
  };

  // Use features from product if available
  const displayFeatures = useMemo(() => {
    return (product.features || []).map(f => ({
      iconName: f.iconName || 'CheckCircle',
      label: lang === 'ar' ? f.label.ar : f.label.en,
    }));
  }, [product.features, lang]);

  return (
    <div className="space-y-5">
      {/* Brand */}
      <p className="text-sm text-muted-foreground uppercase tracking-wider">{t(product.brand)}</p>

      {/* Title */}
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t(product.name)}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={14} className={s <= Math.round(product.rating) ? 'fill-brand text-brand' : 'text-border'} />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewCount} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-foreground">{formatPrice(basePrice)}</span>
        {comparePrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
            <span className="text-sm font-bold text-destructive">-{discount}%</span>
          </>
        )}
      </div>

      {/* Short description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{t(product.shortDescription)}</p>

      {/* Stock warning */}
      {stockWarning && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle size={12} />
          {stockWarning}
        </div>
      )}

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            {lang === 'ar' ? 'اللون' : 'Color'}: {product.colors.find(c => c.id === selectedColor)?.name?.[lang] || ''}
          </p>
          <div className="flex gap-2">
            {product.colors.map(color => (
              <button
                key={color.id}
                onClick={() => {
                  setSelectedColor(color.id);
                  // Reset size selection when color changes
                  setSelectedSize('');
                }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.id ? 'border-foreground scale-110' : 'border-border hover:border-muted-foreground'
                  }`}
                style={{ backgroundColor: color.hex }}
                title={t(color.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">{lang === 'ar' ? 'المقاس' : 'Size'}</p>
            <button onClick={() => setSizeGuideOpen(true)} className="text-xs text-brand hover:underline">{lang === 'ar' ? 'دليل المقاسات' : 'Size Guide'}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSizesForColor.map(size => {
              // Determine if size is available based on variant or stock
              const isAvailable = hasVariants
                ? ('available' in size ? size.available : true)
                : size.stock > 0;

              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  disabled={!isAvailable}
                  className={`min-w-[40px] h-9 px-3 text-sm rounded-md border transition-colors ${selectedSize === size.id
                    ? 'border-foreground bg-foreground text-background'
                    : !isAvailable
                      ? 'border-border text-muted-foreground/40 cursor-not-allowed line-through'
                      : 'border-border hover:border-foreground text-foreground'
                    }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">{lang === 'ar' ? 'الكمية' : 'Quantity'}</p>
        <div className="inline-flex items-center border border-border rounded-md">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-secondary transition-colors">
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => {
              const maxQty = selectedVariant?.stockQuantity ?? 99;
              setQuantity(q => Math.min(maxQty, q + 1));
            }}
            disabled={selectedVariant?.stockQuantity !== undefined && quantity >= selectedVariant.stockQuantity}
            className="p-2 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className={`flex-1 h-12 font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${canAddToCart
            ? 'bg-header text-header-foreground hover:bg-header/90'
            : 'bg-header/40 text-header-foreground/50 cursor-not-allowed'
            }`}
        >
          <ShoppingBag size={18} />
          {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!canAddToCart}
          className={`flex-1 h-12 font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${canAddToCart
            ? 'bg-brand text-brand-foreground hover:bg-brand/90'
            : 'bg-brand/40 text-brand-foreground/50 cursor-not-allowed'
            }`}
        >
          <Zap size={18} />
          {lang === 'ar' ? 'اشتر الآن' : 'Buy Now'}
        </button>
      </div>

      {/* Size selection hint */}
      {product.sizes.length > 0 && !selectedSize && (
        <p className="text-xs text-muted-foreground">
          {lang === 'ar' ? 'يرجى اختيار المقاس للمتابعة' : 'Please select a size to continue'}
        </p>
      )}

      <div className="flex gap-4">
        {settings?.enableWishlist && (
          <button
            onClick={() => toggleWishlist(product.id, selectedVariant?.id || defaultVariant?.id)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Heart size={16} className={liked ? 'fill-destructive text-destructive' : ''} />
            {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
          </button>
        )}
        <button onClick={() => setShareOpen(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Share2 size={16} />
          {lang === 'ar' ? 'مشاركة' : 'Share'}
        </button>
      </div>

      {/* Service highlights (only show if features exist) */}
      {displayFeatures.length > 0 && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          {displayFeatures.map(({ iconName, label }, index) => {
            const Icon = iconMap[iconName] || CheckCircle;
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon size={16} className="text-brand flex-shrink-0" />
                {label}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        product={product}
        selectedSize={product.sizes.find(s => s.id === selectedSize)?.label}
      />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        currentPrice={basePrice}
        productImage={
          selectedVariant?.imageUrl
          || (selectedColor ? product.images.find(img => img.colorId === selectedColor)?.url : undefined)
          || product.images.find(i => i.isPrimary)?.url
          || product.images[0]?.url
          || ''
        }
      />
    </div>
  );
};

export default ProductInfo;
