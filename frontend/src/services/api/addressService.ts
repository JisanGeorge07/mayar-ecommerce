import api from '@/lib/axios';

export interface AddressDto {
  id: string;
  label: string;
  isDefault: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  flatOffice?: string;
  notes?: string;
}

export interface CreateAddressDto {
  label: string;
  isDefault: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  flatOffice?: string;
  notes?: string;
}

export interface UpdateAddressDto {
  label: string;
  isDefault: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  flatOffice?: string;
  notes?: string;
}

export const addressService = {
  // Get all addresses for the current user
  getAddresses: async (): Promise<AddressDto[]> => {
    const response = await api.get('/address');
    return response.data;
  },

  // Get a specific address by ID
  getAddress: async (id: string): Promise<AddressDto> => {
    const response = await api.get(`/address/${id}`);
    return response.data;
  },

  // Create a new address
  createAddress: async (data: CreateAddressDto): Promise<AddressDto> => {
    const response = await api.post('/address', data);
    return response.data;
  },

  // Update an existing address
  updateAddress: async (id: string, data: UpdateAddressDto): Promise<AddressDto> => {
    const response = await api.put(`/address/${id}`, data);
    return response.data;
  },

  // Delete an address
  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/address/${id}`);
  },

  // Set an address as default
  setDefaultAddress: async (id: string): Promise<void> => {
    await api.post(`/address/${id}/set-default`);
  },
};
