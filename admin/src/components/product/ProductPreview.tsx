import React from 'react';
import type { ProductFormState } from '@/types';
import { Star, Heart, Share2, ShoppingCart, Zap, ChevronRight, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductPreviewProps {
  form: ProductFormState;
  categoryName: string;
  subcategoryName: string;
  productTypeName: string;
  onClose: () => void;
}

export default function ProductPreview({ form, categoryName, subcategoryName, productTypeName, onClose }: ProductPreviewProps) {
  const { basic, colors, sizes, images, details, specifications, careInstructions, features, reviews } = form;
  const [selectedColor, setSelectedColor] = React.useState(colors[0]?.nameEnglish || '');
  const [selectedSize, setSelectedSize] = React.useState(sizes[0]?.label || '');
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);

  const discountPct = basic.compare_price_kwd && basic.base_price_kwd
    ? Math.round(((basic.compare_price_kwd - basic.base_price_kwd) / basic.compare_price_kwd) * 100)
    : 0;

  const hasColors = colors.filter(c => c.nameEnglish).length > 0;
  const hasSizes = sizes.filter(s => s.label).length > 0;
  const hasRating = (basic.rating || 0) > 0;
  const hasReviewCount = (basic.review_count || 0) > 0;

  const filledSpecs = specifications.filter(s => s.labelEnglish && s.valueEnglish);
  const filledCare = careInstructions.filter(c => c.instructionEnglish?.trim());

  const activeFeatures = features.filter(f => f.isActive && f.labelEnglish);

  return (
    <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-3">
        <h2 className="font-display text-sm font-semibold">Storefront Preview</h2>
        <button onClick={onClose} className="text-xs font-medium text-primary hover:underline">Close Preview</button>
      </div>

      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <span>Home</span>
          <ChevronRight className="h-3 w-3" />
          <span>{categoryName}</span>
          <ChevronRight className="h-3 w-3" />
          <span>{subcategoryName}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{basic.nameEnglish || 'Product'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg border border-border bg-muted overflow-hidden">
              {images.length > 0 ? (
                <img src={images[selectedImageIdx]?.url} alt={images[selectedImageIdx]?.alt_text} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No image uploaded</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`h-16 w-16 shrink-0 rounded-md border overflow-hidden ${i === selectedImageIdx ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
                  >
                    <img src={img.url} alt={img.alt_text} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {basic.brandEnglish && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{basic.brandEnglish}</p>}
            <h1 className="font-display text-2xl font-bold text-foreground">{basic.nameEnglish || 'Product Name'}</h1>

            {/* Rating - only if entered */}
            {(hasRating || hasReviewCount) && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= (basic.rating || 0) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                {hasReviewCount && <span className="text-sm text-muted-foreground">({basic.review_count} reviews)</span>}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-foreground">{basic.base_price_kwd || 0} KWD</span>
              {basic.compare_price_kwd ? (
                <span className="text-lg text-muted-foreground line-through">{basic.compare_price_kwd} KWD</span>
              ) : null}
              {discountPct > 0 && (
                <span className="rounded bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">{discountPct}% OFF</span>
              )}
            </div>

            {basic.shortDescriptionEnglish && <p className="text-sm text-muted-foreground leading-relaxed">{basic.shortDescriptionEnglish}</p>}

            {/* Colors - only if colors exist */}
            {hasColors && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Color: {selectedColor}</p>
                <div className="flex gap-2">
                  {colors.filter(c => c.nameEnglish).map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.nameEnglish)}
                      className={`h-8 w-8 rounded-full border-2 ${selectedColor === c.nameEnglish ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.nameEnglish}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes - only if sizes exist */}
            {hasSizes && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.filter(s => s.label).map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.label)}
                      className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${selectedSize === s.label ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Quantity</p>
              <div className="flex items-center border border-border rounded-md w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-foreground hover:bg-muted">-</button>
                <span className="px-4 py-2 text-sm font-medium border-x border-border">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-foreground hover:bg-muted">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gap-2">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Zap className="h-4 w-4" /> Buy Now
              </Button>
              <Button variant="outline" size="icon"><Heart className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
            </div>

            {/* Product Features - dynamic from backend */}
            {activeFeatures.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-4">
                {activeFeatures.map(feature => {
                  // Dynamically get icon component from lucide-react using the icon name from backend
                  const Icon = (LucideIcons as any)[feature.iconName] || CheckCircle;
                  return (
                    <div key={feature.id} className="flex items-start gap-2 rounded-md border border-border p-2.5">
                      <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{feature.labelEnglish}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Accordion details */}
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            {details.descriptionEnglish && (
              <AccordionItem value="desc">
                <AccordionTrigger className="text-sm font-medium">Description</AccordionTrigger>
                <AccordionContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{details.descriptionEnglish}</p></AccordionContent>
              </AccordionItem>
            )}
            {filledSpecs.length > 0 && (
              <AccordionItem value="specs">
                <AccordionTrigger className="text-sm font-medium">Specifications</AccordionTrigger>
                <AccordionContent>
                  <div className="divide-y divide-border">
                    {filledSpecs.map(spec => (
                      <div key={spec.id} className="flex justify-between py-2.5">
                        <span className="text-sm font-medium text-foreground">{spec.labelEnglish}</span>
                        <span className="text-sm text-muted-foreground">{spec.valueEnglish}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            {(details.shippingInfoEnglish || details.returnInfoEnglish) && (
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-sm font-medium">Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {details.shippingInfoEnglish && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Shipping</p>
                        <p className="whitespace-pre-wrap">{details.shippingInfoEnglish}</p>
                      </div>
                    )}
                    {details.returnInfoEnglish && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Returns</p>
                        <p className="whitespace-pre-wrap">{details.returnInfoEnglish}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            {filledCare.length > 0 && (
              <AccordionItem value="care">
                <AccordionTrigger className="text-sm font-medium">Care Instructions</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5">
                    {filledCare.map((item) => (
                      <li key={item.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item.instructionEnglish}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="rounded-md border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">{r.author}</span>
                    {r.verified_purchase && <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded font-medium">Verified</span>}
                    <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
