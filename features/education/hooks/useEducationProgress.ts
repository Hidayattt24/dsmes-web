"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { educationService } from "../services/educationService";
import type { EducationProgressItem, EducationProgressAnalytics, AdminArticleReviewsData } from "../types/education";

interface UseEducationProgressReturn {
  readonly progress: readonly EducationProgressItem[];
  readonly analytics: EducationProgressAnalytics | null;
  readonly reviewsData: AdminArticleReviewsData | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => void;
}

export function useEducationProgress(articleId: string): UseEducationProgressReturn {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");
  const rolePrefix = isStaff ? "staff" : "admin";

  const [progress, setProgress] = useState<readonly EducationProgressItem[]>([]);
  const [analytics, setAnalytics] = useState<EducationProgressAnalytics | null>(null);
  const [reviewsData, setReviewsData] = useState<AdminArticleReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!articleId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [prog, an, rev] = await Promise.all([
        educationService.getProgress(articleId, rolePrefix),
        educationService.getProgressAnalytics(articleId, rolePrefix),
        educationService.getArticleReviews(articleId, rolePrefix),
      ]);
      setProgress(prog);
      setAnalytics(an);
      setReviewsData(rev);
    } catch {
      setError("Gagal memuat data progress edukasi.");
    } finally {
      setIsLoading(false);
    }
  }, [articleId, rolePrefix]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  return {
    progress,
    analytics,
    reviewsData,
    isLoading,
    error,
    refetch: fetchData,
  };
}
