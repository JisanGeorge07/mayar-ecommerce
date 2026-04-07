import { useState } from 'react';
import { Shield, Clock, Lightbulb, Heart, Users, Send, Briefcase } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';
import { careersPageContent } from '@/data/mock/siteContent';
import { toast } from 'sonner';

const iconMap: Record<string, typeof Shield> = { shield: Shield, clock: Clock, lightbulb: Lightbulb, heart: Heart, users: Users };

const CareersPage = () => {
  const { t, lang } = useLocale();
  const isAr = lang === 'ar';
  const c = careersPageContent;
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isAr ? 'تم إرسال طلبك بنجاح' : 'Your application has been submitted');
    setForm({ name: '', email: '', phone: '', position: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><MainHeader /><NavBar />
      <main>
        {/* Hero */}
        <section className="bg-header text-header-foreground py-14 md:py-20">
          <div className="container text-center max-w-3xl">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">{t(c.heroTitle)}</h1>
            <p className="text-header-muted text-lg">{t(c.heroSubtitle)}</p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12">
          <div className="container max-w-3xl text-center">
            <p className="text-muted-foreground leading-relaxed text-base">{t(c.intro)}</p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary/30 py-14">
          <div className="container max-w-5xl">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8 text-center">{isAr ? 'قيمنا' : 'Our Values'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.values.map(v => {
                const Icon = iconMap[v.icon] || Shield;
                return (
                  <div key={v.icon} className="bg-card border border-border rounded-xl p-6 text-center">
                    <div className="w-11 h-11 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                      <Icon size={20} className="text-brand" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{t(v.title)}</h3>
                    <p className="text-sm text-muted-foreground">{t(v.description)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-14">
          <div className="container max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">{isAr ? 'الوظائف المتاحة' : 'Open Positions'}</h2>
            {c.openRoles.length === 0 ? (
              <div className="text-center py-10 bg-card border border-border rounded-xl">
                <Briefcase size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{isAr ? 'لا توجد وظائف متاحة حالياً' : 'No open positions currently'}</p>
                <p className="text-sm text-muted-foreground mt-1">{isAr ? 'يمكنك إرسال طلبك أدناه وسنتواصل معك عند توفر فرص مناسبة.' : 'Submit your application below and we\'ll reach out when a suitable opportunity arises.'}</p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Application Form */}
        <section className="pb-16">
          <div className="container max-w-2xl">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">{isAr ? 'قدّم طلبك' : 'Apply Now'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" required placeholder={isAr ? 'الاسم الكامل' : 'Full Name'} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-11 px-4 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="email" required placeholder={isAr ? 'البريد الإلكتروني' : 'Email'} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="h-11 px-4 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="tel" placeholder={isAr ? 'الهاتف' : 'Phone'} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="h-11 px-4 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="text" placeholder={isAr ? 'المنصب المطلوب' : 'Position Applied For'} value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="h-11 px-4 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <textarea required placeholder={isAr ? 'رسالة تعريفية' : 'Cover Letter / Message'} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} className="w-full px-4 py-3 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground flex-1">{isAr ? 'رفع السيرة الذاتية (قريباً)' : 'Upload CV (coming soon)'}</div>
              </div>
              <button type="submit" className="w-full h-12 bg-brand text-brand-foreground font-medium rounded-lg hover:bg-brand/90 transition-colors flex items-center justify-center gap-2">
                <Send size={16} />
                {isAr ? 'إرسال الطلب' : 'Submit Application'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
