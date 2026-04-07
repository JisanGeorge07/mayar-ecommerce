// Centralized site content for legal, contact, about pages — future API-ready

import type { TranslatedText } from '@/types';

export interface ContactInfo {
  address: TranslatedText;
  phone: string;
  email: string;
  workingHours: TranslatedText;
  mapEmbedUrl: string;
}

export interface AboutPageContent {
  heroTitle: TranslatedText;
  heroSubtitle: TranslatedText;
  whoWeAre: TranslatedText;
  vision: TranslatedText;
  mission: TranslatedText;
}

export interface LegalSection {
  title: TranslatedText;
  body: TranslatedText;
}

export interface LegalPageContent {
  title: TranslatedText;
  intro: TranslatedText;
  sections: LegalSection[];
  contactNote: TranslatedText;
}

export interface CareersPageContent {
  heroTitle: TranslatedText;
  heroSubtitle: TranslatedText;
  intro: TranslatedText;
  values: { icon: string; title: TranslatedText; description: TranslatedText }[];
  openRoles: { id: string; title: TranslatedText; location: TranslatedText; type: TranslatedText }[];
}

export interface ShippingPageContent {
  title: TranslatedText;
  intro: TranslatedText;
  sections: LegalSection[];
}

export interface ReturnsPageContent {
  title: TranslatedText;
  intro: TranslatedText;
  sections: LegalSection[];
}

// ─── Contact Info ───
export const contactInfo: ContactInfo = {
  address: {
    en: 'Shuwaikh Port, Free Trade Zone, Kuwait City, Kuwait',
    ar: 'ميناء الشويخ، المنطقة الحرة، مدينة الكويت، الكويت',
  },
  phone: '+965 50404099',
  email: 'mayaralmiya@gmail.com',
  workingHours: { en: '9:00 AM to 5:00 PM', ar: '9:00 صباحاً إلى 5:00 مساءً' },
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.465408754325!2d47.9077238!3d29.356659099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf8f9bc4fa8db1%3A0x2d66293642c41526!2sADECO%20Group!5e0!3m2!1sen!2skw!4v1774335986054!5m2!1sen!2skw',
};

// ─── About Page ───
export const aboutPageContent: AboutPageContent = {
  heroTitle: { en: 'About Mayar', ar: 'عن ميار' },
  heroSubtitle: {
    en: 'Your Trusted Partner for Seamless Shipping and Logistics Solutions',
    ar: 'شريكك الموثوق لحلول الشحن والخدمات اللوجستية السلسة',
  },
  whoWeAre: {
    en: 'At Mayar International, we are committed to providing reliable and efficient delivery services within Kuwait and around the world. With a focus on customer satisfaction and operational excellence, we cater to businesses and individuals who require fast, secure, and affordable shipping solutions. Our team of professionals ensures that your goods are delivered on time, every time, with the utmost care and precision.\n\nWith years of experience in the logistics and transportation industry, we have built a reputation for trust and reliability. Whether it\'s domestic delivery within Kuwait or international shipping to any corner of the globe, we leverage state-of-the-art technology and a global network of partners to fulfill all your shipping needs.',
    ar: 'في ميار الدولية، نحن ملتزمون بتقديم خدمات توصيل موثوقة وفعالة داخل الكويت وحول العالم. مع التركيز على رضا العملاء والتميز التشغيلي، نخدم الشركات والأفراد الذين يحتاجون حلول شحن سريعة وآمنة وبأسعار مناسبة. يضمن فريقنا المتخصص توصيل بضائعك في الوقت المحدد، في كل مرة، بأقصى درجات العناية والدقة.\n\nمع سنوات من الخبرة في صناعة الخدمات اللوجستية والنقل، بنينا سمعة من الثقة والموثوقية. سواء كان التوصيل المحلي داخل الكويت أو الشحن الدولي إلى أي مكان في العالم، نستخدم أحدث التقنيات وشبكة شركاء عالمية لتلبية جميع احتياجاتك.',
  },
  vision: {
    en: 'To be the leading provider of delivery solutions in Kuwait, known for our reliability, innovation, and commitment to customer satisfaction. We strive to transform the logistics industry by offering services that are efficient, cost-effective, and tailored to meet the unique needs of our clients. Our goal is to create seamless and reliable logistics experiences that empower businesses and individuals to grow and succeed.',
    ar: 'أن نكون المزود الرائد لحلول التوصيل في الكويت، المعروف بالموثوقية والابتكار والالتزام برضا العملاء. نسعى لتحويل صناعة الخدمات اللوجستية بتقديم خدمات فعالة ومنخفضة التكلفة ومصممة لتلبية الاحتياجات الفريدة لعملائنا.',
  },
  mission: {
    en: 'Our mission is to provide fast, secure, and reliable delivery and logistics solutions that meet the evolving needs of our customers. We are committed to excellence, integrity, and innovation, ensuring timely and efficient shipping both domestically and internationally. Through personalized service and a focus on customer satisfaction, we make shipping easier and more efficient.',
    ar: 'مهمتنا هي تقديم حلول توصيل وخدمات لوجستية سريعة وآمنة وموثوقة تلبي الاحتياجات المتطورة لعملائنا. نحن ملتزمون بالتميز والنزاهة والابتكار، مع ضمان الشحن في الوقت المناسب وبكفاءة محلياً ودولياً.',
  },
};

