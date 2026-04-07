import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { items, count, subtotal, drawerOpen, setDrawerOpen, removeFromCart, updateQuantity, clearCart } = useCart();
  const { t, formatPrice, lang, getPrice } = useLocale();

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="w-full sm:max-w-md flex flex-col p-0 z-[100]">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-lg flex items-center gap-2">
              <ShoppingBag size={20} />
              {lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
              <span className="text-sm font-normal text-muted-foreground">({count})</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-sm">{lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}</p>
            <button onClick={() => setDrawerOpen(false)} className="text-sm text-brand hover:underline">
              {lang === 'ar' ? 'تصفح المتجر' : 'Continue Shopping'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <div className="w-20 h-24 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    <img src={item.image} alt={t(item.name)} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.brand && (
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t(item.brand)}</p>
                    )}
                    <p className="text-sm font-medium text-foreground line-clamp-1">{t(item.name)}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      {item.color && (
                        <span className="flex items-center gap-1">
                          {item.colorHex && <span className="w-2.5 h-2.5 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />}
                          {item.color}
                        </span>
                      )}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-border rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-secondary transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-secondary transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-end">
                        <p className="text-sm font-bold text-foreground">{formatPrice(getPrice(item.unitPrice, item.unitPriceINR) * item.quantity)}</p>
                        {(item.compareAtPrice || item.compareAtPriceINR) && (
                          <p className="text-[10px] text-muted-foreground line-through">{formatPrice(getPrice(item.compareAtPrice, item.compareAtPriceINR) * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="self-start p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <Link
                to="/cart"
                onClick={() => setDrawerOpen(false)}
                className="block w-full h-11 bg-header text-header-foreground font-medium rounded-md hover:bg-header/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {lang === 'ar' ? 'عرض السلة' : 'View Cart'}
              </Link>
              <Link
                to="/checkout/details"
                onClick={() => setDrawerOpen(false)}
                className="block w-full h-11 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {lang === 'ar' ? 'إتمام الشراء' : 'Checkout'}
              </Link>
              <button onClick={clearCart} className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors text-center py-1">
                {lang === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
