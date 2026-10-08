/**
 * Application route constants.
 * Never use raw path strings — always import from here.
 */
export const ROUTES = {
  HOME: "/",
  // Auth
  LOGIN: "/login",
  LUPA_PASSWORD: "/lupa-password",
  VERIFIKASI_OTP: "/verifikasi-otp",
  ATUR_ULANG_KATA_SANDI: "/atur-ulang-kata-sandi",
  BERHASIL_RESET: "/berhasil-reset",
  // Admin pages
  DASHBOARD: "/admin/dashboard",
  DATA_PASIEN: "/admin/data-pasien",
  PEMANTAUAN_CATATAN_PASIEN: "/admin/pemantauan-catatan-pasien",
  MANAJEMEN_EDUKASI: "/admin/manajemen-edukasi",
  MANAJEMEN_KUISIONER: "/admin/manajemen-kuisioner",
  SURVEY: "/admin/survey",
  DATA_MAKANAN: "/admin/data-makanan",
  ADMINISTRATOR: "/admin/administrator",
  FASILITAS: "/admin/fasilitas",
  PENGATURAN: "/admin/pengaturan",
  // Staff pages
  STAFF_DASHBOARD: "/staff/dashboard",
  STAFF_PEMANTAUAN_CATATAN_PASIEN: "/staff/pemantauan-catatan-pasien",
  STAFF_MANAJEMEN_EDUKASI: "/staff/manajemen-edukasi",
  STAFF_MANAJEMEN_KUISIONER: "/staff/manajemen-kuisioner",
  STAFF_SURVEY: "/staff/survey",
  STAFF_PENGATURAN: "/staff/pengaturan",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
  