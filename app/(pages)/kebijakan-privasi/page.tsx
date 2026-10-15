import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | DIBA",
  description:
    "Kebijakan Privasi Diabetes Behaviour & Adherence Application (DIBA) - Pengelolaan data pribadi dan etika penelitian.",
};

export default function KebijakanPrivasiPage() {
  const sections = [
    { id: "data-kumpul", title: "1. Data yang Kami Kumpulkan" },
    { id: "tujuan-guna", title: "2. Tujuan Penggunaan Data" },
    { id: "penelitian", title: "3. Penggunaan Data untuk Penelitian" },
    { id: "penelitian-lanjut", title: "4. Penelitian & Pengembangan Masa Mendatang" },
    { id: "ai-ml", title: "5. Penggunaan Data untuk AI & Machine Learning" },
    { id: "tidak-diizinkan", title: "6. Penggunaan Data yang Tidak Diizinkan" },
    { id: "akses-data", title: "7. Akses terhadap Data" },
    { id: "keamanan", title: "8. Keamanan Data" },
    { id: "retensi", title: "9. Penyimpanan dan Retensi Data" },
    { id: "hak-pengguna", title: "10. Hak Pengguna" },
    { id: "pihak-ketiga", title: "11. Penyedia Layanan dan Pihak Ketiga" },
    { id: "perubahan", title: "12. Perubahan Kebijakan Privasi" },
    { id: "kontak", title: "13. Hubungi Kami" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A202C] font-[family-name:var(--font-poppins)]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-diba-care.png"
                alt="Logo DIBA"
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            <span className="hidden sm:inline-block h-5 w-px bg-[#CBD5E1]" />
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F0FF] text-[#3B67FC]">
              Dokumen Hukum & Riset
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.SYARAT_KETENTUAN}
              className="text-xs sm:text-sm font-semibold text-[#718096] hover:text-[#3B67FC] transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Syarat & Ketentuan →
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold bg-[#3B67FC] text-white hover:bg-[#1A63ED] transition-all px-4 py-2 rounded-xl shadow-sm cursor-pointer"
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F0FF] text-[#3B67FC] text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Terakhir diperbarui: 05-Oktober-2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A202C] tracking-tight mb-3">
            Kebijakan Privasi DIBA
          </h1>
          <p className="text-sm sm:text-base text-[#718096] leading-relaxed">
            Diabetes Behaviour & Adherence Application (DIBA) — Transparansi perlindungan data kesehatan, privasi pasien, dan kepatuhan etika riset digital.
          </p>

          {/* Quick Tab Switcher */}
          <div className="inline-flex p-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xs mt-6">
            <Link
              href={ROUTES.KEBIJAKAN_PRIVASI}
              className="px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-[#3B67FC] text-white shadow-xs"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href={ROUTES.SYARAT_KETENTUAN}
              className="px-5 py-2 text-xs sm:text-sm font-medium text-[#718096] hover:text-[#1A202C] transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>

        {/* Executive Summary Cards for Admin & Staff (To-the-point overview) */}
        <div className="mb-12">
          <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#3B67FC]">summarize</span>
            Ringkasan Cepat untuk Pengelola (Admin & Staff)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#3B67FC] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">science</span>
              </div>
              <h3 className="font-bold text-sm text-[#1A202C] mb-1">Konteks Penelitian Akademik</h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                Data digunakan untuk evaluasi kepatuhan dan luaran riset. Publikasi ilmiah wajib dalam bentuk agregat / anonim tanpa membuka identitas pasien.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <h3 className="font-bold text-sm text-[#1A202C] mb-1">Batasan Pelatihan AI/ML</h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                Aplikasi tidak otomatis melatih model AI dari seluruh data pengguna. Pelatihan model memerlukan de-identifikasi dan persetujuan khusus bila diperlukan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <h3 className="font-bold text-sm text-[#1A202C] mb-1">Prinsip Need-to-Know & Keamanan</h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                Akses data dibatasi ketat berdasarkan wewenang staff. Data kesehatan tidak pernah diperjualbelikan kepada pihak komersial mana pun.
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
                Daftar Isi Kebijakan
              </h3>
              <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-xs py-1.5 px-2.5 rounded-lg text-[#4A5568] hover:text-[#3B67FC] hover:bg-[#F0FDF4] transition-all font-medium truncate"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>

              <hr className="my-4 border-[#E2E8F0]" />

              <div className="p-3 rounded-xl bg-[#EEF2FF] border border-[#3B67FC]/20 text-[11px] text-[#3B67FC] leading-snug">
                <span className="font-bold block mb-1">Pemberitahuan Etika:</span>
                Kebijakan ini tidak menggantikan lembar persetujuan (informed consent) etik penelitian klinis.
              </div>
            </div>
          </aside>

          {/* Policy Full Articles (Right Column) */}
          <article className="lg:col-span-8 space-y-6">
            {/* Opening Statement */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs leading-relaxed text-sm text-[#4A5568]">
              <p className="font-bold text-[#1A202C] text-base mb-2">
                Selamat datang di DIBA (Diabetes Behaviour & Adherence Application).
              </p>
              <p className="mb-3">
                DIBA adalah aplikasi digital yang dikembangkan untuk membantu pengguna dalam mendukung pengelolaan mandiri Diabetes Melitus Tipe 2 melalui edukasi, pencatatan kesehatan, kuesioner, serta pemantauan perilaku dan kepatuhan terhadap pengelolaan diabetes.
              </p>
              <p>
                DIBA juga dikembangkan dalam konteks penelitian dan pengembangan teknologi kesehatan digital. Kami memahami bahwa data kesehatan merupakan informasi pribadi yang sensitif. Oleh karena itu, kami berkomitmen untuk mengelola data pengguna secara bertanggung jawab, aman, dan sesuai dengan tujuan pemrosesan serta ketentuan yang berlaku.
              </p>
            </div>

            {/* Section 1 */}
            <section id="data-kumpul" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">1</span>
                Data yang Kami Kumpulkan
              </h2>
              <p className="text-sm text-[#4A5568] mb-4">
                Untuk menjalankan fitur dan mendukung kegiatan penelitian, DIBA dapat memproses beberapa jenis data:
              </p>

              <div className="space-y-4 text-sm text-[#4A5568]">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-[#1A202C] mb-2">A. Data Identitas dan Akun</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#4A5568]">
                    <li>Nama;</li>
                    <li>Alamat email;</li>
                    <li>Nomor telepon, apabila diperlukan;</li>
                    <li>Informasi demografis yang relevan;</li>
                    <li>Informasi autentikasi akun; dan</li>
                    <li>Informasi lain yang diberikan pengguna saat menggunakan aplikasi.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-[#1A202C] mb-2">B. Data Kesehatan</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#4A5568]">
                    <li>Catatan kadar gula darah;</li>
                    <li>Aktivitas fisik;</li>
                    <li>Pola makan;</li>
                    <li>Penggunaan obat;</li>
                    <li>Berat badan dan indeks massa tubuh (BMI);</li>
                    <li>Hasil kuesioner;</li>
                    <li>Informasi terkait perilaku pengelolaan diabetes;</li>
                    <li>Informasi kepatuhan terhadap pengobatan atau aktivitas pengelolaan diabetes; dan</li>
                    <li>Informasi kesehatan lain yang diberikan secara sukarela melalui aplikasi.</li>
                  </ul>
                  <div className="mt-3 p-3 rounded-lg bg-[#EEF2FF] border border-[#8FAAFF] text-xs text-[#3B67FC] font-medium">
                    Data dan informasi kesehatan merupakan data pribadi yang bersifat spesifik sehingga akan dikelola dengan perhatian khusus terhadap keamanan dan privasinya.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-[#1A202C] mb-2">C. Data Aktivitas dan Penggunaan Aplikasi</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#4A5568]">
                    <li>Waktu dan frekuensi penggunaan;</li>
                    <li>Fitur yang digunakan;</li>
                    <li>Aktivitas pada aplikasi;</li>
                    <li>Penyelesaian materi edukasi;</li>
                    <li>Pengisian kuesioner; dan</li>
                    <li>Informasi teknis yang diperlukan untuk menjaga keamanan dan pengoperasian aplikasi.</li>
                  </ul>
                  <p className="mt-2 text-xs text-[#718096]">
                    Data penggunaan tersebut dapat digunakan untuk memahami penggunaan aplikasi, termasuk tingkat penggunaan, kepatuhan, penyelesaian aktivitas, dan pengalaman pengguna.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="tujuan-guna" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">2</span>
                Tujuan Penggunaan Data
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">Data pengguna dapat digunakan untuk:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#4A5568]">
                <li>Membuat dan mengelola akun pengguna;</li>
                <li>Menyediakan fitur dan layanan DIBA;</li>
                <li>Menyediakan edukasi dan dukungan pengelolaan mandiri diabetes;</li>
                <li>Menyimpan dan menampilkan catatan kesehatan yang dimasukkan pengguna;</li>
                <li>Mendukung pemantauan perilaku dan kepatuhan dalam pengelolaan diabetes;</li>
                <li>Mengevaluasi usability, acceptability, feasibility, dan pengalaman pengguna;</li>
                <li>Melakukan analisis dan evaluasi penelitian;</li>
                <li>Menyusun laporan dan publikasi ilmiah;</li>
                <li>Mendukung penelitian dan pengembangan DIBA di masa mendatang; dan</li>
                <li>Menjaga keamanan, stabilitas, dan kualitas sistem.</li>
              </ol>
              <p className="mt-4 text-xs italic text-[#718096]">
                Data hanya akan diproses sesuai dengan tujuan yang telah diinformasikan kepada pengguna dan dasar pemrosesan yang berlaku.
              </p>
            </section>

            {/* Section 3 */}
            <section id="penelitian" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">3</span>
                Penggunaan Data untuk Penelitian
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                DIBA dikembangkan dalam konteks penelitian mengenai pemanfaatan teknologi digital untuk mendukung pengelolaan Diabetes Melitus Tipe 2. Data yang dikumpulkan melalui DIBA dapat digunakan dalam analisis penelitian, termasuk data kuesioner, aktivitas penggunaan aplikasi, catatan kesehatan, dan informasi lain yang relevan dengan penelitian.
              </p>
              <p className="text-sm text-[#4A5568] font-semibold mb-2">Hasil penelitian dapat digunakan untuk:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-4">
                <li>Laporan penelitian;</li>
                <li>Tugas akhir atau karya akademik;</li>
                <li>Publikasi jurnal;</li>
                <li>Presentasi ilmiah;</li>
                <li>Pengembangan aplikasi; dan</li>
                <li>Kegiatan akademik atau penelitian lainnya yang relevan.</li>
              </ul>
              <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#8FAAFF] text-xs text-[#3B67FC] font-medium leading-relaxed">
                Dalam publikasi atau penyampaian hasil penelitian, data akan diupayakan dalam bentuk agregat, anonim, atau melalui proses lain yang sesuai sehingga identitas pengguna tidak diungkapkan secara langsung.
              </div>
            </section>

            {/* Section 4 */}
            <section id="penelitian-lanjut" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">4</span>
                Penelitian dan Pengembangan di Masa Mendatang
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                Data yang diperoleh melalui DIBA dapat berpotensi digunakan untuk penelitian lanjutan yang masih berkaitan dengan pengelolaan diabetes, kesehatan digital, perilaku kesehatan, kepatuhan, maupun evaluasi dan pengembangan DIBA. Penelitian lanjutan dapat mencakup:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#4A5568] mb-4">
                <li>Evaluasi efektivitas aplikasi;</li>
                <li>Penelitian dengan jumlah pengguna yang lebih besar;</li>
                <li>Analisis perilaku dan kepatuhan;</li>
                <li>Analisis dampak kesehatan, sosial, atau ekonomi;</li>
                <li>Pengembangan fitur kesehatan digital; dan</li>
                <li>Evaluasi teknologi pendukung pengelolaan diabetes.</li>
              </ul>
              <p className="text-xs text-[#718096]">
                Apabila terdapat penggunaan data untuk tujuan baru yang memerlukan dasar pemrosesan atau persetujuan tambahan, pengguna akan diberikan informasi dan/atau dimintai persetujuan sesuai dengan ketentuan yang berlaku.
              </p>
            </section>

            {/* Section 5 */}
            <section id="ai-ml" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">5</span>
                Penggunaan Data untuk AI dan Machine Learning
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                DIBA dapat menggunakan atau mengembangkan teknologi <strong>Artificial Intelligence (AI), Machine Learning (ML), atau teknologi analitik lainnya</strong> di masa mendatang. Data pengguna dapat dipertimbangkan untuk digunakan dalam penelitian & pengembangan model AI/ML, evaluasi performa model, pengembangan sistem prediksi, maupun sistem rekomendasi.
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed mb-3">
                <strong>Ketentuan Penting:</strong> Penggunaan aplikasi DIBA tidak secara otomatis berarti bahwa seluruh data pengguna dapat digunakan untuk melatih model AI. Apabila penggunaan data untuk pengembangan atau pelatihan AI menjadi tujuan baru yang memerlukan persetujuan tambahan, pengguna akan diberikan informasi yang relevan dan persetujuan tambahan akan diperoleh apabila diperlukan.
              </div>
              <p className="text-xs text-[#718096]">
                Sedapat mungkin, data yang digunakan untuk pengembangan AI/ML akan melalui proses de-identifikasi atau pseudonimisasi, dan hanya data yang relevan dengan tujuan pengembangan yang akan digunakan.
              </p>
            </section>

            {/* Section 6 */}
            <section id="tidak-diizinkan" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">6</span>
                Penggunaan Data yang Tidak Diizinkan
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Data pengguna tidak akan digunakan untuk tujuan yang tidak berkaitan dengan fungsi aplikasi atau tujuan penelitian yang telah diinformasikan tanpa dasar pemrosesan yang sah. <strong>DIBA juga tidak menjual data kesehatan pengguna kepada pihak lain.</strong>
              </p>
            </section>

            {/* Section 7 */}
            <section id="akses-data" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">7</span>
                Akses terhadap Data
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Akses terhadap data dibatasi berdasarkan kebutuhan dan kewenangan. Data dapat diakses oleh pihak yang berwenang dalam pengelolaan DIBA, pelaksanaan penelitian, pengembangan sistem, atau penyediaan layanan teknis yang diperlukan. Akses diberikan berdasarkan prinsip <strong>need-to-know</strong>, yaitu hanya pihak yang membutuhkan data untuk menjalankan tanggung jawabnya yang dapat memperoleh akses sesuai kewenangannya.
              </p>
            </section>

            {/* Section 8 */}
            <section id="keamanan" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">8</span>
                Keamanan Data
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                Kami menerapkan langkah-langkah teknis dan organisasi yang wajar untuk menjaga data pengguna dari akses tidak sah, kehilangan, penyalahgunaan, perubahan, pengungkapan, maupun penghancuran yang tidak sah.
              </p>
              <p className="text-xs text-[#718096] leading-relaxed">
                Meskipun demikian, tidak ada sistem elektronik yang dapat menjamin keamanan secara mutlak. Apabila terjadi insiden keamanan yang memenuhi ketentuan pemberitahuan berdasarkan peraturan yang berlaku, tindakan penanganan dan pemberitahuan akan dilakukan sesuai ketentuan tersebut.
              </p>
            </section>

            {/* Section 9 */}
            <section id="retensi" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">9</span>
                Penyimpanan dan Retensi Data
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Data pengguna dapat disimpan selama diperlukan untuk menyediakan layanan DIBA, menjalankan dan mengevaluasi penelitian, mendukung pengembangan aplikasi, memenuhi kewajiban hukum dan administratif, serta menjaga integritas dan validitas hasil penelitian.
              </p>
              <p className="text-xs text-[#718096]">
                Setelah data tidak lagi diperlukan, data dapat dihapus, dimusnahkan, atau dianonimkan sesuai kebutuhan dan ketentuan yang berlaku.
              </p>
            </section>

            {/* Section 10 */}
            <section id="hak-pengguna" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">10</span>
                Hak Pengguna
              </h2>
              <p className="text-sm text-[#4A5568] mb-3">
                Pengguna memiliki hak atas data pribadinya, termasuk hak untuk memperoleh informasi pemrosesan, memperbaiki data yang tidak akurat, memperoleh akses data, serta meminta penghapusan data dalam kondisi yang diperbolehkan hukum.
              </p>
              <p className="text-xs text-[#718096] leading-relaxed">
                Permintaan terkait data pribadi dapat disampaikan melalui kontak resmi DIBA. Dalam konteks penelitian, terdapat kondisi tertentu di mana data mungkin tetap perlu dipertahankan untuk kepentingan audit penelitian, kewajiban hukum, atau menjaga integritas hasil penelitian.
              </p>
            </section>

            {/* Section 11 */}
            <section id="pihak-ketiga" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">11</span>
                Penyedia Layanan dan Pihak Ketiga
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Untuk menjalankan DIBA, kami dapat menggunakan penyedia layanan teknologi seperti server dan infrastruktur cloud, penyimpanan basis data, layanan notifikasi (FCM), serta layanan autentikasi. Pihak ketiga hanya diberikan akses sejauh diperlukan untuk menjalankan layanan dan sesuai dengan kewenangan yang diberikan.
              </p>
            </section>

            {/* Section 12 & 13 */}
            <section id="perubahan" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs scroll-mt-24">
              <h2 className="text-lg font-bold text-[#1A202C] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">12</span>
                Perubahan Kebijakan Privasi
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
                Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu untuk menyesuaikan dengan perubahan fitur DIBA, perkembangan penelitian, teknologi, atau regulasi hukum. Perubahan penting akan diinformasikan melalui aplikasi atau media komunikasi yang sesuai.
              </p>

              <h2 id="kontak" className="text-lg font-bold text-[#1A202C] mb-3 flex items-center gap-2 pt-4 border-t border-[#E2E8F0]">
                <span className="w-7 h-7 rounded-lg bg-[#3B67FC] text-white flex items-center justify-center text-xs font-black">13</span>
                Hubungi Kami
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Apabila Anda memiliki pertanyaan mengenai Kebijakan Privasi, penggunaan data, atau perlindungan data pribadi, silakan hubungi tim pengembang DIBA melalui Pusat Bantuan atau kontak resmi institusi penelitian terkait.
              </p>
            </section>

            {/* Research Ethics Callout Box */}
            <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#3B67FC]/30 shadow-xs">
              <h3 className="font-bold text-[#3B67FC] text-sm flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-base">verified</span>
                Pemberitahuan Etika Penelitian
              </h3>
              <p className="text-xs sm:text-sm text-[#1A202C] leading-relaxed">
                Dengan menggunakan DIBA, pengguna menyatakan telah membaca dan memahami Kebijakan Privasi ini.
                <br /><br />
                <strong>Kebijakan Privasi ini tidak menggantikan informed consent penelitian.</strong> Apabila pengguna diikutsertakan sebagai peserta penelitian, proses persetujuan penelitian akan dilakukan sesuai dengan prosedur dan ketentuan etika penelitian yang berlaku.
              </p>
            </div>
          </article>
        </div>

        {/* Global Scientific and Open Source References */}
        <section className="mt-16 pt-8 border-t border-[#E2E8F0]">
          <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#3B67FC]">menu_book</span>
            Kredit Dataset & Pedoman Klinis Resmi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0]">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#EEF2FF] text-[#3B67FC] mb-2">
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
                className="text-xs font-bold text-[#3B67FC] hover:underline inline-flex items-center gap-1"
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
                className="text-xs font-bold text-[#3B67FC] hover:underline inline-flex items-center gap-1"
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
                className="text-xs font-bold text-[#3B67FC] hover:underline inline-flex items-center gap-1"
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
