import { useState, useEffect } from 'react';
import { settingsService, CheckoutAddressField, CheckoutCountry } from '@/services/api/settingsService';

export const useCheckoutFields = () => {
  const [fields, setFields] = useState<CheckoutAddressField[]>([]);
  const [countries, setCountries] = useState<CheckoutCountry[]>([]);
  const [defaultCountry, setDefaultCountry] = useState<CheckoutCountry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesData = await settingsService.getCountries();
        setCountries(countriesData);

        // Find default country
        const defaultC = countriesData.find(c => c.isDefault) || countriesData[0];
        setDefaultCountry(defaultC || null);

        // Fetch address fields for default country
        if (defaultC) {
          const fieldsData = await settingsService.getAddressFields(defaultC.id);
          // Sort by sortOrder - include all fields (visible and hidden)
          // The component will handle visibility checks
          const sortedFields = fieldsData.sort((a, b) => a.sortOrder - b.sortOrder);
          setFields(sortedFields);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch checkout fields:', err);
        setError('Failed to load address fields');
        // Provide fallback default fields if API fails
        setFields(getDefaultFields());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { fields, countries, defaultCountry, loading, error };
};

// Fallback default fields if API fails
const getDefaultFields = (): CheckoutAddressField[] => [
  { fieldKey: 'firstName', fieldLabel: 'First Name', fieldLabelArabic: 'الاسم الأول', isVisible: true, isRequired: true, sortOrder: 0, countryId: '' },
  { fieldKey: 'lastName', fieldLabel: 'Last Name', fieldLabelArabic: 'الاسم الأخير', isVisible: true, isRequired: true, sortOrder: 1, countryId: '' },
  { fieldKey: 'email', fieldLabel: 'Email', fieldLabelArabic: 'البريد الإلكتروني', isVisible: true, isRequired: true, sortOrder: 2, countryId: '' },
  { fieldKey: 'phone', fieldLabel: 'Phone', fieldLabelArabic: 'رقم الهاتف', isVisible: true, isRequired: true, sortOrder: 3, countryId: '' },
  { fieldKey: 'area', fieldLabel: 'Area', fieldLabelArabic: 'المنطقة', isVisible: true, isRequired: true, sortOrder: 4, countryId: '' },
  { fieldKey: 'block', fieldLabel: 'Block', fieldLabelArabic: 'القطعة', isVisible: true, isRequired: true, sortOrder: 5, countryId: '' },
  { fieldKey: 'street', fieldLabel: 'Street', fieldLabelArabic: 'الشارع', isVisible: true, isRequired: true, sortOrder: 6, countryId: '' },
  { fieldKey: 'building', fieldLabel: 'Building', fieldLabelArabic: 'المبنى', isVisible: true, isRequired: true, sortOrder: 7, countryId: '' },
  { fieldKey: 'floor', fieldLabel: 'Floor', fieldLabelArabic: 'الطابق', isVisible: true, isRequired: false, sortOrder: 8, countryId: '' },
  { fieldKey: 'flat', fieldLabel: 'Flat / Office', fieldLabelArabic: 'شقة / مكتب', isVisible: true, isRequired: false, sortOrder: 9, countryId: '' },
  { fieldKey: 'notes', fieldLabel: 'Additional Notes', fieldLabelArabic: 'ملاحظات إضافية', isVisible: true, isRequired: false, sortOrder: 10, countryId: '' },
];