// ─── Privacy Policy ───
export const privacyPolicyContent: LegalPageContent = {
  title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  intro: {
    en: 'At Mayar International, we value the privacy and security of our users. This privacy policy outlines how we collect, use, and safeguard your personal information. We collect data such as your name, contact details, and delivery address to enhance your shopping experience. We do not share your personal information with third parties, except as required by law or for operational purposes. By using our services, you consent to the collection and use of your data as outlined in this policy.',
    ar: 'في ميار الدولية، نقدر خصوصية وأمان مستخدمينا. توضح سياسة الخصوصية هذه كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.',
  },
  sections: [
    {
      title: { en: 'Information We Collect', ar: 'المعلومات التي نجمعها' },
      body: {
        en: 'We collect the necessary data to ensure a seamless shopping experience. This includes personal identification information (name, email, phone number), delivery details (address, order history), payment information for processing transactions, and device information for app optimization.',
        ar: 'نجمع البيانات اللازمة لضمان تجربة تسوق سلسة. يشمل ذلك معلومات التعريف الشخصية وتفاصيل التوصيل ومعلومات الدفع ومعلومات الجهاز.',
      },
    },
    {
      title: { en: 'How We Use Your Information', ar: 'كيف نستخدم معلوماتك' },
      body: {
        en: 'We use your personal data for order management and delivery processing, payment processing and transaction records, customer support for inquiries related to orders, service improvement through usage analysis, and compliance with legal obligations.',
        ar: 'نستخدم بياناتك الشخصية لإدارة الطلبات ومعالجة التوصيل، ومعالجة المدفوعات، ودعم العملاء، وتحسين الخدمة، والامتثال للالتزامات القانونية.',
      },
    },
    {
      title: { en: 'Data Security', ar: 'أمان البيانات' },
      body: {
        en: 'We use industry-standard security measures to protect your data from unauthorized access, loss, alteration, or disclosure. However, no data transmission over the internet is entirely secure, and we cannot guarantee the absolute security of your information.',
        ar: 'نستخدم إجراءات أمنية معيارية لحماية بياناتك من الوصول غير المصرح به أو الفقدان أو التغيير أو الكشف.',
      },
    },
    {
      title: { en: 'Sharing Your Information', ar: 'مشاركة معلوماتك' },
      body: {
        en: 'We do not share your personal information with third parties, except with service providers who help manage operations and payment processing, in response to legal requests such as subpoenas or court orders, or in the event of a merger, acquisition, or sale of assets.',
        ar: 'لا نشارك معلوماتك الشخصية مع أطراف ثالثة، إلا مع مزودي الخدمة أو استجابة للطلبات القانونية أو في حالة الاندماج أو الاستحواذ.',
      },
    },
    {
      title: { en: 'Your Rights and Choices', ar: 'حقوقك وخياراتك' },
      body: {
        en: 'You have the right to access your data and make corrections, request deletion of your personal data in accordance with applicable laws, and opt-out of certain data collection practices by contacting us directly.',
        ar: 'لديك الحق في الوصول إلى بياناتك وإجراء تصحيحات، وطلب حذف بياناتك الشخصية، والانسحاب من ممارسات جمع بيانات معينة.',
      },
    },
    {
      title: { en: 'Retention of Data', ar: 'الاحتفاظ بالبيانات' },
      body: {
        en: 'We retain personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. Once data is no longer required, we will securely delete or anonymize it.',
        ar: 'نحتفظ بالبيانات الشخصية فقط طالما كان ذلك ضرورياً لتحقيق الأغراض الموضحة في هذه السياسة.',
      },
    },
    {
      title: { en: "Children's Privacy", ar: 'خصوصية الأطفال' },
      body: {
        en: 'Our services are not intended for use by children under the age of 13. We do not knowingly collect personal data from children. If we discover that we have inadvertently collected such data, we will take steps to delete it.',
        ar: 'خدماتنا غير مخصصة للاستخدام من قبل الأطفال دون سن 13 عاماً. لا نجمع بيانات شخصية من الأطفال عن قصد.',
      },
    },
    {
      title: { en: 'Changes to This Privacy Policy', ar: 'التغييرات على سياسة الخصوصية' },
      body: {
        en: 'We may update this Privacy Policy periodically. All changes will be posted on this page. We encourage you to review this policy periodically to stay informed about how we protect your data.',
        ar: 'قد نحدث سياسة الخصوصية بشكل دوري. سيتم نشر جميع التغييرات على هذه الصفحة.',
      },
    },
  ],
  contactNote: {
    en: 'For questions regarding this Privacy Policy or how we handle your data, please contact us at mayaralmiya@gmail.com or call +965 50404099.',
    ar: 'لأي أسئلة حول سياسة الخصوصية، تواصل معنا عبر mayaralmiya@gmail.com أو اتصل على 50404099 965+.',
  },
};

