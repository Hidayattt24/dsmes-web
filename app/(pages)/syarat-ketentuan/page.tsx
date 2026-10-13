import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | DIBA",
  description:
    "Syarat dan Ketentuan Penggunaan Diabetes Behaviour & Adherence Application (DIBA) - Batasan tanggung jawab, etika riset, dan hak cipta.",
};

export default function SyaratKetentuanPage() {
  const sections = [
    { id: "tentang-diba", title: "1. Tentang DIBA" },
    { id: "bukan-dokter", title: "2. Bukan Pengganti Tenaga Kesehatan" },
    { id: "akun", title: "3. Akun Pengguna" },
    { id: "keakuratan", title: "4. Keakuratan Data" },
    { id: "penelitian", title: "5. Penggunaan untuk Penelitian" },
    { id: "penelitian-lanjut", title: "6. Penelitian Lanjutan & Pengembangan Teknologi" },
    { id: "ai-ml", title: "7. Artificial Intelligence dan Machine Learning" },
    { id: "ketersediaan", title: "8. Ketersediaan Layanan" },
    { id: "keamanan", title: "9. Keamanan Akun dan Sistem" },
    { id: "haki", title: "10. Hak Kekayaan Intelektual" },
    { id: "larangan", title: "11. Larangan Penggunaan" },
    { id: "batasan-tanggung-jawab", title: "12. Batasan Tanggung Jawab" },
    { id: "penghentian", title: "13. Penghentian atau Pembatasan Akses" },
    { id: "perubahan", title: "14. Perubahan Syarat dan Ketentuan" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A202C] font-[family-name:var(--font-poppins)]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo DIBA"
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            <span className="hidden sm:inline-block h-5 w-px bg-[#CBD5E1]" />
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E6F2F1] text-[#00695C]">
              Dokumen Hukum & Riset
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.KEBIJAKAN_PRIVASI}
              className="text-xs sm:text-sm font-semibold text-[#718096] hover:text-[#00695C] transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              ← Kebijakan Privasi
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold bg-[#00695C] text-white hover:bg-[#005247] transition-all px-4 py-2 rounded-xl shadow-sm cursor-pointer"
            >
              Masuk Sistem
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Title & Document Badge */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-sm">gavel</span>
            Terakhir diperbarui: 05-Oktober-2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A202C] tracking-tight mb-3">
            Syarat & Ketentuan DIBA
          </h1>
          <p className="text-sm sm:text-base text-[#718096] leading-relaxed">
            Ketentuan penggunaan Diabetes Behaviour & Adherence Application (DIBA) bagi pasien, tenaga medis, peneliti, dan pengelola fasilitas kesehatan.
          </p>

          {/* Quick Tab Switcher */}
          <div className="inline-flex p-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xs mt-6">
            <Link
              href={ROUTES.KEBIJAKAN_PRIVASI}
              className="px-5 py-2 text-xs sm:text-sm font-medium text-[#718096] hover:text-[#1A202C] transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href={ROUTES.SYARAT_KETENTUAN}
              className="px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-[#00695C] text-white shadow-xs"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>

        {/* Executive Summary Cards for Admin & Staff (To-the-point overview) */}
        <div className="mb-12">
          <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#00695C]">warning</span>
            Prinsip Kunci untuk Pengelola & Tenaga Medis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">medical_information</span>
              </div>
              <h3 className="font-bold text-sm text-[#1A202C] mb-1">Bukan Pengganti Dokter</h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                Aplikasi adalah sarana pendukung edukasi & monitoring mandiri. Pasien dilarang mengubah dosis obat tanpa konsultasi dokter.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00695C] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h3 className="font-bold text-sm text-[#1A202C] mb-1">Informed Consent Terpisah</h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                Persetujuan S&K ini tidak menggantikan informed consent penelitian. Peserta riset tetap melalui persetujuan etik resmi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <h3 className="font-bold text-sm text-[#1A202C] mb-1">Hak Kekayaan Intelektual</h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                Seluruh elemen, materi edukasi, dan sistem aplikasi adalah hak cipta tim pengembang DIBA Aceh dan Universitas Syiah Kuala.
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout with Sidebar Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Left Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#718096] mb-3">
                Pasal Syarat & Ketentuan
              </h3>
              <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-xs py-1.5 px-2.5 rounded-lg text-[#4A5568] hover:text-[#00695C] hover:bg-[#F0FDF4] transition-all font-medium truncate"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>

              <hr className="my-4 border-[#E2E8F0]" />

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 leading-snug">
                <span className="font-bold block mb-1">Perhatian Klinis:</span>
                Kondisi gawat darurat medis memerlukan penanganan langsung di fasilitas pelayanan kesehatan terdekat.
              </div>
            </div>
          </aside>

          {/* Terms Articles (Right Column) */}
          <article className="lg:col-span-8 space-y-6">
            {/* Opening Statement */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs leading-relaxed text-sm text-[#4A5568]">
              <p className="font-bold text-[#1A202C] text-base mb-2">
                Selamat datang di DIBA (Diabetes Behaviour & Adherence Application).
              </p>
              <p className="mb-3">
                Dengan membuat akun atau menggunakan DIBA, Anda menyatakan telah membaca, memahami, dan menyetujui Syarat dan Ketentuan ini.
              </p>
              <p className="font-semibold text-rose-600">
                Apabila Anda tidak menyetujui ketentuan yang berlaku, mohon untuk tidak menggunakan DIBA.
              </p>
            </div>

            {/* Section 1 */}
            <section id="tentang-diba" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">1</span>
                Tentang DIBA
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                DIBA adalah aplikasi digital yang dirancang untuk membantu pengguna dalam pengelolaan Diabetes Melitus Tipe 2 melalui fitur seperti:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-4">
                <li>edukasi kesehatan;</li>
                <li>pencatatan kondisi dan aktivitas kesehatan;</li>
                <li>kuesioner;</li>
                <li>pemantauan perilaku;</li>
                <li>dukungan terhadap kepatuhan pengelolaan diabetes; dan</li>
                <li>fitur digital lainnya yang tersedia dalam aplikasi.</li>
              </ul>
              <p className="text-xs text-[#718096]">
                DIBA dikembangkan sebagai bagian dari kegiatan pengembangan dan penelitian teknologi kesehatan digital.
              </p>
            </section>

            {/* Section 2 - Critical Medical Notice */}
            <section id="bukan-dokter" className="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-rose-700 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-black">2</span>
                Bukan Pengganti Tenaga Kesehatan
              </h2>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-900 leading-relaxed font-medium mb-4">
                DIBA merupakan alat pendukung dan <strong>BUKAN PENGGANTI DOKTER, tenaga kesehatan, diagnosis medis, maupun perawatan medis profesional.</strong>
              </div>
              <p className="text-sm text-[#4A5568] mb-3">
                Informasi yang tersedia dalam aplikasi ditujukan untuk mendukung edukasi dan pengelolaan mandiri. Pengguna tidak boleh menjadikan informasi dari DIBA sebagai satu-satunya dasar untuk:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-4">
                <li>mendiagnosis kondisi kesehatan;</li>
                <li>mengubah dosis atau menghentikan obat;</li>
                <li>memulai pengobatan tertentu; atau</li>
                <li>mengambil keputusan medis yang seharusnya dilakukan bersama tenaga kesehatan.</li>
              </ul>
              <p className="text-sm font-semibold text-[#1A202C]">
                Apabila mengalami kondisi kesehatan yang membutuhkan perhatian medis, pengguna disarankan untuk berkonsultasi dengan tenaga kesehatan.
              </p>
            </section>

            {/* Section 3 */}
            <section id="akun" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">3</span>
                Akun Pengguna
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">Beberapa fitur DIBA memerlukan akun pengguna. Pengguna bertanggung jawab untuk:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-4">
                <li>memberikan informasi yang benar dan akurat;</li>
                <li>menjaga kerahasiaan informasi akun;</li>
                <li>menjaga keamanan kredensial login;</li>
                <li>tidak membagikan akun kepada orang lain; dan</li>
                <li>segera melaporkan penggunaan akun yang tidak sah.</li>
              </ul>
              <p className="text-xs text-[#718096]">
                Pengguna bertanggung jawab atas aktivitas yang dilakukan melalui akun miliknya sepanjang aktivitas tersebut berada dalam kendalinya.
              </p>
            </section>

            {/* Section 4 */}
            <section id="keakuratan" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">4</span>
                Keakuratan Data
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Pengguna bertanggung jawab untuk memasukkan informasi yang benar dan sesuai dengan kondisi sebenarnya. Data seperti kadar gula darah, aktivitas fisik, pola makan, penggunaan obat, berat badan, dan informasi kesehatan lainnya sebaiknya dimasukkan secara akurat agar informasi yang tersimpan dalam aplikasi dapat digunakan secara tepat.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#718096]">
                DIBA tidak bertanggung jawab atas keputusan yang diambil berdasarkan data yang dimasukkan secara tidak benar atau tidak lengkap oleh pengguna.
              </div>
            </section>

            {/* Section 5 */}
            <section id="penelitian" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">5</span>
                Penggunaan untuk Penelitian
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                DIBA dapat digunakan dalam kegiatan penelitian dan evaluasi teknologi kesehatan digital. Data yang dikumpulkan melalui aplikasi dapat digunakan untuk analisis penelitian, evaluasi aplikasi, penyusunan laporan akademik, publikasi ilmiah, serta pengembangan penelitian lanjutan sesuai dengan dasar pemrosesan dan persetujuan yang berlaku.
              </p>
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-[#00695C] font-semibold leading-relaxed">
                Penggunaan DIBA sebagai peserta penelitian dapat memerlukan proses informed consent tersendiri. Persetujuan terhadap Syarat dan Ketentuan ini TIDAK MENGGANTIKAN informed consent penelitian.
              </div>
            </section>

            {/* Section 6 */}
            <section id="penelitian-lanjut" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">6</span>
                Penelitian Lanjutan dan Pengembangan Teknologi
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Data yang diperoleh melalui DIBA dapat berpotensi digunakan untuk penelitian lanjutan yang berkaitan dengan diabetes, kesehatan digital, perilaku kesehatan, kepatuhan, dan pengembangan teknologi kesehatan. Apabila suatu penggunaan data memerlukan persetujuan tambahan berdasarkan tujuan atau ketentuan yang berlaku, proses persetujuan tambahan akan dilakukan sesuai kebutuhan.
              </p>
            </section>

            {/* Section 7 */}
            <section id="ai-ml" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">7</span>
                Artificial Intelligence dan Machine Learning
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                DIBA dapat menggunakan atau mengembangkan teknologi Artificial Intelligence (AI), Machine Learning (ML), atau teknologi analitik lainnya.
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                Penggunaan data untuk pengembangan AI/ML tidak secara otomatis diberikan hanya karena pengguna menggunakan aplikasi. Apabila diperlukan persetujuan tambahan untuk penggunaan data dalam pengembangan atau pelatihan model AI/ML, pengguna akan diberikan informasi dan dimintai persetujuan sesuai dengan ketentuan yang berlaku.
              </div>
            </section>

            {/* Section 8 */}
            <section id="ketersediaan" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">8</span>
                Ketersediaan Layanan
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                Kami berupaya menjaga DIBA agar dapat digunakan dengan baik. Namun, kami tidak menjamin bahwa aplikasi akan:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-3">
                <li>selalu tersedia tanpa gangguan;</li>
                <li>bebas dari kesalahan;</li>
                <li>bebas dari masalah teknis; atau</li>
                <li>tersedia pada setiap waktu.</li>
              </ul>
              <p className="text-xs text-[#718096]">
                Layanan dapat mengalami gangguan sementara karena pemeliharaan, pembaruan, masalah jaringan, kegagalan sistem, atau keadaan lain di luar kendali kami.
              </p>
            </section>

            {/* Section 9 */}
            <section id="keamanan" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">9</span>
                Keamanan Akun dan Sistem
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                Pengguna dilarang melakukan tindakan yang dapat mengganggu keamanan atau operasional DIBA, termasuk:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-3">
                <li>mencoba memperoleh akses tanpa izin;</li>
                <li>mengakses akun pengguna lain;</li>
                <li>melakukan eksploitasi terhadap sistem;</li>
                <li>menyebarkan malware;</li>
                <li>melakukan tindakan yang mengganggu server atau layanan; atau</li>
                <li>menggunakan aplikasi untuk tujuan yang melanggar hukum.</li>
              </ul>
              <p className="text-xs text-[#718096]">
                Kami berhak melakukan tindakan yang diperlukan untuk melindungi keamanan sistem dan pengguna.
              </p>
            </section>

            {/* Section 10 */}
            <section id="haki" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">10</span>
                Hak Kekayaan Intelektual
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Seluruh elemen DIBA, termasuk namun tidak terbatas pada nama dan identitas aplikasi, desain antarmuka, perangkat lunak, struktur sistem, konten edukasi, logo, teks, dan materi lainnya, merupakan milik atau digunakan secara sah oleh pihak yang mengembangkan atau mengelola DIBA, kecuali dinyatakan lain.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#718096]">
                Pengguna tidak diperbolehkan menyalin, memodifikasi, mendistribusikan, menjual, atau menggunakan elemen DIBA untuk tujuan komersial tanpa izin yang sah.
              </div>
            </section>

            {/* Section 11 */}
            <section id="larangan" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">11</span>
                Larangan Penggunaan
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">Pengguna tidak diperbolehkan menggunakan DIBA untuk:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#4A5568]">
                <li>melakukan tindakan yang melanggar hukum;</li>
                <li>memberikan informasi palsu dengan sengaja;</li>
                <li>mengakses data pengguna lain tanpa izin;</li>
                <li>mengganggu keamanan atau operasional sistem;</li>
                <li>melakukan reverse engineering tanpa dasar atau izin yang diperbolehkan;</li>
                <li>menyebarkan konten berbahaya melalui sistem; atau</li>
                <li>menggunakan aplikasi untuk tujuan yang bertentangan dengan fungsi dan ketentuan DIBA.</li>
              </ol>
            </section>

            {/* Section 12 */}
            <section id="batasan-tanggung-jawab" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">12</span>
                Batasan Tanggung Jawab
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                DIBA disediakan sebagai sarana pendukung edukasi, pencatatan, dan pengelolaan mandiri. Kami tidak bertanggung jawab atas keputusan medis yang dibuat pengguna secara mandiri berdasarkan informasi dalam aplikasi tanpa konsultasi dengan tenaga kesehatan.
              </p>
              <p className="text-sm text-[#4A5568] font-semibold mb-2">Kami juga tidak bertanggung jawab atas kerugian yang timbul akibat:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-4">
                <li>data yang dimasukkan pengguna secara tidak benar;</li>
                <li>penggunaan aplikasi yang tidak sesuai ketentuan;</li>
                <li>gangguan perangkat atau jaringan pengguna;</li>
                <li>akses akun oleh pihak yang memperoleh kredensial pengguna; atau</li>
                <li>kondisi lain yang berada di luar kendali pengelola DIBA,</li>
              </ul>
              <p className="text-xs text-[#718096]">
                sejauh diperbolehkan oleh ketentuan hukum yang berlaku.
              </p>
            </section>

            {/* Section 13 & 14 */}
            <section id="penghentian" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">13</span>
                Penghentian atau Pembatasan Akses
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
                Kami dapat membatasi atau menghentikan akses pengguna terhadap DIBA apabila terdapat pelanggaran terhadap Syarat dan Ketentuan, aktivitas yang mengancam keamanan sistem, penggunaan yang melanggar hukum, atau alasan teknis maupun operasional yang diperlukan untuk melindungi sistem dan pengguna.
              </p>

              <h2 id="perubahan" className="text-lg font-bold text-[#1A202C] mb-3 flex items-center gap-2 pt-4 border-t border-[#E2E8F0]">
                <span className="w-7 h-7 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-black">14</span>
                Perubahan Syarat dan Ketentuan
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-4">
                Syarat dan Ketentuan ini dapat diperbarui dari waktu ke waktu untuk menyesuaikan dengan perubahan fitur DIBA, perkembangan penelitian, teknologi, layanan, atau regulasi hukum. Perubahan penting akan diinformasikan melalui aplikasi atau media komunikasi yang sesuai.
              </p>
              <p className="text-xs text-[#718096]">
                Dengan tetap menggunakan DIBA setelah perubahan berlaku, pengguna dianggap telah membaca dan memahami ketentuan yang diperbarui.
              </p>
            </section>

            {/* Acceptance Callout Box */}
            <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#00695C]/30 shadow-xs">
              <h3 className="font-bold text-[#00695C] text-sm flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-base">task_alt</span>
                Pernyataan Persetujuan
              </h3>
              <p className="text-xs sm:text-sm text-[#1A202C] leading-relaxed">
                Dengan menggunakan DIBA, pengguna menyatakan bahwa pengguna telah membaca, memahami, dan menyetujui Syarat dan Ketentuan ini.
                <br /><br />
                <strong>Penggunaan DIBA untuk kegiatan penelitian tetap mengikuti prosedur informed consent dan ketentuan etika penelitian yang berlaku.</strong>
              </p>
            </div>
          </article>
        </div>

        {/* Global Scientific and Open Source References */}
        <section className="mt-16 pt-8 border-t border-[#E2E8F0]">
          <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#00695C]">menu_book</span>
            Kredit Dataset & Pedoman Klinis Resmi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0]">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-[#00695C] mb-2">
                Pedoman Klinis Nasional
              </span>
              <h3 className="font-bold text-sm text-[#1A202C]">PB PERKENI (PGDM 2021)</h3>
              <p className="text-xs text-[#718096] mt-1 mb-3">
                Pedoman Pemantauan Glukosa Darah Mandiri sebagai standar rentang acuan target glukosa darah.
              </p>
              <a
                href="https://pbperkeni.or.id/wp-content/uploads/2021/11/22-10-21-Website-Pedoman-Pemantauan-Glukosa-Darah-Mandiri-Ebook.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#00695C] hover:underline inline-flex items-center gap-1"
              >
                Lihat E-book Pedoman PERKENI ↗
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0]">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 mb-2">
                Pedoman Klinis Internasional
              </span>
              <h3 className="font-bold text-sm text-[#1A202C]">ADA (American Diabetes Association)</h3>
              <p className="text-xs text-[#718096] mt-1 mb-3">
                Standards of Care in Diabetes: Kriteria Diagnosis dan Pengujian Glukosa Darah terkini.
              </p>
              <a
                href="https://diabetes.org/about-diabetes/diagnosis"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#00695C] hover:underline inline-flex items-center gap-1"
              >
                Kriteria Diagnosis ADA ↗
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0]">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 mb-2">
                Dataset Gizi Terbuka
              </span>
              <h3 className="font-bold text-sm text-[#1A202C]">Informasi Nilai Gizi Indonesia (Kaggle)</h3>
              <p className="text-xs text-[#718096] mt-1 mb-3">
                Kompilasi dataset nutrisi pangan Indonesia oleh Fritz E. untuk pendukung perhitungan kalori.
              </p>
              <a
                href="https://www.kaggle.com/datasets/fritze/informasi-nilai-gizi-indonesia"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#00695C] hover:underline inline-flex items-center gap-1"
              >
                Kaggle Dataset Nutrisi ↗
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0]">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 mb-2">
                Tipografi & Antarmuka
              </span>
              <h3 className="font-bold text-sm text-[#1A202C]">Poppins & Plus Jakarta Sans</h3>
              <p className="text-xs text-[#718096] mt-1 mb-3">
                Font berlisensi terbuka SIL Open Font License yang didistribusikan melalui Google Fonts.
              </p>
              <span className="text-xs font-semibold text-slate-500">
                Google Fonts Open License
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-[#A0AEC0] border-t border-[#E2E8F0] pt-6">
          <p>© 2026 DIBA Project (Diabetes Behaviour & Adherence Application). Seluruh hak cipta dilindungi.</p>
        </footer>
      </main>
    </div>
  );
}
