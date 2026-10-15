import type {
  QuestionnaireRecord,
  QuizStats,
  QuizParticipant,
  ParticipantQuizDetail,
  ParticipantQuestionAnalysis,
  PaginationMeta,
  QuizListParams,
  QuestionCategoryItem,
  QuestionItem,
  QuestionChoice,
  QuestionnaireFormFields,
  EligiblePreTest,
  QuestionnairePair,
  QuestionnaireComparisonRow,
} from "../types/quiz";
import { axiosInstance } from "@/lib/axios";

interface ApiChoiceResponse {
  readonly id: string;
  readonly option_text: string;
  readonly score_value?: number;
  readonly is_correct: boolean;
  readonly display_order: number;
}

interface ApiQuestionResponse {
  readonly id: string;
  readonly question_text: string;
  readonly question_image_url?: string;
  readonly explanation?: string;
  readonly display_order: number;
  readonly choices: readonly ApiChoiceResponse[];
}

interface ApiCategoryResponse {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly display_order: number;
  readonly instrument_category?: "PRE_TEST" | "DSMQR" | "DSMES";
  readonly questions: readonly ApiQuestionResponse[];
}

interface ApiQuestionnaireResponse {
  readonly id: string;
  readonly title: string;
  readonly type: "PRE_TEST" | "POST_TEST";
  readonly scope?: "APPLICATION" | "EDUCATION";
  readonly description?: string;
  readonly education_id?: string;
  readonly education_title?: string;
  readonly passing_score?: number;
  readonly difficulty?: string;
  readonly status: string;
  readonly category_count: number;
  readonly question_count: number;
  readonly participant_count: number;
  readonly average_score: number | null;
  readonly created_by: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly source_pre_test_id?: string;
  readonly is_linked_to_pre_test?: boolean;
  readonly paired_questionnaire_id?: string;
  readonly paired_questionnaire_title?: string;
}

interface ApiQuestionnaireDetailResponse extends ApiQuestionnaireResponse {
  readonly categories: readonly ApiCategoryResponse[];
}

interface ApiParticipantResponse {
  readonly id: string;
  readonly patient_id: string;
  readonly patient_name: string;
  readonly patient_avatar?: string;
  readonly puskesmas: string;
  readonly completion_date: string;
  readonly score: number;
  readonly passed: boolean;
  readonly duration: string;
  readonly self_efficacy_category?: string;
  readonly score_dsmes?: number;
  readonly score_dsmqr?: number;
  readonly dsmqr_category?: string;
  readonly score_pre_test?: number;
}

interface ApiParticipantDetailResponse {
  readonly participant: ApiParticipantResponse;
  readonly quiz_title: string;
  readonly type: string;
  readonly scope: string;
  readonly question_analysis: readonly {
    readonly id: string;
    readonly question_number: number;
    readonly question_text: string;
    readonly instrument_category?: string;
    readonly patient_answer: string;
    readonly correct_answer: string;
    readonly is_correct: boolean;
    readonly explanation?: string;
  }[];
}

interface ApiQuizStats {
  readonly total_quizzes: number;
  readonly published_quizzes: number;
  readonly draft_quizzes: number;
  readonly total_attempts: number;
  readonly average_score: number;
}

function mapQuestionnaireFromApi(api: ApiQuestionnaireDetailResponse): QuestionnaireRecord {
  const categories: QuestionCategoryItem[] = (api.categories ?? []).map((cat) => ({
    id: cat.id,
    title: cat.title,
    description: cat.description,
    displayOrder: cat.display_order,
    instrumentCategory: cat.instrument_category,
    questions: (cat.questions ?? []).map((q): QuestionItem => ({
      id: q.id,
      questionText: q.question_text,
      questionImageUrl: q.question_image_url,
      explanation: q.explanation,
      displayOrder: q.display_order,
      choices: (q.choices ?? []).map((c): QuestionChoice => ({
        id: c.id,
        optionText: c.option_text,
        scoreValue: c.score_value,
        isCorrect: c.is_correct,
        displayOrder: c.display_order,
      })),
    })),
  }));

  return {
    id: api.id,
    title: api.title,
    type: api.type,
    scope: api.scope,
    description: api.description,
    educationId: api.education_id,
    educationTitle: api.education_title,
    passingScore: api.passing_score,
    difficulty: api.difficulty as QuestionnaireRecord["difficulty"],
    status: api.status as QuestionnaireRecord["status"],
    categoryCount: api.category_count,
    questionCount: api.question_count,
    participantCount: api.participant_count,
    averageScore: api.average_score,
    createdBy: api.created_by ?? "-",
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    sourcePreTestId: api.source_pre_test_id,
    isLinkedToPreTest: api.is_linked_to_pre_test,
    pairedQuestionnaireId: api.paired_questionnaire_id,
    pairedQuestionnaireTitle: api.paired_questionnaire_title,
    categories,
  };
}

