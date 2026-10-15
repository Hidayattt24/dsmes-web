import type { QuestionnaireRecord, PaginationMeta } from "../types/quiz";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface QuizTableProps {
  readonly quizzes: readonly QuestionnaireRecord[];
  readonly pagination: PaginationMeta;
  readonly onDeleteClick: (id: string) => void;
  readonly onPageChange: (page: number) => void;
  readonly onToggleStatusClick?: (quiz: QuestionnaireRecord) => void;
  readonly onPairClick?: (quiz: QuestionnaireRecord) => void;
}

export function QuizTable({
  quizzes,
  pagination,
  onDeleteClick,
  onPageChange,
  onToggleStatusClick,
  onPairClick,
}: QuizTableProps) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");

  const handlePrevPage = () => {
    if (pagination.page > 1) onPageChange(pagination.page - 1);
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.total_pages) onPageChange(pagination.page + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden font-[family-name:var(--font-poppins)]">
      {/* Table Header */}
      <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
        <div>
          <h3 className="text-base font-bold text-[#1A202C]">Daftar Kuesioner</h3>
          <p className="text-xs text-[#718096]">Pasangkan pengukuran sebelum dan sesudah berdasarkan ranah</p>
        </div>
        <span className="text-xs font-semibold text-[#3B67FC] bg-[#EEF2FF] px-3 py-1.5 rounded-full border border-[#3B67FC]/15">
          Total: {pagination.total} Kuesioner
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-white text-xs font-bold text-[#718096] uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">Nama Kuesioner</th>
              <th className="py-4 px-6 font-semibold">Ranah</th>
              <th className="py-4 px-6 font-semibold">Tahap</th>
              <th className="py-4 px-6 font-semibold">Relasi / Materi</th>
              <th className="py-4 px-6 font-semibold">Pasangan</th>
              <th className="py-4 px-6 font-semibold text-center">Soal</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-[#1A202C] divide-y divide-[#E2E8F0]/60">
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 px-6 text-center text-[#718096]">
                  Tidak ada kuesioner ditemukan.
                </td>
              </tr>
            ) : (
              quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Nama */}
                  <td className="py-4 px-6 font-semibold text-[#3B67FC] hover:underline">
                    <Link href={isStaff ? `/staff/manajemen-kuisioner/${quiz.id}` : `${ROUTES.MANAJEMEN_KUISIONER}/${quiz.id}`}>
                      {quiz.title}
                    </Link>
                  </td>

                  {/* Scope */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 font-bold text-[#1A202C]">
                      <span className="material-symbols-outlined text-[18px] text-[#3B67FC]">
                        {quiz.scope === "EDUCATION" ? "menu_book" : "monitor_heart"}
                      </span>
                      {quiz.scope === "EDUCATION" ? "Edukasi" : "Aplikasi"}
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="py-4 px-6">
                    <span
                      className={[
                        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wide",
                        quiz.type === "PRE_TEST"
                          ? "bg-[#EEF2FF] text-[#3B67FC] border-[#3B67FC]/20"
                          : "bg-[#EEF2FF] text-[#001B6B] border-[#8FAAFF]",
                      ].join(" ")}
                    >
                      {quiz.type === "PRE_TEST" ? "Pre-Test" : "Post-Test"}
                    </span>
                  </td>

                  {/* Relation / Material */}
                  <td className="py-4 px-6 text-[#718096] font-medium">
                    {quiz.scope === "EDUCATION" ? quiz.educationTitle || "Materi belum tersedia" : "Program DIBA"}
                  </td>

                  {/* Pair */}
                  <td className="py-4 px-6 text-xs">
                    {quiz.pairedQuestionnaireId || quiz.sourcePreTestId || quiz.isLinkedToPreTest ? (
                      <div className="max-w-52">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                          <span className="material-symbols-outlined text-[15px]">link</span>
                          Terpasang
                        </span>
                        {quiz.pairedQuestionnaireTitle && (
                          <p className="mt-0.5 truncate text-[10px] text-[#718096]" title={quiz.pairedQuestionnaireTitle}>
                            {quiz.type === "POST_TEST" ? "Pre-Test: " : "Post-Test: "}{quiz.pairedQuestionnaireTitle}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold"><span className="material-symbols-outlined text-[15px]">link_off</span>{quiz.type === "POST_TEST" ? "Belum dipasangkan" : "Belum ada Post-Test"}</span>
                        {quiz.type === "POST_TEST" && !isStaff && onPairClick && <button type="button" onClick={() => onPairClick(quiz)} className="text-[10px] font-bold text-[#3B67FC] hover:underline cursor-pointer">Hubungkan ke Pre-Test</button>}
                      </div>
                    )}
                  </td>

                  {/* Total Soal */}
                  <td className="py-4 px-6 text-center font-semibold">
                    {quiz.questionCount ?? 0}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span
                      className={[
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                        quiz.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : quiz.status === "Nonaktif"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-100 text-[#718096] border-slate-200",
                      ].join(" ")}
                    >
                      {quiz.status}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end items-center gap-1.5 text-[#718096]">
                      {/* Lihat Detail */}
                      <Link
                        href={isStaff ? `/staff/manajemen-kuisioner/${quiz.id}` : `${ROUTES.MANAJEMEN_KUISIONER}/${quiz.id}`}
                        className="p-2 hover:text-[#3B67FC] hover:bg-[#3B67FC]/10 rounded-lg transition-colors flex items-center"
                        title="Lihat Detail & Soal"
                      >
                        <span className="material-symbols-outlined text-[20px] select-none">visibility</span>
                      </Link>

                      {/* Hasil Pasien & Analitik */}
                      <Link
                        href={isStaff ? `/staff/manajemen-kuisioner/${quiz.id}` : `${ROUTES.MANAJEMEN_KUISIONER}/${quiz.id}`}
                        className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                        title="Hasil Pasien & Analitik"
                      >
                        <span className="material-symbols-outlined text-[20px] select-none">analytics</span>
                      </Link>

                      {!isStaff && (
                        <>
                          {/* Status Toggle */}
                          <button
                            type="button"
                            onClick={() => onToggleStatusClick?.(quiz)}
                            className={`p-2 rounded-lg transition-colors flex items-center cursor-pointer ${
                              quiz.status === "Aktif"
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            }`}
                            title={quiz.status === "Aktif" ? "Nonaktifkan Kuesioner" : "Aktifkan Kuesioner"}
                          >
                            <span className="material-symbols-outlined text-[20px] select-none">
                              {quiz.status === "Aktif" ? "toggle_on" : "toggle_off"}
                            </span>
                          </button>

                          {/* Edit */}
                          <Link
                            href={`${ROUTES.MANAJEMEN_KUISIONER}/${quiz.id}/edit`}
                            className="p-2 hover:text-[#B45309] hover:bg-[#B45309]/10 rounded-lg transition-colors flex items-center"
                            title="Edit Kuesioner"
                          >
                            <span className="material-symbols-outlined text-[20px] select-none">edit</span>
                          </Link>

                          {/* Hapus */}
                          <button
                            type="button"
                            onClick={() => onDeleteClick(quiz.id)}
                            className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center cursor-pointer"
                            title="Hapus Kuesioner"
                          >
                            <span className="material-symbols-outlined text-[20px] select-none">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination.total_pages > 1 && (
        <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] text-xs font-semibold text-[#718096]">
          <span>
            Menampilkan {(pagination.page - 1) * pagination.per_page + 1}-
            {Math.min(pagination.page * pagination.per_page, pagination.total)} dari {pagination.total} data
          </span>
          <div className="flex gap-1">
            <button
              onClick={handlePrevPage}
              disabled={pagination.page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#718096] hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm select-none">chevron_left</span>
            </button>
            {Array.from({ length: pagination.total_pages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onPageChange(idx + 1)}
                className={[
                  "w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors cursor-pointer",
                  pagination.page === idx + 1
                    ? "bg-[#3B67FC] text-white"
                    : "border border-[#E2E8F0] text-[#1A202C] hover:bg-slate-100",
                ].join(" ")}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={pagination.page === pagination.total_pages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#718096] hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
