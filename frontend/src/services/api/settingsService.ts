import api from '@/lib/axios';

export interface FeatureSettings {
  id?: string;
  // Language Settings
  enableEnglish: boolean;
  enableArabic: boolean;
  // Currency Settings
  enableKwd: boolean;
  enableInr: boolean;
  // Feature Toggles
  enableWishlist: boolean;
  enableReviews: boolean;
  enableOrderTracking: boolean;
  enableNewsletter: boolean;
  enableMyAccount: boolean;
  enableGuestCheckout: boolean;
  // Brand Settings
  brandName?: string;
  tagline?: string;
  logoUrl?: string;
  // Default SEO
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  // Timestamps
  updatedAt?: string;
}

export interface CheckoutAddressField {
  id?: string;
  countryId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldLabelArabic?: string;
  isVisible: boolean;
  isRequired: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckoutCountry {
  id: string;
  countryName: string;
  countryCode: string;
  isEnabled: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const settingsService = {
  getSettings: async (): Promise<FeatureSettings> => {
    const response = await api.get<ApiResponse<FeatureSettings>>('/Settings/get-settings');
    return response.data.data;
  },

  getCountries: async (): Promise<CheckoutCountry[]> => {
    const response = await api.get<ApiResponse<CheckoutCountry[]>>('/Settings/countries');
    return response.data.data;
  },

  getAddressFields: async (countryId: string): Promise<CheckoutAddressField[]> => {
    const response = await api.get<ApiResponse<CheckoutAddressField[]>>(`/Settings/address-fields/${countryId}`);
    return response.data.data;
  },
};
