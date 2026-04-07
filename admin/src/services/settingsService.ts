// Feature settings and checkout country/address configuration service
import api from '@/lib/axios';

// Response wrapper type from backend
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FeatureSettings {
  id?: string;
  enableEnglish: boolean;
  enableArabic: boolean;
  enableKwd: boolean;
  enableInr: boolean;
  enableWishlist: boolean;
  enableReviews: boolean;
  enableOrderTracking: boolean;
  enableNewsletter: boolean;
  enableMyAccount: boolean;
  enableGuestCheckout: boolean;
  brandName?: string;
  tagline?: string;
  logoUrl?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
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

export interface CheckoutAddressField {
  id: string;
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

export interface UpdateFeatureSettings {
  enableEnglish?: boolean;
  enableArabic?: boolean;
  enableKwd?: boolean;
  enableInr?: boolean;
  enableWishlist?: boolean;
  enableReviews?: boolean;
  enableOrderTracking?: boolean;
  enableNewsletter?: boolean;
  enableMyAccount?: boolean;
  enableGuestCheckout?: boolean;
  brandName?: string;
  tagline?: string;
  logoUrl?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
}

export interface CreateCheckoutCountry {
  countryName: string;
  countryCode: string;
  isEnabled?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
}

export interface UpdateCheckoutCountry {
  countryName?: string;
  countryCode?: string;
  isEnabled?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
}

export interface CreateCheckoutAddressField {
  countryId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldLabelArabic?: string;
  isVisible?: boolean;
  isRequired?: boolean;
  sortOrder?: number;
}

export interface UpdateCheckoutAddressField {
  fieldKey?: string;
  fieldLabel?: string;
  fieldLabelArabic?: string;
  isVisible?: boolean;
  isRequired?: boolean;
  sortOrder?: number;
}

export const settingsService = {
  // Feature Settings
  async getSettings(): Promise<FeatureSettings> {
    const response = await api.get<ApiResponse<FeatureSettings>>('/Settings/get-settings');
    return response.data.data;
  },

  async updateSettings(data: UpdateFeatureSettings): Promise<FeatureSettings> {
    const response = await api.put<ApiResponse<FeatureSettings>>('/Settings/update-settings', data);
    return response.data.data;
  },

  // Checkout Countries
  async getCountries(): Promise<CheckoutCountry[]> {
    const response = await api.get<ApiResponse<CheckoutCountry[]>>('/Settings/countries');
    return response.data.data;
  },

  async getCountryById(id: string): Promise<CheckoutCountry> {
    const response = await api.get<ApiResponse<CheckoutCountry>>(`/Settings/countries/${id}`);
    return response.data.data;
  },

  async createCountry(data: CreateCheckoutCountry): Promise<CheckoutCountry> {
    const response = await api.post<ApiResponse<CheckoutCountry>>('/Settings/countries', data);
    return response.data.data;
  },

  async updateCountry(id: string, data: UpdateCheckoutCountry): Promise<CheckoutCountry> {
    const response = await api.put<ApiResponse<CheckoutCountry>>(`/Settings/countries/${id}`, data);
    return response.data.data;
  },

  async deleteCountry(id: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<object>>(`/Settings/countries/${id}`);
    return response.data.success;
  },

  // Checkout Address Fields
  async getAddressFields(countryId: string): Promise<CheckoutAddressField[]> {
    const response = await api.get<ApiResponse<CheckoutAddressField[]>>(`/Settings/address-fields/${countryId}`);
    return response.data.data;
  },

  async getAddressFieldById(id: string): Promise<CheckoutAddressField> {
    const response = await api.get<ApiResponse<CheckoutAddressField>>(`/Settings/address-field/${id}`);
    return response.data.data;
  },

  async createAddressField(data: CreateCheckoutAddressField): Promise<CheckoutAddressField> {
    const response = await api.post<ApiResponse<CheckoutAddressField>>('/Settings/address-fields', data);
    return response.data.data;
  },

  async updateAddressField(id: string, data: UpdateCheckoutAddressField): Promise<CheckoutAddressField> {
    const response = await api.put<ApiResponse<CheckoutAddressField>>(`/Settings/address-fields/${id}`, data);
    return response.data.data;
  },

  async deleteAddressField(id: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<object>>(`/Settings/address-fields/${id}`);
    return response.data.success;
  },
};
