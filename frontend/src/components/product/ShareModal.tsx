import { useState } from 'react';
import { Copy, Check, Mail, MessageCircle, Send } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { ProductItem } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
  product: ProductItem;
  selectedColor?: string;
  selectedSize?: string;
  currentPrice: number;
  productImage: string;
}

function buildShareUrl(slug: string, color?: string, size?: string): string {
  const base = `${window.location.origin}/product/${slug}`;
  const params = new URLSearchParams();
  if (color) params.set('color', color);
  if (size) params.set('size', size);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

const ShareModal = ({ open, onClose, product, selectedColor, selectedSize, currentPrice, productImage }: Props) => {
  const { t, formatPrice, lang } = useLocale();
  const [copied, setCopied] = useState(false);

  const shareUrl = buildShareUrl(product.slug, selectedColor, selectedSize);
  const shareTitle = t(product.name);
  const shareText = `${shareTitle} — ${formatPrice(currentPrice)}`;
  const colorObj = product.colors.find(c => c.id === selectedColor);
  const sizeObj = product.sizes.find(s => s.id === selectedSize);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    }
  };

  const channels = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      color: '#25D366',
      icon: <MessageCircle size={20} />,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
    {
      id: 'x',
      label: 'X',
      color: '#000000',
      icon: <span className="font-bold text-sm leading-none">𝕏</span>,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      color: '#1877F2',
      icon: <span className="font-bold text-sm leading-none">f</span>,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      color: '#0088cc',
      icon: <Send size={18} />,
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      id: 'email',
      label: lang === 'ar' ? 'بريد' : 'Email',
      color: 'hsl(var(--foreground))',
      icon: <Mail size={18} />,
      href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-sm w-[92vw] sm:w-full p-0 gap-0 rounded-2xl overflow-hidden my-8 sm:my-12">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="font-heading text-lg font-bold text-foreground">
            {lang === 'ar' ? 'مشاركة المنتج' : 'Share Product'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {lang === 'ar' ? 'شارك هذا المنتج مع الآخرين' : 'Share this product with others'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {/* Product preview */}
          <div className="flex gap-3 items-center">
            <img src={productImage} alt={shareTitle} className="w-16 h-16 rounded-xl object-cover border border-border" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-sm font-medium text-foreground truncate">{shareTitle}</p>
              <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                {colorObj && (
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-border" style={{ backgroundColor: colorObj.hex }} />
                    {t(colorObj.name)}
                  </span>
                )}
                {sizeObj && <span>{sizeObj.label}</span>}
              </div>
              <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(currentPrice)}</p>
            </div>
          </div>

          {/* Share channels */}
          <div className="grid grid-cols-5 gap-2">
            {channels.map(ch => (
              <a
                key={ch.id}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-secondary/60 transition-colors"
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: ch.color }}
                >
                  {ch.icon}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">{ch.label}</span>
              </a>
            ))}
          </div>

          {/* Copy link */}
          <div className="flex items-center gap-2 bg-secondary/40 rounded-xl p-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-foreground truncate outline-none px-2"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-foreground text-background hover:bg-foreground/90'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied
                ? (lang === 'ar' ? 'تم النسخ' : 'Copied')
                : (lang === 'ar' ? 'نسخ' : 'Copy')}
            </button>
          </div>

          {/* Native share fallback */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 text-sm font-medium text-brand hover:underline transition-colors"
            >
              {lang === 'ar' ? 'مشاركة عبر التطبيقات الأخرى...' : 'Share via other apps...'}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
