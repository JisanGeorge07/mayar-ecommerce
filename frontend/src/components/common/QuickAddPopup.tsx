import { useState, useMemo } from 'react';
import { X, Minus, Plus, ShoppingBag, Heart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ProductItem } from '@/types/product';

interface QuickAddPopupProps {
  product: ProductItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'cart' | 'wishlist';
}

const QuickAddPopup = ({ product, open, onOpenChange, mode = 'cart' }: QuickAddPopupProps) => {
  const { t, formatPrice, lang, getPrice } = useLocale();
  const { settings } = useSettings();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isMobile = useIsMobile();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const currentVariant = useMemo(() => {
    return product.variants.find(v =>
      v.colorId === selectedColor && (!selectedSize || v.sizeId === selectedSize)
    ) || product.variants[0];
  }, [product.variants, selectedColor, selectedSize]);

  const variantImage = useMemo(() => {
    if (currentVariant?.imageUrl) {
      return currentVariant.imageUrl;
    }
    if (selectedColor) {
      const colorImg = product.images.find(img => img.colorId === selectedColor);
      if (colorImg) return colorImg.url;
    }
    const primary = product.images.find(i => i.isPrimary) || product.images[0];
    return primary?.url || '';
  }, [product.images, selectedColor, currentVariant]);

  const currentPrice = getPrice(
    currentVariant?.basePriceKWD ?? product.basePriceKWD,
    currentVariant?.basePriceINR ?? product.basePriceINR
  );
  const comparePrice = getPrice(
    currentVariant?.compareAtPriceKWD ?? product.compareAtPriceKWD,
    currentVariant?.compareAtPriceINR ?? product.compareAtPriceINR
  );
  const stock = currentVariant?.stockQuantity ?? 99;
  const isLowStock = stock > 0 && stock <= 5;

  const availableSizeIds = useMemo(() => {
    if (!selectedColor) return new Set(product.sizes.map(s => s.id));
    return new Set(
      product.variants
        .filter(v => v.colorId === selectedColor && (v.stockQuantity ?? 0) > 0)
        .map(v => v.sizeId)
        .filter(Boolean)
    );
  }, [product.variants, selectedColor, product.sizes]);

  const needsSize = product.sizes.length > 0;
  const canAdd = (!needsSize || selectedSize) && stock > 0;

  const handleConfirm = () => {
    if (mode === 'cart') {
      // Check if guest checkout is disabled and user is not logged in
      if (!settings?.enableGuestCheckout && !isLoggedIn) {
        onOpenChange(false);
        navigate('/login');
        return;
      }
      addToCart(product, {
        colorId: selectedColor || undefined,
        sizeId: selectedSize || undefined,
        quantity,
      });
    } else {
      toggleWishlist(product.id, currentVariant?.id);
    }
    onOpenChange(false);
    setQuantity(1);
  };

  const isLiked = isInWishlist(product.id, currentVariant?.id);

  const content = (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex gap-3">
        <div className="w-20 h-24 rounded-md overflow-hidden bg-secondary flex-shrink-0">
          <img src={variantImage} alt={t(product.name)} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider truncate">{t(product.brand)}</p>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mt-0.5">{t(product.name)}</h3>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-base font-bold text-foreground">{formatPrice(currentPrice)}</span>
            {comparePrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
            )}
          </div>
        </div>
      </div>

      {product.colors.length > 0 && (
        <div>
          <p className="text-xs font-medium text-foreground mb-1.5">
            {lang === 'ar' ? 'اللون' : 'Color'}: <span className="text-muted-foreground">{product.colors.find(c => c.id === selectedColor)?.name?.[lang] || ''}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(color => (
              <button
                key={color.id}
                onClick={() => { setSelectedColor(color.id); setSelectedSize(''); }}
                className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === color.id ? 'border-foreground scale-110 ring-1 ring-foreground/20' : 'border-border hover:border-muted-foreground'
                  }`}
                style={{ backgroundColor: color.hex }}
                title={t(color.name)}
              />
            ))}
          </div>
        </div>
      )}

      {needsSize && (
        <div>
          <p className="text-xs font-medium text-foreground mb-1.5">
            {lang === 'ar' ? 'المقاس' : 'Size'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map(size => {
              const available = availableSizeIds.size === 0 || availableSizeIds.has(size.id);
              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  disabled={!available}
                  className={`min-w-[36px] h-8 px-2.5 text-xs rounded border transition-colors ${selectedSize === size.id
                    ? 'border-foreground bg-foreground text-background font-medium'
                    : !available
                      ? 'border-border/50 text-muted-foreground/30 cursor-not-allowed line-through'
                      : 'border-border hover:border-foreground text-foreground'
                    }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
          {!selectedSize && (
            <p className="text-xs text-brand mt-1">{lang === 'ar' ? 'يرجى اختيار المقاس' : 'Please select a size'}</p>
          )}
        </div>
      )}

      {isLowStock && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle size={12} />
          {lang === 'ar' ? `باقي ${stock} فقط` : `Only ${stock} left`}
        </div>
      )}

      {mode === 'cart' && (
        <div>
          <p className="text-xs font-medium text-foreground mb-1.5">{lang === 'ar' ? 'الكمية' : 'Quantity'}</p>
          <div className="inline-flex items-center border border-border rounded-md">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1.5 hover:bg-secondary transition-colors">
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(q + 1, stock))} className="p-1.5 hover:bg-secondary transition-colors">
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={!canAdd}
        className={`w-full h-11 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors ${mode === 'wishlist'
          ? 'bg-foreground/5 border border-border text-foreground hover:bg-foreground/10'
          : 'bg-header text-header-foreground hover:bg-header/90'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {mode === 'cart' ? (
          <>
            <ShoppingBag size={16} />
            {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
          </>
        ) : (
          <>
            <Heart size={16} className={isLiked ? 'fill-destructive text-destructive' : ''} />
            {lang === 'ar' ? (isLiked ? 'إزالة من المفضلة' : 'أضف للمفضلة') : (isLiked ? 'Remove from Wishlist' : 'Add to Wishlist')}
          </>
        )}
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6 pt-2">
          <DrawerTitle className="sr-only">{t(product.name)}</DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] p-5">
        <DialogTitle className="sr-only">{t(product.name)}</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddPopup;
