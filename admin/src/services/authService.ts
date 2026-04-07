import api from "@/lib/axios";
import type { LoginRequest, AdminUser, TokenResponse } from "@/types/auth";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_ID_KEY = "userId";

export const authService = {
  async login(
    data: LoginRequest
  ): Promise<{ success: boolean; user?: AdminUser; message: string }> {
    try {
      const res = await api.post<TokenResponse>("/auth/admin/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem(TOKEN_KEY, res.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
      localStorage.setItem(USER_ID_KEY, res.data.userId);

      const user = await this.getCurrentUser();
      return {
        success: true,
        user: user ?? undefined,
        message: "Login successful",
      };
    } catch (err: any) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Invalid credentials or insufficient permissions",
      };
    }
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const res = await api.get<{ success: boolean; user: AdminUser }>(
        "/auth/checkAuth"
      );

      if (res.data.user.role !== "Admin") {
        this.logout();
        return null;
      }

      return res.data.user;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch {
        // clear tokens regardless
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
