"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { quizService } from "../services/quizService";
import type { QuestionnaireRecord, QuestionnaireScope, QuizStats, PaginationMeta, QuizSortBy } from "../types/quiz";

interface UseQuizListReturn {
  readonly quizzes: readonly QuestionnaireRecord[];
  readonly stats: QuizStats | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly searchQuery: string;
  readonly filterType: "Semua" | "PRE_TEST" | "POST_TEST";
  readonly filterScope: "Semua" | QuestionnaireScope;
  readonly filterStatus: "Semua" | "Aktif" | "Draft" | "Nonaktif";
  readonly sortBy: QuizSortBy;
  readonly pagination: PaginationMeta;
  readonly rolePrefix: "admin" | "staff";
  readonly setSearchQuery: (q: string) => void;
  readonly setFilterType: (type: "Semua" | "PRE_TEST" | "POST_TEST") => void;
  readonly setFilterScope: (scope: "Semua" | QuestionnaireScope) => void;
  readonly setFilterStatus: (status: "Semua" | "Aktif" | "Draft" | "Nonaktif") => void;
  readonly setSortBy: (sort: QuizSortBy) => void;
  readonly setPage: (p: number) => void;
  readonly refetch: () => Promise<void>;
}

export function useQuizList(): UseQuizListReturn {
  const pathname = usePathname();
  const rolePrefix: "admin" | "staff" = pathname.startsWith("/admin") ? "admin" : "staff";

  const [quizzes, setQuizzes] = useState<readonly QuestionnaireRecord[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, per_page: 10, total: 0, total_pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"Semua" | "PRE_TEST" | "POST_TEST">("Semua");
  const [filterScope, setFilterScope] = useState<"Semua" | QuestionnaireScope>("Semua");
  const [filterStatus, setFilterStatus] = useState<"Semua" | "Aktif" | "Draft" | "Nonaktif">("Semua");
  const [sortBy, setSortBy] = useState<QuizSortBy>("newest");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        type: filterType !== "Semua" ? filterType : undefined,
        scope: filterScope !== "Semua" ? filterScope : undefined,
        status: filterStatus !== "Semua" ? filterStatus : undefined,
        sort_by: sortBy,
        sort_order: (sortBy === "title" ? "asc" : "desc") as "asc" | "desc",
      };
      const [result, summary] = await Promise.all([
        quizService.getQuizzes(params, rolePrefix),
        quizService.getStats(rolePrefix),
      ]);
      setQuizzes(result.items);
      setPagination(result.pagination);
      setStats(summary);
    } catch {
      setError("Gagal memuat data kuesioner.");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, filterType, filterScope, filterStatus, sortBy, rolePrefix]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleSetSearchQuery = useCallback((q: string) => {
    setSearchQuery(q);
    setPage(1);
  }, []);

  const handleSetFilterType = useCallback((type: "Semua" | "PRE_TEST" | "POST_TEST") => {
    setFilterType(type);
    setPage(1);
  }, []);

  const handleSetFilterScope = useCallback((scope: "Semua" | QuestionnaireScope) => {
    setFilterScope(scope);
    setPage(1);
  }, []);

  const handleSetFilterStatus = useCallback((status: "Semua" | "Aktif" | "Draft" | "Nonaktif") => {
    setFilterStatus(status);
    setPage(1);
  }, []);

  const handleSetSortBy = useCallback((sort: QuizSortBy) => {
    setSortBy(sort);
    setPage(1);
  }, []);

  return {
    quizzes,
    stats,
    isLoading,
    error,
    searchQuery,
    filterType,
    filterScope,
    filterStatus,
    sortBy,
    pagination,
    rolePrefix,
    setSearchQuery: handleSetSearchQuery,
    setFilterType: handleSetFilterType,
    setFilterScope: handleSetFilterScope,
    setFilterStatus: handleSetFilterStatus,
    setSortBy: handleSetSortBy,
    setPage,
    refetch: fetchData,
  };
}