function mapQuestionnaireListItemFromApi(api: ApiQuestionnaireResponse): QuestionnaireRecord {
  return {
    id: api.id,
    title: api.title,
    type: api.type,
    scope: api.scope,
    description: api.description,
    educationId: api.education_id,
    educationTitle: api.education_title,
    passingScore: api.passing_score,
    difficulty: api.difficulty as QuestionnaireRecord["difficulty"],
    status: api.status as QuestionnaireRecord["status"],
    categoryCount: api.category_count ?? 0,
    questionCount: api.question_count ?? 0,
    participantCount: api.participant_count,
    averageScore: api.average_score,
    createdBy: api.created_by ?? "-",
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    sourcePreTestId: api.source_pre_test_id,
    isLinkedToPreTest: api.is_linked_to_pre_test,
    pairedQuestionnaireId: api.paired_questionnaire_id,
    pairedQuestionnaireTitle: api.paired_questionnaire_title,
  };
}

function mapParticipantFromApi(api: ApiParticipantResponse): QuizParticipant {
  const date = new Date(api.completion_date);
  const formatted = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    id: api.id,
    patientId: api.patient_id,
    patientName: api.patient_name,
    patientAvatar: api.patient_avatar,
    puskesmas: api.puskesmas ?? "-",
    completionDate: formatted,
    score: api.score,
    passed: api.passed,
    duration: api.duration,
    selfEfficacyCategory: api.self_efficacy_category,
    scoreDsmes: api.score_dsmes,
    scoreDsmqr: api.score_dsmqr,
    dsmqrCategory: api.dsmqr_category,
    scorePreTest: api.score_pre_test,
  };
}

function mapQuestionAnalysisFromApi(
  qa: ApiParticipantDetailResponse["question_analysis"][number]
): ParticipantQuestionAnalysis {
  return {
    id: qa.id,
    questionNumber: qa.question_number,
    questionText: qa.question_text,
    instrumentCategory: qa.instrument_category,
    patientAnswer: qa.patient_answer,
    correctAnswer: qa.correct_answer,
    isCorrect: qa.is_correct,
    explanation: qa.explanation,
  };
}

function formatQuestionnairePayload(fields: QuestionnaireFormFields) {
  const isEducationScope = fields.scope === "EDUCATION";

  return {
    title: fields.title.trim(),
    type: fields.type,
    scope: fields.scope,
    description: fields.description ? fields.description.trim() : "",
    education_id: isEducationScope && fields.educationId ? fields.educationId : null,
    passing_score: isEducationScope && fields.type === "POST_TEST" && fields.passingScore ? Number(fields.passingScore) : null,
    difficulty: isEducationScope && fields.type === "POST_TEST" && fields.difficulty ? fields.difficulty : null,
    status: fields.status ? fields.status.toLowerCase() : "aktif",
    source_pre_test_id: fields.type === "POST_TEST" ? fields.sourcePreTestId : undefined,
    copy_questions_from_pre_test: fields.type === "POST_TEST" ? fields.copyQuestionsFromPreTest : undefined,
    categories: fields.categories.map((cat, catIdx) => ({
      ...(cat.id ? { id: cat.id } : {}),
      title: cat.title.trim(),
      description: cat.description ? cat.description.trim() : "",
      instrument_category: cat.instrumentCategory || "PRE_TEST",
      display_order: catIdx + 1,
      questions: cat.questions.map((q, qIdx) => ({
        ...(q.id ? { id: q.id } : {}),
        question_text: q.questionText.trim(),
        question_image_url: q.questionImageUrl ? q.questionImageUrl.trim() : "",
        explanation: q.explanation ? q.explanation.trim() : "",
        display_order: qIdx + 1,
        choices: q.choices.map((c, cIdx) => ({
          ...(c.id ? { id: c.id } : {}),
          option_text: c.optionText.trim(),
          score_value: c.scoreValue,
          is_correct: c.isCorrect,
          display_order: cIdx + 1,
        })),
      })),
    })),
  };
}

