import { Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { useWishlist } from '@/context/WishlistContext';

const AccountWishlistSection = () => {
  const { lang, t, formatPrice } = useLocale();
  const label = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const { items, removeFromWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">{label('Wishlist', 'المفضلة')}</h2>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{label('Your wishlist is empty', 'قائمة المفضلة فارغة')}</p>
          <Link to="/shop" className="text-sm text-brand hover:underline">{label('Browse Products', 'تصفح المنتجات')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-foreground">
        {label('Wishlist', 'المفضلة')} <span className="text-muted-foreground font-normal text-base font-sans">({items.length})</span>
      </h2> 
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:shadow-md transition-shadow flex flex-col">
            {/* Remove button */}
            <button
              onClick={() => removeFromWishlist(item.id)}
              className="absolute top-2 end-2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 transition-colors"
              aria-label="Remove"
            >
              <X size={14} className="text-muted-foreground hover:text-destructive" />
            </button>

            {/* Image */}
            {item.productSlug ? (
              <Link to={`/product/${item.productSlug}`} className="block aspect-[3/4] overflow-hidden bg-secondary">
                <img src={item.image} alt={t(item.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </Link>
            ) : (
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img src={item.image} alt={t(item.name)} className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}

            {/* Info */}
            <div className="p-3 flex flex-col gap-1">
              {item.brand && (
                <p className="text-[12px] text-muted-foreground uppercase tracking-wider truncate">{t(item.brand)}</p>
              )}
              {item.productSlug ? (
                <Link to={`/product/${item.productSlug}`} className="hover:text-brand transition-colors">
                  <h3 className="text-[13px] font-medium text-foreground leading-tight line-clamp-2">{t(item.name)}</h3>
                </Link>
              ) : (
                <h3 className="text-[13px] font-medium text-foreground leading-tight line-clamp-2">{t(item.name)}</h3>
              )}

              {/* Variant details */}
              {(item.colorName || item.size) && (
                <div className="flex items-center gap-2 mt-0.5">
                  {item.colorHex && (
                    <span className="w-3 h-3 rounded-full border border-border flex-shrink-0" style={{ backgroundColor: item.colorHex }} />
                  )}
                  {item.colorName && <span className="text-xs text-muted-foreground">{item.colorName}</span>}
                  {item.colorName && item.size && <span className="text-xs text-muted-foreground">·</span>}
                  {item.size && <span className="text-xs text-muted-foreground">{item.size}</span>}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-foreground tabular-nums">{formatPrice(item.price)}</span>
                {item.compareAtPrice && (
                  <span className="text-xs text-muted-foreground line-through tabular-nums">{formatPrice(item.compareAtPrice)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountWishlistSection;