// ─── Terms & Conditions ───
export const termsContent: LegalPageContent = {
  title: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
  intro: {
    en: 'By using Mayar International services, you agree to comply with and be bound by the following terms and conditions.',
    ar: 'باستخدام خدمات ميار الدولية، فإنك توافق على الالتزام بالشروط والأحكام التالية.',
  },
  sections: [
    {
      title: { en: 'Overview of the Service', ar: 'نظرة عامة على الخدمة' },
      body: {
        en: 'Mayar International provides e-commerce and delivery services enabling customers to browse, purchase, and receive products at their doorstep. We manage order fulfillment, delivery logistics, and payment processing to ensure a seamless shopping experience.',
        ar: 'توفر ميار الدولية خدمات التجارة الإلكترونية والتوصيل لتمكين العملاء من تصفح المنتجات وشرائها واستلامها.',
      },
    },
    {
      title: { en: 'User Responsibilities', ar: 'مسؤوليات المستخدم' },
      body: {
        en: 'As a customer, you agree to provide accurate information for order processing and delivery. You agree not to misuse the platform, including engaging in fraudulent activities or altering order details. All platform functionalities should be used for their intended purpose only.',
        ar: 'كعميل، توافق على تقديم معلومات دقيقة لمعالجة الطلبات والتوصيل. توافق على عدم إساءة استخدام المنصة.',
      },
    },
    {
      title: { en: 'Delivery and Payment', ar: 'التوصيل والدفع' },
      body: {
        en: 'Orders will be processed and delivered based on availability and your selected delivery method. Payment is collected at the time of order placement via the available payment methods (KNET, Visa, Mastercard, Apple Pay, or cash on delivery where available).',
        ar: 'ستتم معالجة الطلبات وتوصيلها بناءً على التوفر وطريقة التوصيل المختارة. يتم تحصيل الدفع عند تقديم الطلب.',
      },
    },
    {
      title: { en: 'Data Privacy', ar: 'خصوصية البيانات' },
      body: {
        en: 'By using our services, you acknowledge that your personal and order-related information will be collected, stored, and processed as described in our Privacy Policy.',
        ar: 'باستخدام خدماتنا، فإنك تقر بأن معلوماتك الشخصية سيتم جمعها وتخزينها ومعالجتها كما هو موضح في سياسة الخصوصية.',
      },
    },
    {
      title: { en: 'Restrictions', ar: 'القيود' },
      body: {
        en: 'You may not modify, reverse-engineer, or tamper with the platform or any content provided by Mayar International. Use of the platform for any illegal, fraudulent, or unauthorized purposes is strictly prohibited.',
        ar: 'لا يجوز لك تعديل أو عكس هندسة أو العبث بالمنصة أو أي محتوى مقدم من ميار الدولية.',
      },
    },
    {
      title: { en: 'Termination', ar: 'الإنهاء' },
      body: {
        en: 'Mayar International reserves the right to suspend or terminate your access to the platform at any time for violations of these Terms & Conditions.',
        ar: 'تحتفظ ميار الدولية بالحق في تعليق أو إنهاء وصولك إلى المنصة في أي وقت لانتهاك هذه الشروط.',
      },
    },
    {
      title: { en: 'Liability', ar: 'المسؤولية' },
      body: {
        en: 'Mayar International is not liable for any direct, indirect, or consequential losses arising from the use or inability to use the platform. We make no warranties regarding the accuracy or reliability of the platform\'s performance.',
        ar: 'ميار الدولية غير مسؤولة عن أي خسائر مباشرة أو غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام المنصة.',
      },
    },
    {
      title: { en: 'Changes to Terms', ar: 'تغييرات الشروط' },
      body: {
        en: 'Mayar International reserves the right to modify these Terms & Conditions at any time. Continued use of the platform after changes have been posted will signify your acceptance.',
        ar: 'تحتفظ ميار الدولية بالحق في تعديل هذه الشروط في أي وقت. استمرار استخدام المنصة بعد نشر التغييرات يعني موافقتك.',
      },
    },
    {
      title: { en: 'Governing Law', ar: 'القانون الحاكم' },
      body: {
        en: 'These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of Kuwait.',
        ar: 'تخضع هذه الشروط والأحكام لقوانين دولة الكويت.',
      },
    },
  ],
  contactNote: {
    en: 'For any questions or concerns regarding these Terms & Conditions, please contact us at mayaralmiya@gmail.com or call +965 50404099.',
    ar: 'لأي أسئلة أو استفسارات حول الشروط والأحكام، تواصل معنا عبر mayaralmiya@gmail.com أو اتصل على 50404099 965+.',
  },
};

