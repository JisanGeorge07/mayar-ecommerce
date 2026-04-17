// Navigation mega menu types — PostgreSQL-ready relational model

import type { TranslatedText } from '@/types';

export interface MegaMenuLink {
  id: string;
  label: TranslatedText;
  slug: string;
}

export interface MegaMenuSection {
  id: string;
  title: TranslatedText;
  href?: string;
  links: MegaMenuLink[];
}

export interface NavMenuItem {
  id: string;
  label: TranslatedText;
  slug: string;
  type: 'link' | 'mega';
  badge?: TranslatedText;
  sections?: MegaMenuSection[];
  featuredImage?: string;
  featuredTitle?: TranslatedText;
  featuredCta?: TranslatedText;
}
