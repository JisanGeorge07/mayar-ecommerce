import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader2 } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';
import { contactService, ContactPageData, ContactCard } from '@/services/api/contactService';

const iconMap = {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
};

const getHrefForCard = (card: ContactCard): string | undefined => {
  switch (card.icon) {
    case 'MapPin':
      return `https://www.google.com/maps/search/${encodeURIComponent(card.value_en)}`;
    case 'Phone':
      return `tel:${card.value_en.replace(/\s/g, '')}`;
    case 'Mail':
      return `mailto:${card.value_en}`;
    case 'MessageCircle':
      return `https://wa.me/${card.value_en.replace(/[^\d]/g, '')}`;
    default:
      return undefined;
  }
};

const ContactPage = () => {
  const { lang } = useLocale();
  const isAr = lang === 'ar';

  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const data = await contactService.getContactPage();
        setContactData(data);
      } catch (err) {
        console.error('Failed to fetch contact data:', err);
        setError(isAr ? 'فشل في تحميل بيانات الاتصال' : 'Failed to load contact information');
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [isAr]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><MainHeader /><NavBar />
        <main className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><MainHeader /><NavBar />
        <main className="flex items-center justify-center py-32">
          <p className="text-muted-foreground">{error || (isAr ? 'لا توجد بيانات' : 'No data available')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const infoCards = contactData.contact_cards
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(card => ({
      icon: iconMap[card.icon] || MapPin,
      label: isAr ? card.label_ar : card.label_en,
      value: isAr ? card.value_ar : card.value_en,
      href: getHrefForCard(card),
    }));

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><MainHeader /><NavBar />
      <main>
        {/* Hero */}
        <section
          className="text-white py-14 md:py-20"
          style={{ backgroundColor: contactData.hero_bg_color }}
        >
          <div className="container text-center max-w-3xl">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
              {isAr ? contactData.hero_heading_ar : contactData.hero_heading_en}
            </h1>
            <p className="text-white/80 text-lg">
              {isAr ? contactData.hero_subheading_ar : contactData.hero_subheading_en}
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <div className="container max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {infoCards.map(c => {
              const IconComponent = c.icon;
              const content = (
                <>
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-3">
                    <IconComponent size={18} className="text-brand" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{c.label}</h3>
                  <p className="text-xs text-muted-foreground">{c.value}</p>
                </>
              );

              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-5 text-center cursor-pointer transition-all duration-200 hover:border-brand/40 hover:shadow-md"
                >
                  {content}
                </a>
              ) : (
                <div key={c.label} className="bg-card border border-border rounded-xl p-5 text-center">
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        {/* Map */}
        {contactData.show_map && contactData.map_embed_url && (
          <section className="pb-16">
            <div className="container max-w-5xl">
              <div
                className="rounded-xl overflow-hidden border border-border"
                style={{ height: contactData.map_height }}
              >
                <iframe
                  src={contactData.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mayar International Location"
                />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