// ─── Careers ───
export const careersPageContent: CareersPageContent = {
  heroTitle: { en: 'Careers at Mayar', ar: 'وظائف في ميار' },
  heroSubtitle: {
    en: 'Join a reliable, customer-focused logistics and delivery company',
    ar: 'انضم إلى شركة خدمات لوجستية وتوصيل موثوقة تركز على العملاء',
  },
  intro: {
    en: 'At Mayar International, we believe our people are our greatest asset. We are always looking for passionate, dedicated individuals who share our commitment to service, reliability, and innovation. Join us and help shape the future of logistics in Kuwait.',
    ar: 'في ميار الدولية، نؤمن بأن فريقنا هو أعظم أصولنا. نبحث دائماً عن أفراد شغوفين وملتزمين يشاركوننا التزامنا بالخدمة والموثوقية والابتكار.',
  },
  values: [
    { icon: 'shield', title: { en: 'Service Excellence', ar: 'التميز في الخدمة' }, description: { en: 'We go above and beyond to deliver exceptional service to every customer.', ar: 'نبذل قصارى جهدنا لتقديم خدمة استثنائية لكل عميل.' } },
    { icon: 'clock', title: { en: 'Reliability', ar: 'الموثوقية' }, description: { en: 'Dependable solutions that our customers and partners can count on, every time.', ar: 'حلول يعتمد عليها يمكن لعملائنا وشركائنا الاعتماد عليها في كل مرة.' } },
    { icon: 'lightbulb', title: { en: 'Innovation', ar: 'الابتكار' }, description: { en: 'Continuously improving our technology and processes to stay ahead.', ar: 'تحسين مستمر لتقنياتنا وعملياتنا للبقاء في المقدمة.' } },
    { icon: 'heart', title: { en: 'Integrity', ar: 'النزاهة' }, description: { en: 'Honest, transparent, and ethical in everything we do.', ar: 'الصدق والشفافية والأخلاقية في كل ما نقوم به.' } },
    { icon: 'users', title: { en: 'Teamwork', ar: 'العمل الجماعي' }, description: { en: 'Collaborating together to achieve exceptional results.', ar: 'التعاون معاً لتحقيق نتائج استثنائية.' } },
  ],
  openRoles: [],
};

