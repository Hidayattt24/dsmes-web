"use client";

import type { QuizParticipant } from "../types/quiz";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useState, useMemo, Fragment } from "react";
import { usePathname } from "next/navigation";

interface ParticipantTableProps {
  readonly quizId: string;
  readonly participants: readonly QuizParticipant[];
  readonly searchQuery: string;
  readonly onSearchChange: (q: string) => void;
  readonly isPreTest?: boolean;
}

interface GroupedParticipant {
  readonly patientId: string;
  readonly patientName: string;
  readonly patientAvatar?: string;
  readonly totalAttempts: number;
  readonly highestScore: number;
  readonly latestScore: number;
  readonly latestPassed: boolean;
  readonly latestCompletionDate: string;
  readonly attempts: readonly QuizParticipant[];
}

function getDmsesCategory(score: number): string {
  if (score <= 40) return "Low Self-Efficacy";
  if (score <= 60) return "Moderate Self-Efficacy";
  if (score <= 80) return "Good Self-Efficacy";
  return "Very High Self-Efficacy";
}

export function ParticipantTable({
  quizId,
  participants,
  searchQuery,
  onSearchChange,
  isPreTest = false,
}: ParticipantTableProps) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedUserIds, setExpandedUserIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 8;

  // Group participants by patientId
  const groupedParticipants = useMemo(() => {
    const map = new Map<string, QuizParticipant[]>();
    for (const p of participants) {
      const key = p.patientId || p.patientName;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(p);
    }

    const groups: GroupedParticipant[] = [];
    map.forEach((userAttempts, key) => {
      // Sort attempts descending by completion date / order
      const sortedAttempts = [...userAttempts].sort((a, b) => 
        new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
      );

      const latest = sortedAttempts[0];
      const highestScore = Math.max(...sortedAttempts.map((a) => a.score));

      groups.push({
        patientId: latest.patientId || key,
        patientName: latest.patientName,
        patientAvatar: latest.patientAvatar,
        totalAttempts: sortedAttempts.length,
        highestScore,
        latestScore: latest.score,
        latestPassed: latest.passed,
        latestCompletionDate: latest.completionDate,
        attempts: sortedAttempts,
      });
    });

    // Filter by searchQuery if any
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return groups.filter(
        (g) =>
          g.patientName.toLowerCase().includes(q) ||
          g.patientId.toLowerCase().includes(q)
      );
    }

    return groups;
  }, [participants, searchQuery]);

  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return groupedParticipants.slice(start, start + itemsPerPage);
  }, [groupedParticipants, currentPage]);

  const totalPages = Math.ceil(groupedParticipants.length / itemsPerPage) || 1;

  const toggleExpand = (patientId: string) => {
    setExpandedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(patientId)) {
        next.delete(patientId);
      } else {
        next.add(patientId);
      }
      return next;
    });
  };

  const getDetailUrl = (patientId: string) => {
    return pathname.startsWith("/staff")
      ? `/staff/manajemen-kuisioner/${quizId}/participant/${patientId}`
      : `${ROUTES.MANAJEMEN_KUISIONER}/${quizId}/participant/${patientId}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden space-y-4 font-[family-name:var(--font-poppins)]">
      {/* Table Toolbar Search */}
      <div className="p-6 pb-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Daftar Partisipan Kuesioner</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Total {groupedParticipants.length} Pasien ({participants.length} Total Percobaan)
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] text-lg select-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari pasien..."
            className="w-full bg-[#F4F6F8]/60 border border-[#E2E8F0] rounded-xl py-2 pl-11 pr-4 text-xs focus:border-[#3B67FC] focus:ring-1 focus:ring-[#3B67FC] outline-none transition-all font-medium text-[#1A202C] placeholder:text-[#718096] h-10"
          />
        </div>
      </div>

      {/* 100% Perfectly Aligned HTML Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs text-slate-700">
          <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-6">Pasien</th>
              <th className="py-3.5 px-4">Percobaan</th>
              <th className="py-3.5 px-4 text-center">{isPreTest ? "Skor DSMES / DSMQR" : "Skor Terakhir"}</th>
              <th className="py-3.5 px-4 text-center">{isPreTest ? "Kategori Efikasi Diri" : "Skor Tertinggi"}</th>
              <th className="py-3.5 px-4">{isPreTest ? "Status" : "Status Terakhir"}</th>
              <th className="py-3.5 px-4">Tanggal Selesai</th>
              <th className="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginatedGroups.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                  Belum ada partisipan yang menyelesaikan kuesioner ini.
                </td>
              </tr>
            ) : (
              paginatedGroups.map((group) => {
                const isExpanded = expandedUserIds.has(group.patientId);
                const hasMultiple = group.totalAttempts > 1;
                const dmsesCategory = group.attempts[0]?.selfEfficacyCategory || getDmsesCategory(group.latestScore);

                return (
                  <Fragment key={group.patientId}>
                    {/* Main User Row */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      {/* Pasien Column */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar src={group.patientAvatar} name={group.patientName} size={36} />
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{group.patientName}</p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              ID: P-00{group.patientId.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Percobaan Column */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EEF2FF] text-[#3B67FC] border border-[#8FAAFF]/50 whitespace-nowrap">
                          {group.totalAttempts}x Percobaan
                        </span>
                      </td>

                      {/* Skor Terakhir / DMSES Column */}
                      <td className="py-3.5 px-4 text-center">
                        {isPreTest ? (
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-xs text-[#3B67FC]">
                              DSMES: {group.attempts[0]?.scoreDsmes ?? group.latestScore}
                            </span>
                            {group.attempts[0]?.scoreDsmqr !== undefined && (
                              <span className="font-semibold text-[10px] text-amber-700">
                                DSMQR: {group.attempts[0]?.scoreDsmqr}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="font-bold text-sm text-[#3B67FC]">
                            {group.latestScore}%
                          </span>
                        )}
                      </td>

                      {/* Skor Tertinggi / Kategori Column */}
                      <td className="py-3.5 px-4 text-center">
                        {isPreTest ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                            {dmsesCategory}
                          </span>
                        ) : (
                          <span className="font-bold text-sm text-slate-700">
                            {group.highestScore}%
                          </span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-4">
                        {isPreTest ? (
                          <Badge variant="primary">Selesai</Badge>
                        ) : (
                          <Badge variant={group.latestPassed ? "primary" : "error"}>
                            {group.latestPassed ? "Lulus" : "Gagal"}
                          </Badge>
                        )}
                      </td>

                      {/* Tanggal Selesai Column */}
                      <td className="py-3.5 px-4 text-slate-500 font-medium text-xs whitespace-nowrap">
                        {group.latestCompletionDate}
                      </td>

                      {/* Aksi Column */}
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {hasMultiple && (
                            <button
                              onClick={() => toggleExpand(group.patientId)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Lihat riwayat percobaan"
                            >
                              <span>{isExpanded ? "Tutup" : "Riwayat"}</span>
                              <span className="material-symbols-outlined text-sm select-none">
                                {isExpanded ? "expand_less" : "expand_more"}
                              </span>
                            </button>
                          )}
                          <Link
                            href={getDetailUrl(group.patientId)}
                            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-[#3B67FC] transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
                          >
                            Detail
                          </Link>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable History Sub-Row */}
                    {hasMultiple && isExpanded && (
                      <tr className="bg-[#F8FAFC]">
                        <td colSpan={7} className="px-6 py-4 border-t border-b border-[#E2E8F0]">
                          <div className="space-y-2">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              Riwayat Percobaan {group.patientName} ({group.totalAttempts} kali)
                            </p>
                            <div className="space-y-1.5">
                              {group.attempts.map((attempt, idx) => (
                                <div
                                  key={attempt.id || idx}
                                  className="flex items-center justify-between py-2 px-4 bg-white rounded-xl border border-slate-200/80 text-xs"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center">
                                      #{group.totalAttempts - idx}
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                      Selesai: {attempt.completionDate}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <span className="font-bold text-[#3B67FC]">
                                      Skor: {attempt.score}%
                                    </span>
                                    <Badge variant={attempt.passed ? "primary" : "error"}>
                                      {attempt.passed ? "Lulus" : "Gagal"}
                                    </Badge>
                                    <span className="text-slate-400 font-medium">
                                      Durasi: {attempt.duration}
                                    </span>
                                    <Link
                                      href={getDetailUrl(group.patientId)}
                                      className="text-[#3B67FC] hover:underline font-bold text-xs"
                                    >
                                      Lihat Lembar Jawaban →
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] text-xs font-semibold text-[#718096]">
          <span>
            Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, groupedParticipants.length)} dari {groupedParticipants.length} pasien
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#718096] hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm select-none">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={[
                  "w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors cursor-pointer",
                  currentPage === idx + 1
                    ? "bg-[#3B67FC] text-white"
                    : "border border-[#E2E8F0] text-[#1A202C] hover:bg-slate-100",
                ].join(" ")}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
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
