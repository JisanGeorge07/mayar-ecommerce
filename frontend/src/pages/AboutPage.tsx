import { useEffect, useState } from 'react';
import { Eye, Target, MapPin, Phone, Mail, Clock } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';
import { aboutPageContent, contactInfo } from '@/data/mock/siteContent';
import { aboutService, type AboutData } from '@/services/api/aboutService';

// Icon mapping for dynamic icons from backend
const iconMap: Record<string, React.ElementType> = {
  MapPin,
  Phone,
  Mail,
  Clock,
  Eye,
  Target,
};

const AboutPage = () => {
  const { t, lang } = useLocale();
  const isAr = lang === 'ar';
  const c = aboutPageContent;

  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Reset loading state when component mounts
    aboutService.getAbout()
      .then(data => {
        setAboutData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching about data:", err);
        setLoading(false);
      });
  }, []);

  // Helper to get translated text from API response or fall back to mock
  const getHeroTitle = () => {
    if (aboutData) {
      return isAr ? (aboutData.heroTitleArabic || aboutData.heroTitleEnglish) : aboutData.heroTitleEnglish;
    }
    return t(c.heroTitle);
  };

  const getHeroSubtitle = () => {
    if (aboutData) {
      return isAr ? (aboutData.heroSubtitleArabic || aboutData.heroSubtitleEnglish) : aboutData.heroSubtitleEnglish;
    }
    return t(c.heroSubtitle);
  };

  const getHeroBgColor = () => {
    return aboutData?.heroBgColor || '#1B2A4A';
  };

  const getWhoWeAreTitle = () => {
    if (aboutData) {
      return isAr ? (aboutData.whoWeAreTitleArabic || aboutData.whoWeAreTitleEnglish) : aboutData.whoWeAreTitleEnglish;
    }
    return isAr ? 'من نحن' : 'Who We Are';
  };

  const getWhoWeAreParagraphs = (): string[] => {
    if (aboutData && aboutData.paragraphs && aboutData.paragraphs.length > 0) {
      return aboutData.paragraphs.map(p =>
        isAr ? (p.contentArabic || p.contentEnglish) : p.contentEnglish
      );
    }
    return t(c.whoWeAre).split('\n\n');
  };

  const getVisionTitle = () => {
    if (aboutData) {
      return isAr ? (aboutData.visionTitleArabic || aboutData.visionTitleEnglish) : aboutData.visionTitleEnglish;
    }
    return isAr ? 'رؤيتنا' : 'Our Vision';
  };

  const getVisionDescription = () => {
    if (aboutData) {
      return isAr ? (aboutData.visionDescriptionArabic || aboutData.visionDescriptionEnglish) : aboutData.visionDescriptionEnglish;
    }
    return t(c.vision);
  };

  const getMissionTitle = () => {
    if (aboutData) {
      return isAr ? (aboutData.missionTitleArabic || aboutData.missionTitleEnglish) : aboutData.missionTitleEnglish;
    }
    return isAr ? 'مهمتنا' : 'Our Mission';
  };

  const getMissionDescription = () => {
    if (aboutData) {
      return isAr ? (aboutData.missionDescriptionArabic || aboutData.missionDescriptionEnglish) : aboutData.missionDescriptionEnglish;
    }
    return t(c.mission);
  };

  // Get contact items from API or fall back to empty
  const getContactItems = () => {
    if (aboutData && aboutData.contactItems && aboutData.contactItems.length > 0) {
      return aboutData.contactItems.map(item => ({
        icon: iconMap[item.icon] || MapPin,
        label: isAr ? (item.labelArabic || item.labelEnglish) : item.labelEnglish,
        actionType: item.actionType,
        actionValue: item.actionValue,
      }));
    }
    return [];
  };

  const contactItems = getContactItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><MainHeader /><NavBar />
        <main>
          {/* Hero Skeleton */}
          <section className="py-16 md:py-24 bg-[#1B2A4A]/10 animate-pulse">
            <div className="container text-center max-w-3xl flex flex-col items-center">
              <div className="h-10 md:h-12 w-64 bg-muted rounded-lg mb-4" />
              <div className="h-6 w-96 bg-muted rounded-lg opacity-60" />
            </div>
          </section>

          {/* Who We Are Skeleton */}
          <section className="py-14 md:py-20">
            <div className="container max-w-4xl space-y-6">
              <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted/60 rounded animate-pulse" />
              </div>
              <div className="space-y-4 pt-4">
                <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse" />
              </div>
            </div>
          </section>

          {/* Vision & Mission Skeleton */}
          <section className="bg-secondary/30 py-14 md:py-20">
            <div className="container max-w-5xl grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-8 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted/60 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Strip Skeleton */}
          <section className="bg-[#1B2A4A]/5 py-10">
            <div className="container max-w-4xl">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
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

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><MainHeader /><NavBar />
      <main>
        {/* Hero */}
        <section
          className="text-white py-16 md:py-24"
          style={{ backgroundColor: getHeroBgColor() }}
        >
          <div className="container text-center max-w-3xl">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{getHeroTitle()}</h1>
            <p className="text-white/80 text-lg md:text-xl">{getHeroSubtitle()}</p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-14 md:py-20">
          <div className="container max-w-4xl">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
              {getWhoWeAreTitle()}
            </h2>
            {getWhoWeAreParagraphs().map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-base">{p}</p>
            ))}
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-secondary/30 py-14 md:py-20">
          <div className="container max-w-5xl grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-5">
                <Eye size={24} className="text-brand" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">{getVisionTitle()}</h3>
              <p className="text-muted-foreground leading-relaxed">{getVisionDescription()}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-5">
                <Target size={24} className="text-brand" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">{getMissionTitle()}</h3>
              <p className="text-muted-foreground leading-relaxed">{getMissionDescription()}</p>
            </div>
          </div>
        </section>

        {/* Contact Strip */}
        <section
          className="text-white py-10"
          style={{ backgroundColor: getHeroBgColor() }}
        >
          <div className="container max-w-4xl">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {contactItems.map((item, index) => {
                const IconComponent = item.icon;
                const content = (
                  <div className="flex flex-col items-center gap-2">
                    <IconComponent size={20} className="text-brand" />
                    <span className="text-xs text-white/80">{item.label}</span>
                  </div>
                );

                if (item.actionType === 'phone') {
                  return (
                    <a key={index} href={`tel:${item.actionValue}`} className="group transition-transform hover:scale-105">
                      {content}
                    </a>
                  );
                }
                if (item.actionType === 'email') {
                  return (
                    <a key={index} href={`mailto:${item.actionValue}`} className="group transition-transform hover:scale-105">
                      {content}
                    </a>
                  );
                }
                if (item.actionType === 'link' || item.actionType === 'map') {
                  return (
                    <a key={index} href={item.actionValue} target="_blank" rel="noopener noreferrer" className="group transition-transform hover:scale-105">
                      {content}
                    </a>
                  );
                }

                return <div key={index}>{content}</div>;
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