// ─── Shipping Info ───
export const shippingInfoContent: ShippingPageContent = {
  title: { en: 'Shipping Information', ar: 'معلومات الشحن' },
  intro: {
    en: 'Mayar International provides comprehensive shipping and logistics solutions across Kuwait and internationally. We are committed to delivering your orders safely and on time.',
    ar: 'توفر ميار الدولية حلول شحن وخدمات لوجستية شاملة عبر الكويت ودولياً.',
  },
  sections: [
    {
      title: { en: 'Domestic Delivery Across Kuwait', ar: 'التوصيل المحلي في الكويت' },
      body: {
        en: 'We offer fast and reliable delivery to all areas within Kuwait. Standard delivery takes 1-3 business days, while express delivery is available for same-day or next-day service in most areas.',
        ar: 'نقدم توصيلاً سريعاً وموثوقاً لجميع المناطق في الكويت. التوصيل العادي يستغرق 1-3 أيام عمل.',
      },
    },
    {
      title: { en: 'International Shipping', ar: 'الشحن الدولي' },
      body: {
        en: 'We ship to destinations worldwide through our global network of logistics partners. International delivery times vary by destination, typically 5-15 business days. Tracking is available for all international shipments.',
        ar: 'نشحن إلى وجهات حول العالم من خلال شبكتنا العالمية من شركاء الخدمات اللوجستية.',
      },
    },
    {
      title: { en: 'Estimated Delivery Times', ar: 'أوقات التوصيل المقدرة' },
      body: {
        en: 'Kuwait (Standard): 1-3 business days • Kuwait (Express): Same day / next day • GCC Countries: 3-7 business days • International: 5-15 business days. Delivery times may vary during peak seasons and holidays.',
        ar: 'الكويت (عادي): 1-3 أيام عمل • الكويت (سريع): نفس اليوم / اليوم التالي • دول الخليج: 3-7 أيام عمل • دولي: 5-15 يوم عمل.',
      },
    },
    {
      title: { en: 'Tracking Updates', ar: 'تحديثات التتبع' },
      body: {
        en: 'All orders come with real-time tracking. You will receive SMS and email updates at each stage of delivery — from order confirmation to dispatch, out for delivery, and final delivery.',
        ar: 'جميع الطلبات تأتي مع تتبع في الوقت الحقيقي. ستتلقى رسائل SMS وبريد إلكتروني في كل مرحلة.',
      },
    },
    {
      title: { en: 'Customs & Documentation', ar: 'الجمارك والوثائق' },
      body: {
        en: 'For international orders, customs duties and taxes may apply depending on the destination country. Mayar International assists with all necessary documentation to ensure smooth customs clearance.',
        ar: 'بالنسبة للطلبات الدولية، قد تنطبق رسوم جمركية وضرائب. تساعد ميار الدولية في جميع الوثائق اللازمة.',
      },
    },
    {
      title: { en: 'Warehousing & Storage', ar: 'التخزين' },
      body: {
        en: 'We offer secure warehousing and storage solutions for businesses that need temporary or long-term storage of goods before distribution.',
        ar: 'نقدم حلول تخزين آمنة للشركات التي تحتاج تخزين مؤقت أو طويل الأمد.',
      },
    },
    {
      title: { en: 'Freight Forwarding', ar: 'الشحن والتوصيل' },
      body: {
        en: 'Our freight forwarding services cover air, sea, and land shipments. We coordinate the entire logistics chain from pickup to final delivery, handling all customs, documentation, and compliance requirements.',
        ar: 'تغطي خدمات الشحن لدينا الشحنات الجوية والبحرية والبرية. ننسق سلسلة الخدمات اللوجستية بالكامل.',
      },
    },
  ],
};

