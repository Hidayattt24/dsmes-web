export interface EducationSectionStep {
  readonly id: string;
  readonly stepOrder: number;
  readonly stepText: string;
}

export interface EducationSection {
  readonly id: string;
  readonly sectionOrder: number;
  readonly sectionTitle: string;
  readonly sectionType: "paragraf" | "langkah" | "info_penting";
  readonly contentText: string;
  readonly imageUrl: string;
  readonly steps: readonly EducationSectionStep[];
}

export interface EducationArticle {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly shortDescription: string;
  readonly content: string;
  readonly duration: number; // Reading duration in minutes
  readonly youtubeLink?: string;
  readonly thumbnail: string;
  readonly coverImage?: string;
  readonly status: "Diterbitkan" | "Draf";
  readonly createdBy: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly readCount: number;
  readonly sections: readonly EducationSection[];
}

export interface EducationStats {
  readonly totalEducation: number;
  readonly totalCategories: number;
  readonly publishedArticles: number;
  readonly totalReads: number;
}

export interface EducationProgressItem {
  readonly patient_id: string;
  readonly patient_name: string;
  readonly puskesmas?: string;
  // Article reading
  readonly article_read: boolean;
  readonly article_read_at: string | null;
  readonly article_started_at: string | null;
  readonly article_finished_at: string | null;
  readonly article_reading_duration: number; // seconds
  readonly article_last_scroll_position: number; // percentage 0-100
  // Video watching
  readonly youtube_watched: boolean;
  readonly youtube_watched_at: string | null;
  readonly video_started_at: string | null;
  readonly video_finished_at: string | null;
  readonly video_watch_duration: number; // seconds
  readonly video_last_timestamp: number; // seconds
  // Completion
  readonly completed: boolean;
  readonly completed_at: string | null;
  readonly completion_source: "ARTICLE" | "VIDEO" | ""; // which media led to completion
  readonly last_activity_at: string | null;
}

export interface EducationProgressAnalytics {
  readonly total_patients: number;
  readonly completed_count: number;
  readonly read_article_count: number;
  readonly watched_video_count: number;
  readonly read_and_video_count: number;
  readonly not_started_count: number;
}

export interface RatingDistribution {
  readonly star_1: number;
  readonly star_2: number;
  readonly star_3: number;
  readonly star_4: number;
  readonly star_5: number;
}

export interface EducationUserReview {
  readonly id: string;
  readonly education_id: string;
  readonly patient_id: string;
  readonly patient_name: string;
  readonly rating: number;
  readonly note: string;
  readonly completion_date: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface AdminArticleReviewsData {
  readonly average_rating: number;
  readonly total_reviews: number;
  readonly rating_distribution: RatingDistribution;
  readonly reviews: readonly EducationUserReview[];
}

