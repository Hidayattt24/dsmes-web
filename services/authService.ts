import { axiosInstance } from "@/lib/axios";
import type { AuthResponse, LoginCredentials, AuthUser } from "@/types/auth";
import type { ApiResponse } from "@/types/api";
import { tokenService } from "@/utils/token";

export const authService = {
  /**
   * Authenticate the user with email + password.
   * Only allows admin and staff roles.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<{
        user: {
          id: string;
          full_name: string;
          email: string;
          role: string;
        };
        tokens: {
          access_token: string;
          refresh_token: string;
          expires_at: number;
        };
      }>>("/auth/staff/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const { user: backendUser, tokens } = response.data.data;

      // Check role authorization
      if (backendUser.role === "user" || backendUser.role === "patient") {
        throw new Error("Akun ini hanya dapat digunakan pada aplikasi mobile.");
      }

      if (backendUser.role !== "admin" && backendUser.role !== "staff") {
        throw new Error("Peran pengguna tidak diizinkan untuk masuk ke dashboard.");
      }

      // Store tokens in cookies
      tokenService.setAccessToken(tokens.access_token);
      tokenService.setRefreshToken(tokens.refresh_token);

      const user: AuthUser = {
        id: backendUser.id,
        name: backendUser.full_name,
        email: backendUser.email,
        role: backendUser.role,
        puskesmas: "", // fallback
      };

      return {
        user,
        token: tokens.access_token,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw error;
    }
  },

  /** Sign the current user out. */
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenService.getRefreshToken();
      await axiosInstance.post("/auth/logout", {
        refresh_token: refreshToken || "",
      });
    } catch (error) {
      console.error("Logout API failed, continuing client-side logout:", error);
    } finally {
      tokenService.clearTokens();
    }
  },

  /** Check whether an email is registered to a staff account. */
  async checkEmail(email: string): Promise<void> {
    try {
      await axiosInstance.post("/auth/forgot-password/check-email", {
        email,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw error;
    }
  },

  /** Request an OTP for password reset via Resend email. */
  async forgotPassword(email: string, ownerType: "staff" | "patient" = "staff"): Promise<void> {
    try {
      await axiosInstance.post("/auth/forgot-password", {
        email,
        owner_type: ownerType,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw error;
    }
  },

  /** Verify the 6-digit OTP code sent to user email. */
  async verifyOtp(email: string, otpCode: string, ownerType: "staff" | "patient" = "staff"): Promise<void> {
    try {
      await axiosInstance.post("/auth/verify-otp", {
        email,
        otp_code: otpCode,
        owner_type: ownerType,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw error;
    }
  },

  /** Reset user password using the verified OTP code. */
  async resetPassword(
    email:           string,
    otpCode:         string,
    password:        string,
    confirmPassword: string,
    ownerType:       "staff" | "patient" = "staff"
  ): Promise<void> {
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp_code: otpCode,
        new_password: password,
        confirm_password: confirmPassword,
        owner_type: ownerType,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw error;
    }
  },

  /** Set a new password for a staff account using a registered email. */
  async resetPasswordByEmail(
    email:           string,
    password:        string,
    confirmPassword: string
  ): Promise<void> {
    try {
      await axiosInstance.post("/auth/reset-password-by-email", {
        email,
        new_password: password,
        confirm_password: confirmPassword,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw error;
    }
  },
} as const;