// ─── Returns & Exchange ───
export const returnsContent: ReturnsPageContent = {
  title: { en: 'Returns & Exchange', ar: 'الإرجاع والاستبدال' },
  intro: {
    en: 'At Mayar, we want you to be completely satisfied with your purchase. If you\'re not happy with your order, we offer a hassle-free returns and exchange process.',
    ar: 'في ميار، نريدك أن تكون راضياً تماماً عن مشترياتك. نقدم عملية إرجاع واستبدال سهلة.',
  },
  sections: [
    {
      title: { en: 'Return Eligibility', ar: 'أهلية الإرجاع' },
      body: {
        en: 'Items may be returned within 14 days of delivery. Products must be unused, in their original packaging, and in the same condition as received. All tags and labels must be intact.',
        ar: 'يمكن إرجاع المنتجات خلال 14 يوماً من التوصيل. يجب أن تكون المنتجات غير مستخدمة وفي عبوتها الأصلية.',
      },
    },
    {
      title: { en: 'Exchange Eligibility', ar: 'أهلية الاستبدال' },
      body: {
        en: 'Exchanges are available for items of the same value or higher (with the difference payable by the customer). The item must meet the same conditions as returns.',
        ar: 'الاستبدال متاح للمنتجات بنفس القيمة أو أعلى. يجب أن يستوفي المنتج نفس شروط الإرجاع.',
      },
    },
    {
      title: { en: 'Return Time Window', ar: 'فترة الإرجاع' },
      body: {
        en: 'You have 14 calendar days from the date of delivery to initiate a return or exchange request. Requests made after this period will not be accepted.',
        ar: 'لديك 14 يوماً تقويمياً من تاريخ التوصيل لتقديم طلب إرجاع أو استبدال.',
      },
    },
    {
      title: { en: 'Damaged or Wrong Items', ar: 'المنتجات التالفة أو الخاطئة' },
      body: {
        en: 'If you receive a damaged or incorrect item, please contact our support team within 48 hours of delivery. We will arrange a free return pickup and send the correct item or issue a full refund.',
        ar: 'إذا استلمت منتجاً تالفاً أو خاطئاً، تواصل مع فريق الدعم خلال 48 ساعة من التوصيل.',
      },
    },
    {
      title: { en: 'Non-Returnable Items', ar: 'المنتجات غير القابلة للإرجاع' },
      body: {
        en: 'Certain items cannot be returned including: intimate apparel, swimwear, beauty products that have been opened or used, personalized or customized items, and gift cards.',
        ar: 'بعض المنتجات لا يمكن إرجاعها بما في ذلك: الملابس الداخلية، ملابس السباحة، منتجات التجميل المفتوحة، والمنتجات المخصصة.',
      },
    },
    {
      title: { en: 'Refund Timeline', ar: 'الجدول الزمني للاسترداد' },
      body: {
        en: 'Once your return is received and inspected, we will process your refund within 5-7 business days. The refund will be credited to your original payment method.',
        ar: 'بمجرد استلام الإرجاع وفحصه، سنعالج استردادك خلال 5-7 أيام عمل.',
      },
    },
    {
      title: { en: 'How to Request a Return', ar: 'كيفية طلب الإرجاع' },
      body: {
        en: 'To initiate a return or exchange, contact our customer support team via email at mayaralmiya@gmail.com or call +965 50404099 during working hours (9:00 AM - 5:00 PM). Our team will guide you through the process.',
        ar: 'لطلب إرجاع أو استبدال، تواصل مع فريق دعم العملاء عبر البريد الإلكتروني أو الهاتف خلال ساعات العمل.',
      },
    },
  ],
};
