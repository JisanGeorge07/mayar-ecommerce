import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { CheckoutState, CustomerDetails, DeliveryAddress, SavedAddress } from '@/types/checkout';
import { loadCheckout, saveCheckout, getDefaultCheckout, clearCheckoutStorage } from '@/services/api/checkoutService';
import { addressService, type AddressDto } from '@/services/api/addressService';
import { useAuth } from '@/context/AuthContext';

interface CheckoutContextValue {
  state: CheckoutState;
  setCustomer: (d: CustomerDetails) => void;
  setAddress: (a: DeliveryAddress) => void;
  setShippingMethod: (id: string) => void;
  setPaymentMethod: (id: string) => void;
  setAgreedToTerms: (v: boolean) => void;
  setSelectedAddressId: (id: string) => void;
  resetCheckout: () => void;
  /** Saved addresses — only populated for logged-in users */
  savedAddresses: SavedAddress[];
  /** Loading state for addresses */
  loadingAddresses: boolean;
  /** Apply a saved address to address fields */
  applySavedAddress: (addr: SavedAddress) => void;
  /** Refresh saved addresses from API */
  refreshAddresses: () => Promise<void>;
  /** Clear selected address and allow manual entry */
  clearSelectedAddress: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

// Convert API AddressDto to SavedAddress
const mapAddressToSavedAddress = (addr: AddressDto): SavedAddress => ({
  id: addr.id,
  label: addr.label,
  isDefault: addr.isDefault,
  firstName: addr.firstName,
  lastName: addr.lastName,
  phone: addr.phone,
  email: addr.email,
  area: addr.area,
  block: addr.block,
  street: addr.street,
  building: addr.building,
  floor: addr.floor,
  flatOffice: addr.flatOffice,
  notes: addr.notes,
});

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [state, setState] = useState<CheckoutState>(loadCheckout);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [manualAddressEntry, setManualAddressEntry] = useState(false);

  // Track previous login state to detect login/logout transitions
  const prevIsLoggedIn = useRef<boolean | null>(null);

  // Clear checkout when user logs out OR reset for fresh guest checkout
  useEffect(() => {
    // On logout: clear checkout state
    if (prevIsLoggedIn.current === true && !isLoggedIn) {
      clearCheckoutStorage();
      setState(getDefaultCheckout());
    }
    // On first load as guest: ensure checkout is empty (no stale data from previous sessions)
    else if (prevIsLoggedIn.current === null && !isLoggedIn) {
      // Clear any stale checkout data for guest users
      clearCheckoutStorage();
      setState(getDefaultCheckout());
    }

    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  // Fetch saved addresses from API
  const refreshAddresses = useCallback(async () => {
    if (!isLoggedIn) {
      setSavedAddresses([]);
      return;
    }

    setLoadingAddresses(true);
    try {
      const addresses = await addressService.getAddresses();
      setSavedAddresses(addresses.map(mapAddressToSavedAddress));
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setSavedAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  }, [isLoggedIn]);

  // Load addresses when user logs in
  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  // Prefill customer info from user profile if available
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    // Only prefill if checkout customer is empty
    if (state.customer.firstName || state.customer.email) return;

    // Use user profile info for customer details
    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setState(s => ({
      ...s,
      customer: {
        firstName,
        lastName,
        email: user.email || '',
        phone: user.phoneNumber || '',
      },
    }));
  }, [isLoggedIn, user, state.customer.firstName, state.customer.email]);

  // Auto-apply default address if checkout address is empty
  useEffect(() => {
    if (!isLoggedIn || savedAddresses.length === 0) return;
    // Don't auto-apply if user wants manual entry
    if (manualAddressEntry) return;
    // Only prefill if checkout address is empty
    if (state.address.area || state.selectedAddressId) return;

    const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
    if (defaultAddr) {
      setState(s => ({
        ...s,
        selectedAddressId: defaultAddr.id,
        address: {
          area: defaultAddr.area,
          block: defaultAddr.block,
          street: defaultAddr.street,
          building: defaultAddr.building,
          floor: defaultAddr.floor || '',
          flat: defaultAddr.flatOffice || '',
          notes: defaultAddr.notes || '',
        },
      }));
    }
  }, [isLoggedIn, savedAddresses, state.address.area, state.selectedAddressId, manualAddressEntry]);

  useEffect(() => { saveCheckout(state); }, [state]);

  const setCustomer = useCallback((customer: CustomerDetails) =>
    setState(s => ({ ...s, customer })), []);

  const setAddress = useCallback((address: DeliveryAddress) =>
    setState(s => ({ ...s, address })), []);

  const setShippingMethod = useCallback((shippingMethodId: string) =>
    setState(s => ({ ...s, shippingMethodId })), []);

  const setPaymentMethod = useCallback((paymentMethodId: string) =>
    setState(s => ({ ...s, paymentMethodId })), []);

  const setAgreedToTerms = useCallback((agreedToTerms: boolean) =>
    setState(s => ({ ...s, agreedToTerms })), []);

  const setSelectedAddressId = useCallback((selectedAddressId: string) =>
    setState(s => ({ ...s, selectedAddressId })), []);

  const applySavedAddress = useCallback((addr: SavedAddress) => {
    setManualAddressEntry(false); // Reset manual entry flag
    setState(s => ({
      ...s,
      selectedAddressId: addr.id,
      address: {
        area: addr.area,
        block: addr.block,
        street: addr.street,
        building: addr.building,
        floor: addr.floor || '',
        flat: addr.flatOffice || '',
        notes: addr.notes || '',
      },
      // Also apply contact info from saved address if available
      customer: {
        firstName: addr.firstName || s.customer.firstName,
        lastName: addr.lastName || s.customer.lastName,
        email: addr.email || s.customer.email,
        phone: addr.phone || s.customer.phone,
      },
    }));
  }, []);

  const resetCheckout = useCallback(() => setState(getDefaultCheckout()), []);

  const clearSelectedAddress = useCallback(() => {
    setManualAddressEntry(true); // Enable manual entry mode
    setState(s => ({
      ...s,
      selectedAddressId: '',
      address: {
        area: '',
        block: '',
        street: '',
        building: '',
        floor: '',
        flat: '',
        notes: '',
      },
    }));
  }, []);

  return (
    <CheckoutContext.Provider value={{
      state,
      setCustomer,
      setAddress,
      setShippingMethod,
      setPaymentMethod,
      setAgreedToTerms,
      setSelectedAddressId,
      resetCheckout,
      savedAddresses,
      loadingAddresses,
      applySavedAddress,
      refreshAddresses,
      clearSelectedAddress,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
};
