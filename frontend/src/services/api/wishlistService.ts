import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface WishlistDto {
  id: string;
  productId: string;
  userId: string;
  // Product details
  productNameEnglish?: string;
  productNameArabic?: string;
  brand?: string;
  productSlug?: string;
  // Variant specific details
  productVariantId: string;
  colorNameEnglish?: string;
  colorNameArabic?: string;
  colorHex?: string;
  sizeLabel?: string;
  priceKWD?: number;
  priceINR?: number;
  compareAtPriceKWD?: number;
  compareAtPriceINR?: number;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateWishlistRequest {
  userId: string;
  productVariantId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const wishlistApi = {
  /**
   * Get all wishlist items for a user
   */
  async getAllByUser(userId: string): Promise<ApiResponse<WishlistDto[]>> {
    const response = await axios.get<ApiResponse<WishlistDto[]>>(
      `${API_BASE_URL}/api/Wishlist/user/${userId}`
    );
    return response.data;
  },

  /**
   * Get a specific wishlist item by ID
   */
  async getById(id: string): Promise<ApiResponse<WishlistDto>> {
    const response = await axios.get<ApiResponse<WishlistDto>>(
      `${API_BASE_URL}/api/Wishlist/${id}`
    );
    return response.data;
  },

  /**
   * Add a product variant to wishlist
   */
  async create(request: CreateWishlistRequest): Promise<ApiResponse<WishlistDto>> {
    const response = await axios.post<ApiResponse<WishlistDto>>(
      `${API_BASE_URL}/api/Wishlist/create`,
      request
    );
    return response.data;
  },

  /**
   * Remove a wishlist item by ID
   */
  async remove(id: string): Promise<ApiResponse<object>> {
    const response = await axios.delete<ApiResponse<object>>(
      `${API_BASE_URL}/api/Wishlist/delete/${id}`
    );
    return response.data;
  },

  /**
   * Remove a wishlist item by userId and productId
   */
  async removeByUserAndProduct(userId: string, productId: string): Promise<ApiResponse<object>> {
    const response = await axios.delete<ApiResponse<object>>(
      `${API_BASE_URL}/api/Wishlist/remove`,
      {
        params: { userId, productId }
      }
    );
    return response.data;
  },

  /**
   * Check if a product is in the user's wishlist
   */
  async isInWishlist(userId: string, productId: string): Promise<ApiResponse<boolean>> {
    const response = await axios.get<ApiResponse<boolean>>(
      `${API_BASE_URL}/api/Wishlist/check`,
      {
        params: { userId, productId }
      }
    );
    return response.data;
  },

  /**
   * Check if a specific variant is in the user's wishlist
   */
  async isVariantInWishlist(userId: string, productVariantId: string): Promise<ApiResponse<boolean>> {
    const response = await axios.get<ApiResponse<boolean>>(
      `${API_BASE_URL}/api/Wishlist/check-variant`,
      {
        params: { userId, productVariantId }
      }
    );
    return response.data;
  },
};
