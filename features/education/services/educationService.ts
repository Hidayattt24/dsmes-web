import type { EducationArticle, EducationStats, EducationProgressItem, EducationProgressAnalytics, AdminArticleReviewsData } from "../types/education";
import { axiosInstance } from "@/lib/axios";

const formatDateSafe = (dateStr: unknown, includeTime = false): string => {
  if (!dateStr || typeof dateStr !== "string") return "Hari ini";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Hari ini";
    if (includeTime) {
      const datePart = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      const timePart = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      return `${datePart}, ${timePart} WIB`;
    }
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return "Hari ini";
  }
};

const mapArticleFromBackend = (data: Record<string, unknown>): EducationArticle => {
  const createdAtFormatted = formatDateSafe(data.created_at);
  const updatedAtFormatted = formatDateSafe(data.updated_at || data.created_at, true);

  return {
    id: data.id as string,
    title: data.title as string,
    category: (data.category_name as string) || "Umum & DSMES",
    shortDescription: (data.summary as string) || "",
    content: (data.content as string) || "",
    duration: (data.estimated_read_minutes as number) || 5,
    youtubeLink: (data.youtube_link as string) || "",
    thumbnail: (data.banner_image_url as string) || "",
    status: (data.status as string) === "publikasi" ? "Diterbitkan" : "Draf",
    createdBy: (data.author_name as string) || "Admin DSMES",
    createdAt: createdAtFormatted,
    updatedAt: updatedAtFormatted,
    readCount: (data.read_count as number) || 0,
  };
};

export const educationService = {
  /** Get all categories */
  async getCategories(): Promise<string[]> {
    try {
      const res = await axiosInstance.get("/education/categories");
      const list = res.data?.data ?? [];
      return list.map((c: Record<string, unknown>) => ((c.name || c.category_name) as string) || String(c)).filter(Boolean);
    } catch {
      return [];
    }
  },

  /** Get all articles */
  async getArticles(rolePrefix: "admin" | "staff" = "admin"): Promise<EducationArticle[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/education/articles`, { params: { limit: 100 } });
    const list = res.data?.data ?? [];
    return list.map(mapArticleFromBackend);
  },

  /** Get single article by ID */
  async getArticleById(id: string, rolePrefix: "admin" | "staff" = "admin"): Promise<EducationArticle | null> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/education/articles/${id}`);
      if (res.data?.data) {
        return mapArticleFromBackend(res.data.data);
      }
      return null;
    } catch {
      return null;
    }
  },

  /** Save (Create or Update) */
  async saveArticle(article: Partial<EducationArticle> & { id?: string }): Promise<EducationArticle> {
    const payload = {
      title: article.title,
      category_name: article.category,
      estimated_read_minutes: article.duration,
      author_name: article.createdBy || "-",
      banner_image_url: article.thumbnail,
      summary: article.shortDescription,
      content: article.content,
      youtube_link: article.youtubeLink,
      status: article.status === "Diterbitkan" ? "publikasi" : "draft",
    };

    if (article.id) {
      // Update
      const res = await axiosInstance.put(`/admin/education/articles/${article.id}`, payload);
      const data = res.data?.data;
      return mapArticleFromBackend(data);
    } else {
      // Create
      const res = await axiosInstance.post("/admin/education/articles", payload);
      const data = res.data?.data;
      return mapArticleFromBackend(data);
    }
  },

  /** Delete article */
  async deleteArticle(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(`/admin/education/articles/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  /** Get statistics counts */
  async getStats(rolePrefix: "admin" | "staff" = "admin"): Promise<EducationStats> {
    const res = await axiosInstance.get(`/${rolePrefix}/education/stats`);
    const data = res.data?.data ?? {};
    return {
      totalEducation: data.total_education || 0,
      totalCategories: data.total_categories || 0,
      publishedArticles: data.published_articles || 0,
      totalReads: data.total_reads || 0,
    };
  },

  /** Get all patients' progress for an education article */
  async getProgress(articleId: string, rolePrefix: "admin" | "staff" = "admin"): Promise<EducationProgressItem[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/education/${articleId}/progress`);
    const raw: Array<Record<string, unknown>> = res.data?.data ?? [];
    return raw.map((r) => ({
      patient_id: r.patient_id ?? "",
      patient_name: r.patient_name ?? "-",
      puskesmas: r.puskesmas ?? "-",
      article_read: r.article_read ?? false,
      article_read_at: r.article_read_at ?? null,
      article_started_at: r.article_started_at ?? null,
      article_finished_at: r.article_finished_at ?? null,
      article_reading_duration: r.article_reading_duration ?? 0,
      article_last_scroll_position: r.article_last_scroll_position ?? 0,
      youtube_watched: r.youtube_watched ?? false,
      youtube_watched_at: r.youtube_watched_at ?? null,
      video_started_at: r.video_started_at ?? null,
      video_finished_at: r.video_finished_at ?? null,
      video_watch_duration: r.video_watch_duration ?? 0,
      video_last_timestamp: r.video_last_timestamp ?? 0,
      completed: r.completed ?? false,
      completed_at: r.completed_at ?? null,
      completion_source: r.completion_source ?? "",
      last_activity_at: r.last_activity_at ?? null,
    })) as unknown as EducationProgressItem[];
  },

  /** Get progress analytics summary for an education article */
  async getProgressAnalytics(articleId: string, rolePrefix: "admin" | "staff" = "admin"): Promise<EducationProgressAnalytics> {
    const res = await axiosInstance.get(`/${rolePrefix}/education/${articleId}/progress/analytics`);
    const data = res.data?.data ?? {};
    return {
      total_patients: data.total_patients || 0,
      completed_count: data.completed_count || 0,
      read_article_count: data.read_article_count || 0,
      watched_video_count: data.watched_video_count || 0,
      read_and_video_count: data.read_and_video_count || 0,
      not_started_count: data.not_started_count || 0,
    };
  },

  /** Get article review summary, rating distribution, and reviews list */
  async getArticleReviews(articleId: string, rolePrefix: "admin" | "staff" = "admin"): Promise<AdminArticleReviewsData> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/education/${articleId}/reviews`);
      const data = res.data?.data ?? {};
      return {
        average_rating: data.average_rating || 0,
        total_reviews: data.total_reviews || 0,
        rating_distribution: {
          star_1: data.rating_distribution?.star_1 || 0,
          star_2: data.rating_distribution?.star_2 || 0,
          star_3: data.rating_distribution?.star_3 || 0,
          star_4: data.rating_distribution?.star_4 || 0,
          star_5: data.rating_distribution?.star_5 || 0,
        },
        reviews: (data.reviews || []).map((r: Record<string, unknown>) => ({
          id: r.id,
          education_id: r.education_id,
          patient_id: r.patient_id,
          patient_name: r.patient_name || "Pasien",
          rating: r.rating || 0,
          note: r.note || "",
          completion_date: r.completion_date || null,
          created_at: r.created_at,
          updated_at: r.updated_at,
        } as unknown as AdminArticleReviewsData['reviews'][0])),
      };
    } catch {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { star_1: 0, star_2: 0, star_3: 0, star_4: 0, star_5: 0 },
        reviews: [],
      };
    }
  },
};
