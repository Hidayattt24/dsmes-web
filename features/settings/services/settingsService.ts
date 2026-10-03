import type { SystemSettings } from "../types/settings";
import { axiosInstance } from "@/lib/axios";
import { tokenService } from "@/utils/token";

function getMeEndpoint(): string {
  const token = tokenService.getAccessToken();
  if (!token) return "/admin/me"; // fallback
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const role = JSON.parse(jsonPayload).role;
    return role === "admin" ? "/admin/me" : "/staff/me";
  } catch {
    return "/admin/me";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapSettingsFromBackend = (data: any): SystemSettings => {
  return {
    name: data.full_name || "",
    username: data.username || "",
    email: data.email || "",
    whatsapp: data.whatsapp_number || "",
    puskesmas: data.health_facility_name || data.health_facility || "",
    jabatan: data.position_title || "",
    bio: data.short_bio || "",
    profilePhoto: data.profile_photo_url || "",
  };
};

const mapSettingsToBackend = (settings: SystemSettings) => {
  return {
    full_name: settings.name,
    username: settings.username,
    email: settings.email,
    whatsapp_number: settings.whatsapp,
    position_title: settings.jabatan,
    short_bio: settings.bio,
    profile_photo_url: settings.profilePhoto,
  };
};

export const settingsService = {
  async getSettings(): Promise<SystemSettings> {
    const endpoint = getMeEndpoint();
    const res = await axiosInstance.get(endpoint);
    return mapSettingsFromBackend(res.data.data);
  },

  async saveSettings(settings: SystemSettings): Promise<SystemSettings> {
    const endpoint = getMeEndpoint();
    const payload = mapSettingsToBackend(settings);
    const res = await axiosInstance.put(endpoint, payload);
    return mapSettingsFromBackend(res.data.data);
  },

  async changePassword(current: string, newPass: string): Promise<void> {
    const endpoint = `${getMeEndpoint()}/password`;
    await axiosInstance.put(endpoint, {
      current_password: current,
      new_password: newPass,
    });
  },
} as const;
