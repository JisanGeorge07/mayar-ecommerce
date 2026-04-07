import { Ruler } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { getSizeGuide } from '@/data/mock/sizeGuides';
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
  selectedSize?: string;
}

const SizeGuideModal = ({ open, onClose, product, selectedSize }: Props) => {
  const { t, lang } = useLocale();
  const guide = getSizeGuide(
    product.productTypeId,
    product.subcategoryId,
    product.categoryId,
    product.sizes.length > 0,
  );

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full p-0 gap-0 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col my-8 sm:my-12">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Ruler size={18} className="text-brand" />
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              {lang === 'ar' ? 'دليل المقاسات' : 'Size Guide'}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            {lang === 'ar' ? 'جدول المقاسات للمنتج' : 'Size chart for the product'}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Product context */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t(product.brand)}</p>
            <p className="font-medium text-foreground">{t(product.name)}</p>
            {selectedSize && (
              <p className="text-sm text-brand font-medium">
                {lang === 'ar' ? `المقاس المختار: ${selectedSize}` : `Selected size: ${selectedSize}`}
              </p>
            )}
          </div>

          {guide ? (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/60">
                      {guide.columns.map(col => (
                        <th key={col.key} className="px-3 py-2.5 text-start font-semibold text-foreground whitespace-nowrap">
                          {t(col.label)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.rows.map(row => {
                      const isSelected = selectedSize?.toUpperCase() === row.size.toUpperCase();
                      return (
                        <tr
                          key={row.size}
                          className={`border-t border-border transition-colors ${
                            isSelected ? 'bg-brand/10 font-semibold' : 'hover:bg-secondary/30'
                          }`}
                        >
                          {guide.columns.map(col => (
                            <td key={col.key} className={`px-3 py-2.5 whitespace-nowrap ${isSelected ? 'text-brand' : 'text-foreground'}`}>
                              {row[col.key]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Fit note */}
              {guide.fitNote && (
                <div className="bg-secondary/40 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{lang === 'ar' ? 'ملاحظة القصة: ' : 'Fit: '}</span>
                  {t(guide.fitNote)}
                </div>
              )}

              {/* Model note */}
              {guide.modelNote && (
                <p className="text-xs text-muted-foreground italic">{t(guide.modelNote)}</p>
              )}

              {/* How to measure */}
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-1">{lang === 'ar' ? 'كيف تأخذين القياسات' : 'How to Measure'}</p>
                <p>
                  {lang === 'ar'
                    ? 'استخدمي شريط قياس مرن. قيسي فوق الملابس الداخلية للحصول على أدق النتائج. القياسات بالسنتيمتر وقد تختلف قليلاً حسب الموديل.'
                    : 'Use a flexible measuring tape. Measure over undergarments for the most accurate results. All measurements are in centimeters and may vary slightly by style.'}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-2">
              <Ruler size={32} className="mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {lang === 'ar'
                  ? 'هذا المنتج متوفر بمقاس واحد أو لا يحتاج دليل مقاسات.'
                  : 'This item is available in one size only or does not require a size guide.'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideModal;
