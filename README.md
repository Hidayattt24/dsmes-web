# DSMES Aceh Web Admin & Staff Portal — Developer Guide

Portal web resmi untuk **Administrator Sistem** dan **Staff Puskesmas / Tenaga Kesehatan** pada platform **DSMES Aceh** (*Diabetes Self-Management Education and Support*). Dokumen ini disusun secara mendalam sebagai panduan arsitektur, konvensi kode, design system, dan workflow deployment bagi developer.

---

## Daftar Isi
1. [Arsitektur & Tech Stack](#arsitektur--tech-stack)
2. [Design System & Color Tokens (`app/globals.css`)](#design-system--color-tokens-appglobalscss)
3. [Standar Penamaan Variabel & Kode (Naming Conventions)](#standar-penamaan-variabel--kode-naming-conventions)
4. [Struktur Folder & Navigasi Rute (`app/`)](#struktur-folder--navigasi-rute-app)
5. [Arsitektur Komponen UI (`components/`)](#arsitektur-komponen-ui-components)
6. [Arsitektur Fitur & State (`features/` & `hooks/`)](#arsitektur-fitur--state-features--hooks)
7. [Integrasi REST API (`services/` & `lib/axios.ts`)](#integrasi-rest-api-services--libaxiosts)
8. [Konfigurasi Docker & Containerisasi](#konfigurasi-docker--containerisasi)
9. [Konfigurasi CI/CD Pipeline (GitHub Actions)](#konfigurasi-cicd-pipeline-github-actions)
10. [Instalasi Lokal & Skrip Verifikasi](#instalasi-lokal--skrip-verifikasi)

---

## Arsitektur & Tech Stack

Portal web dibangun menggunakan fondasi modern Next.js App Router dengan arsitektur modular yang memisahkan urusan UI atomik, fitur bisnis terenkapsulasi, dan integrasi backend.

* **Core Framework:** Next.js `16.2.10` (App Router, Turbopack, Standalone Output)
* **View Library:** React `19.2.4`
* **Language:** TypeScript `5.x` (Strict mode aktif)
* **Styling & Tokens:** Tailwind CSS `v4` (`@theme inline` di `app/globals.css`)
* **State Management:** Zustand `5.x` (Auth & session store)
* **Data Fetching:** Axios dengan centralized instance & interceptor JWT
* **Icons:** Google Material Symbols Outlined

---

## Design System & Color Tokens (`app/globals.css`)

DSMES Web mengimplementasikan design system berbasis CSS tokens yang didefinisikan pada blok `@theme inline` di `app/globals.css`. Seluruh developer wajib mematuhi tokens ini untuk menjaga konsistensi visual.

### 1. Typography (Font Stacks)
* `--font-poppins` (`"Poppins", sans-serif`): Font utama portal admin & dashboard. Memberikan kesan modern, tegas, dan mudah dibaca pada data medis.
* `--font-jakarta` (`"Plus Jakarta Sans", sans-serif`): Digunakan khusus pada alur autentikasi (login, reset password, OTP).

### 2. Dashboard Color Palette
Palette warna utama untuk area portal kerja:

| CSS Variable | Hex Code | Utility Class Tailwind | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#00695C` | `text-primary`, `bg-primary` | Deep Teal; tombol aksi utama, active state menu, branding DSMES |
| `--color-primary-light` | `#F0F9F8` | `bg-primary-light` | Soft Teal; background badge aktif, chip highlight, hover state |
| `--color-surface-bg` | `#F4F6F8` | `bg-surface-bg` | Neutral Soft Gray; warna latar belakang halaman (canvas body) |
| `--color-surface-card` | `#FFFFFF` | `bg-surface-card` | Pure White; kontainer card, modal dialog, panel tabel |
| `--color-text-main` | `#1A202C` | `text-text-main` | Deep Charcoal; heading (H1-H4), nama pasien, nilai metrik penting |
| `--color-text-muted` | `#718096` | `text-text-muted` | Cool Slate Gray; sub-heading, caption, label input, metadata |
| `--color-border-light` | `#E2E8F0` | `border-border-light` | Soft Border; garis pembatas kartu, separator header, border input |
| `--color-error-bg` | `#FFF5F5` | `bg-error-bg` | Soft Rose; background badge Tidak Patuh, alert error, modal bahaya |
| `--color-error-text` | `#C53030` | `text-error-text` | Crimson Red; teks peringatan bahaya, tombol hapus, badge error |
| `--color-warning-bg` | `#FFFBEB` | `bg-warning-bg` | Soft Amber; background badge Kurang Patuh, draft status |
| `--color-warning-text` | `#B45309` | `text-warning-text` | Amber Orange; teks peringatan risiko sedang, perhatian khusus |

### 3. Auth Color Palette
Digunakan khusus di modul `features/auth/`:
* `--color-auth-primary`: `#004F45` (Deep Forest Teal)
* `--color-auth-surface`: `#FBF9F8` (Warm Off-white)
* `--color-auth-on-surface`: `#1B1C1C` (Dark Neutral)
* `--color-auth-outline`: `#6E7976` (Neutral Stroke)

### 4. Spacing, Radius, & Elevation
* **Border Radius:**
  - Card/Modal: `--radius-card` (`16px` / `rounded-2xl`)
  - Input/Button: `--radius-input` (`12px` / `rounded-xl`)
  - Pill/Badge: `--radius-pill` (`9999px` / `rounded-full`)
* **Card Elevation:**
  - `.premium-card`: Custom utility di `globals.css` yang memadukan `bg-white`, `border border-[#E2E8F0]`, `rounded-2xl`, dan shadow lembut `0 4px 20px rgba(0,0,0,0.02)`.

---

## Standar Penamaan Variabel & Kode (Naming Conventions)

Agar kode tetap homogen dan terprediksi, seluruh file dan variabel harus mengikuti konvensi berikut:

| Kategori | Konvensi | Contoh | Catatan |
| :--- | :--- | :--- | :--- |
| **Komponen React** | `PascalCase.tsx` | `PatientTable.tsx`, `RecordMonitoringFilters.tsx` | Satu komponen utama per file |
| **Custom Hooks** | `useCamelCase.ts` | `usePatients.ts`, `useStaffDashboard.ts` | Wajib berawalan kata `use` |
| **Service Layer** | `camelCase.ts` | `patientService.ts`, `surveyService.ts` | Berisi fungsi-fungsi pemanggil API |
| **Interfaces / Types** | `PascalCase` | `PatientRecord`, `ComplianceBreakdown` | Definisikan di file `types/*.ts` |
| **Handler Fungsi Event** | `handle<Action>` | `handleSubmit`, `handleSearchChange` | Untuk fungsi internal komponen |
| **Props Callback** | `on<Action>` | `onSave`, `onDateChange`, `onTabChange` | Untuk prop yang diterima komponen anak |
| **State Booleans** | `is<State>` / `has<State>` | `isLoading`, `isDeleting`, `hasError` | Menjelaskan status kondisi boolean |
| **Konstanta / Enums** | `UPPER_SNAKE_CASE` | `DEFAULT_LIKERT_SATISFACTION`, `RANGE_OPTIONS` | Digunakan untuk static array/options |

---

## Struktur Folder & Navigasi Rute (`app/`)

Next.js App Router dikelompokkan ke dalam Route Group `(pages)` untuk membedakan hak akses dan shell layout:

```text
dsmes-web/app/
├── layout.tsx                   # Root HTML Shell & Providers (Auth, Toast)
├── globals.css                  # Global Tailwind Tokens & Custom CSS
├── (pages)/                     # Route Group (tidak memengaruhi path URL)
│   ├── login/page.tsx           # /login
│   ├── lupa-password/page.tsx   # /lupa-password
│   │
│   ├── admin/                   # Route khusus Role ADMIN (/admin/*)
│   │   ├── layout.tsx           # Shell Admin: Sidebar Admin + Header
│   │   ├── dashboard/page.tsx   # /admin/dashboard
│   │   ├── data-pasien/
│   │   │   ├── page.tsx         # /admin/data-pasien
│   │   │   └── [id]/page.tsx    # /admin/data-pasien/:id
│   │   ├── pemantauan-catatan-pasien/
│   │   │   ├── page.tsx         # /admin/pemantauan-catatan-pasien
│   │   │   └── [id]/page.tsx    # /admin/pemantauan-catatan-pasien/:id
│   │   ├── manajemen-edukasi/
│   │   │   ├── page.tsx         # /admin/manajemen-edukasi
│   │   │   ├── tambah/page.tsx  # /admin/manajemen-edukasi/tambah
│   │   │   ├── [id]/page.tsx    # /admin/manajemen-edukasi/:id
│   │   │   ├── [id]/edit/       # /admin/manajemen-edukasi/:id/edit
│   │   │   └── [id]/progress/   # /admin/manajemen-edukasi/:id/progress
│   │   ├── manajemen-kuisioner/
│   │   │   ├── page.tsx         # /admin/manajemen-kuisioner
│   │   │   ├── tambah/page.tsx  # /admin/manajemen-kuisioner/tambah
│   │   │   ├── [id]/page.tsx    # /admin/manajemen-kuisioner/:id
│   │   │   ├── [id]/edit/       # /admin/manajemen-kuisioner/:id/edit
│   │   │   └── [id]/participant/[participantId]/page.tsx
│   │   ├── survey/
│   │   │   ├── page.tsx         # /admin/survey
│   │   │   ├── create/page.tsx  # /admin/survey/create
│   │   │   ├── [id]/page.tsx    # /admin/survey/:id
│   │   │   ├── [id]/edit/       # /admin/survey/:id/edit
│   │   │   └── [id]/analytics/  # /admin/survey/:id/analytics
│   │   ├── data-makanan/        # /admin/data-makanan (+ tambah, edit)
│   │   ├── fasilitas/page.tsx   # /admin/fasilitas
│   │   ├── administrator/       # /admin/administrator (Manajemen Staff)
│   │   └── pengaturan/page.tsx  # /admin/pengaturan
│   │
│   └── staff/                   # Route khusus Role STAFF (/staff/*)
│       ├── layout.tsx           # Shell Staff: Sidebar Staff + Header
│       ├── dashboard/page.tsx   # /staff/dashboard
│       ├── pemantauan-catatan-pasien/
│       ├── manajemen-kuisioner/
│       ├── survey/
│       └── pengaturan/page.tsx
```

---

## Arsitektur Komponen UI (`components/`)

Komponen dibagi secara hierarkis untuk menjamin reusability tanpa mengotori domain bisnis:

```text
components/
├── common/                      # Reusable Complex Components
│   ├── DataTable.tsx            # Generic typed table (sorting, pagination, loading)
│   ├── EmptyState.tsx           # Card ilustrasi data kosong
│   ├── BackButton.tsx           # Tombol kembali dengan context-aware routing
│   └── MultiSelect.tsx          # Tag multi-select dropdown
│
├── ui/                          # Atomic Primitives
│   ├── Badge.tsx                # Status chips (variants: primary, warning, error, muted)
│   ├── Avatar.tsx               # Avatar gambar dengan inisial fallback
│   ├── Select.tsx               # Custom accessible dropdown
│   ├── Modal.tsx                # Base modal popup
│   ├── ConfirmationModal.tsx    # Modal konfirmasi aksi destruktif
│   ├── Toast.tsx                # Flash notification system
│   │
│   └── loading/                 # Skeleton Loaders (Content-Shaped Skeletons)
│       ├── Skeleton.tsx         # Atomic animated skeleton blocks
│       ├── FormSkeleton.tsx     # Skeleton untuk formulir input
│       ├── FormLoader.tsx       # Full card skeleton form loader
│       └── DetailPageLoader.tsx # Skeleton halaman detail & analitik
│
├── layout/                      # Navigation Shells
│   ├── HeaderNavbar.tsx         # Top bar dengan info profil & trigger sidebar mobile
│   └── SidebarNavbar.tsx        # Navigation drawer (responsive mobile off-canvas + desktop)
│
└── dashboard/                   # Dashboard Widgets
    └── StatisticCard.tsx        # Bento-style KPI statistics card
```

---

## Arsitektur Fitur & State (`features/` & `hooks/`)

DSMES Web menganut pola **Feature-Sliced Architecture**. Logika bisnis, manipulasi data, dan komponen yang hanya dipakai dalam satu domain diletakkan di dalam folder `features/<domain>/`:

```text
features/record-monitoring/
├── components/                  # Komponen spesifik pemantauan catatan
│   ├── RecordMonitoringFeature.tsx
│   ├── RecordMonitoringTable.tsx
│   ├── RecordMonitoringFilters.tsx
│   ├── BloodSugarHistoryCard.tsx
│   ├── MealHistoryCard.tsx
│   └── ActivityHistoryCard.tsx
├── hooks/
│   ├── useRecordMonitoring.ts   # State filtering, debouncing, & pagination
│   └── useRecordDetail.ts       # Fetch detail riwayat per pasien
├── services/
│   └── recordMonitoringService.ts # API calls & data normalization
└── types/
    └── record.ts                # TypeScript interfaces khusus record
```

### Aturan Domain & Single Source of Truth
* **Kepatuhan (Compliance):** Kepatuhan dihitung dari backend dan dibagi menjadi 3 level:
  - `≥ 70%`: **Patuh** (`Badge variant="primary"`)
  - `40% - 69%`: **Kurang Patuh** (`Badge variant="warning"`)
  - `< 40%`: **Tidak Patuh** (`Badge variant="error"`)
* **Normalisasi Data:** Seluruh mapping enum API dilakukan pada file service layer agar komponen view hanya menerima data siap saji.

---

## Integrasi REST API (`services/` & `lib/axios.ts`)

Panggilan HTTP dilakukan via instance Axios terpusat di `lib/axios.ts`:
* Menginjeksikan header `Authorization: Bearer <token>` secara otomatis dari Zustand storage/cookie.
* Interceptor otomatis menangani error status `401 Unauthorized` dengan membersihkan session dan mengarahkan pengguna kembali ke `/login`.
* Base URL dikendalikan melalui environment variable:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
  ```

---

## Konfigurasi Docker & Containerisasi

DSMES Web dikemas menggunakan teknik **Multi-stage Build** pada `Dockerfile` untuk memproduksi image yang ramping (menggunakan mode Next.js `output: 'standalone'`):

### 1. Tahapan Build (`Dockerfile`)
* **Stage 1 (`builder`):** Menggunakan `node:22-alpine`, meng-install dependency melalui `npm ci`, menginjeksi build argument `NEXT_PUBLIC_API_URL`, dan menjalankan `npm run build`.
* **Stage 2 (`runner`):** Menggunakan base image `node:22-alpine` bersih, menyalin direktori `.next/standalone`, `.next/static`, dan `public`. Menjalankan aplikasi dengan user non-root `nextjs:nodejs` di port `3000`.

### 2. Menjalankan Docker Lokal
```bash
# Build image web standalone
docker build -t dsmes-web:latest --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1 .

# Jalankan container
docker run -p 3000:3000 --name dsmes-web dsmes-web:latest
```

---

## Konfigurasi CI/CD Pipeline (GitHub Actions)

File workflow terletak di `.github/workflows/ci.yml`. Pipeline berjalan otomatis pada event `push` dan `pull_request` ke branch `main` dan `develop`:

1. **Job `lint`:** Menjalankan ESLint (`npm run lint`) untuk menjaga konsistensi gaya kode.
2. **Job `build`:**
   - Memeriksa error tipe TypeScript (`tsc`).
   - Melakukan kompilasi Next.js production build (`npm run build`).
   - Melakukan validasi URL API produksi pada branch `main`.
3. **Job `docker` (Branch `main`):** Membangun Docker Image production dan mempublikasikan ke container registry bila seluruh pengujian lulus.

---

## Instalasi Lokal & Skrip Verifikasi

### Prasyarat
* Node.js `20.x` atau `22.x`
* npm `10.x`
* Layanan backend `dsmes-backend` aktif di port `8080`

### Menjalankan Development Server
```bash
# 1. Masuk ke folder web
cd dsmes-web

# 2. Pasang dependencies
npm install

# 3. Jalankan server lokal dengan Turbopack
npm run dev
```
Akses di browser pada: `http://localhost:3000`

### Menjalankan Uji Mutu & Verifikasi Kode
Sebelum melakukan commit atau pull request, pastikan seluruh baris perintah verifikasi berikut berhasil tanpa peringatan:
```bash
# Cek linting
npm run lint

# Cek tipe TypeScript
npx tsc --noEmit

# Cek kompilasi production build
npm run build
```