export const quizService = {
  /** Get paginated questionnaires */
  async getQuizzes(
    params: QuizListParams = {},
    rolePrefix: "admin" | "staff" = "staff"
  ): Promise<{ items: QuestionnaireRecord[]; pagination: PaginationMeta }> {
    const res = await axiosInstance.get(`/${rolePrefix}/quiz`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        type: params.type || undefined,
        scope: params.scope || undefined,
        status: params.status || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
      },
    });
    const items: ApiQuestionnaireResponse[] = res.data.data ?? [];
    const meta = res.data?.meta ?? { page: 1, per_page: 10, total: 0, total_pages: 0 };
    return {
      items: items.map(mapQuestionnaireListItemFromApi),
      pagination: meta,
    };
  },

  /** Get single questionnaire by ID */
  async getQuizById(id: string, rolePrefix: "admin" | "staff" = "admin"): Promise<QuestionnaireRecord | null> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/quiz/${id}`);
      const data: ApiQuestionnaireDetailResponse = res.data.data;
      return mapQuestionnaireFromApi(data);
    } catch {
      return null;
    }
  },

  /** Get pre-tests available for pairing with a post-test. */
  async getEligiblePreTests(
    scope: "APPLICATION" | "EDUCATION",
    educationId?: string,
    rolePrefix: "admin" | "staff" = "admin"
  ): Promise<EligiblePreTest[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/quiz/eligible-pre-tests`, {
      params: { scope, education_id: educationId || undefined },
    });
    const items: ApiQuestionnaireResponse[] = res.data.data ?? [];
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      scope: item.scope ?? scope,
      educationId: item.education_id,
      educationTitle: item.education_title,
      questionCount: item.question_count ?? 0,
      status: item.status as EligiblePreTest["status"],
    }));
  },

  async pairQuestionnaire(postTestId: string, sourcePreTestId: string, rolePrefix: "admin" | "staff" = "admin"): Promise<boolean> {
    try {
      await axiosInstance.patch(`/${rolePrefix}/quiz/${postTestId}/pair`, { source_pre_test_id: sourcePreTestId });
      return true;
    } catch {
      return false;
    }
  },

  /** Get linked pre/post questionnaires. Missing planned endpoint returns null. */
  async getQuizPair(
    id: string,
    rolePrefix: "admin" | "staff" = "admin"
  ): Promise<QuestionnairePair | null> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/quiz/${id}/pair`);
      const data = res.data.data as {
        pre_test?: ApiQuestionnaireDetailResponse;
        post_test?: ApiQuestionnaireDetailResponse;
      };
      if (!data?.pre_test || !data?.post_test) return null;
      return {
        preTest: mapQuestionnaireFromApi(data.pre_test),
        postTest: mapQuestionnaireFromApi(data.post_test),
      };
    } catch {
      return null;
    }
  },

  /** Get patient pre/post comparison. Missing planned endpoint returns null. */
  async getQuizComparison(
    id: string,
    rolePrefix: "admin" | "staff" = "admin"
  ): Promise<QuestionnaireComparisonRow[] | null> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/quiz/${id}/comparison`);
      const items = (res.data.data?.items ?? res.data.data ?? []) as Array<{
        patient_id: string;
        patient_name: string;
        pre_test_score?: number | null;
        post_test_score?: number | null;
        change?: number | null;
        score_change?: number | null;
        status?: string;
        pre_attempt?: { score?: number; score_dsmes?: number; score_dsmqr?: number };
        post_attempt?: { score?: number; score_dsmes?: number; score_dsmqr?: number };
        dsmes_change?: number | null;
        dsmqr_change?: number | null;
      }>;
      return items.map((item) => ({
        patientId: item.patient_id,
        patientName: item.patient_name,
        preTestScore: item.pre_test_score ?? item.pre_attempt?.score ?? null,
        postTestScore: item.post_test_score ?? item.post_attempt?.score ?? null,
        change: item.change ?? item.score_change ?? null,
        status: item.status,
        preDsmes: item.pre_attempt?.score_dsmes ?? null,
        postDsmes: item.post_attempt?.score_dsmes ?? null,
        dsmesChange: item.dsmes_change ?? null,
        preDsmqr: item.pre_attempt?.score_dsmqr ?? null,
        postDsmqr: item.post_attempt?.score_dsmqr ?? null,
        dsmqrChange: item.dsmqr_change ?? null,
      }));
    } catch {
      return null;
    }
  },

  /** Create new questionnaire */
  async createQuiz(payload: QuestionnaireFormFields): Promise<QuestionnaireRecord> {
    const formatted = formatQuestionnairePayload(payload);
    const res = await axiosInstance.post("/admin/quiz", formatted);
    const data: ApiQuestionnaireDetailResponse = res.data.data;
    return mapQuestionnaireFromApi(data);
  },

  /** Update existing questionnaire */
  async updateQuiz(id: string, payload: QuestionnaireFormFields): Promise<QuestionnaireRecord> {
    const formatted = formatQuestionnairePayload(payload);
    const res = await axiosInstance.put(`/admin/quiz/${id}`, formatted);
    const data: ApiQuestionnaireDetailResponse = res.data.data;
    return mapQuestionnaireFromApi(data);
  },

  /** Save (Create or Update) questionnaire */
  async saveQuestionnaire(
    payload: QuestionnaireFormFields & { id?: string }
  ): Promise<QuestionnaireRecord> {
    if (payload.id) {
      return this.updateQuiz(payload.id, payload);
    }
    return this.createQuiz(payload);
  },

  /** Delete questionnaire */
  async deleteQuiz(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(`/admin/quiz/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  /** Toggle quiz status between Aktif and Draft */
  async toggleQuizStatus(quizId: string, currentStatus: string): Promise<boolean> {
    try {
      const newStatus = currentStatus === "Aktif" ? "Draft" : "Aktif";
      await axiosInstance.patch(`/admin/quiz/${quizId}/status`, {
        status: newStatus.toLowerCase(),
      });
      return true;
    } catch {
      return false;
    }
  },

  /** Get statistics summary */
  async getStats(rolePrefix: "admin" | "staff" = "staff"): Promise<QuizStats> {
    const res = await axiosInstance.get(`/${rolePrefix}/quiz/stats`);
    const data: ApiQuizStats = res.data.data;
    return {
      totalQuizzes: data.total_quizzes,
      publishedQuizzes: data.published_quizzes,
      draftQuizzes: data.draft_quizzes,
      totalAttempts: data.total_attempts,
      averageScore: data.average_score,
    };
  },

  /** Get participants for a specific questionnaire */
  async getParticipantsByQuizId(quizId: string, rolePrefix: "admin" | "staff" = "staff"): Promise<QuizParticipant[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/quiz/${quizId}/participants`);
    const items: ApiParticipantResponse[] = res.data.data ?? [];
    return items.map(mapParticipantFromApi);
  },

  /** Get participant questionnaire detail */
  async getParticipantDetail(
    quizId: string,
    participantId: string,
    rolePrefix: "admin" | "staff" = "staff"
  ): Promise<ParticipantQuizDetail | null> {
    try {
      const res = await axiosInstance.get(
        `/${rolePrefix}/quiz/${quizId}/participant/${participantId}`
      );
      const data: ApiParticipantDetailResponse = res.data.data;

  return {
    participant: mapParticipantFromApi(data.participant),
    quizTitle: data.quiz_title,
    type: data.type,
    scope: data.scope,
    questionAnalysis: data.question_analysis.map(mapQuestionAnalysisFromApi),
      };
    } catch {
      return null;
    }
  },

  /** Get published articles for the quiz form dropdown */
  async getArticles(): Promise<{ value: string; label: string }[]> {
    const res = await axiosInstance.get("/admin/education/articles", {
      params: { limit: 200, status: "publikasi" },
    });
    const items: { id: string; title: string }[] = res.data.data ?? [];
    return items.map((a) => ({ value: a.id, label: a.title }));
  },
} as const;
