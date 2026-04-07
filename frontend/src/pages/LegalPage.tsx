import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';
import { contentPageService, type ContentPageData } from '@/services/api/contentPageService';

// Map routes to page types
const pageTypeMap: Record<string, string> = {
  '/privacy-policy': 'privacy-policy',
  '/terms-conditions': 'terms-conditions',
  '/shipping-info': 'shipping-info',
  '/returns-exchange': 'returns-exchange',
};

const LegalPage = () => {
  const { t, lang } = useLocale();
  const { pathname } = useLocation();
  const isAr = lang === 'ar';

  const [content, setContent] = useState<ContentPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageType = pageTypeMap[pathname];

  useEffect(() => {
    if (!pageType) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    contentPageService.getByType(pageType)
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching content page:', err);
        setError('Failed to load content');
        setLoading(false);
      });
  }, [pageType]);

  if (!pageType) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><MainHeader /><NavBar />
        <main>
          <section className="bg-header text-header-foreground py-12 md:py-16">
            <div className="container text-center max-w-3xl">
              <div className="h-10 w-64 bg-header-foreground/20 rounded animate-pulse mx-auto" />
            </div>
          </section>
          <section className="py-12 md:py-16">
            <div className="container max-w-3xl space-y-4">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="space-y-6 mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-16 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><MainHeader /><NavBar />
        <main>
          <section className="py-20">
            <div className="container text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isAr ? 'المحتوى المطلوب غير متوفر حالياً.' : 'The requested content is not available.'}
              </p>
              <Link to="/" className="text-primary hover:underline">
                {isAr ? 'العودة للرئيسية' : 'Return to Home'}
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const hasContactNote = content.contactNote && (content.contactNote.en || content.contactNote.ar);

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><MainHeader /><NavBar />
      <main>
        {/* Hero */}
        <section
          className="text-header-foreground py-12 md:py-16"
          style={{ backgroundColor: content.heroBgColor || '#1a1a2e' }}
        >
          <div className="container text-center max-w-3xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">{t(content.title)}</h1>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground">{isAr ? 'الرئيسية' : 'Home'}</Link>
              <ChevronRight size={12} />
              <span className="text-foreground">{t(content.title)}</span>
            </nav>

            {/* Intro */}
            <p className="text-muted-foreground leading-relaxed mb-10 text-base">{t(content.intro)}</p>

            {/* Sections */}
            <div className="space-y-8">
              {content.sections.map((section, i) => (
                <div key={i}>
                  <h2 className="font-heading text-lg font-bold text-foreground mb-3">{t(section.title)}</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{t(section.body)}</p>
                </div>
              ))}
            </div>

            {/* Contact Note */}
            {hasContactNote && (
              <div className="mt-12 p-6 bg-secondary/50 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  {content.contactTitle ? t(content.contactTitle) : (isAr ? 'تواصل معنا' : 'Contact Us')}
                </h3>
                <p className="text-sm text-muted-foreground">{t(content.contactNote!)}</p>
                {(content.contactEmail || content.contactPhone) && (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {content.contactEmail && (
                      <a href={`mailto:${content.contactEmail}`} className="text-primary hover:underline">
                        {content.contactEmail}
                      </a>
                    )}
                    {content.contactPhone && (
                      <a href={`tel:${content.contactPhone}`} className="text-primary hover:underline">
                        {content.contactPhone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
