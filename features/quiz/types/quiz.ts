export type QuestionnaireType = "PRE_TEST" | "POST_TEST";
export type QuestionnaireScope = "APPLICATION" | "EDUCATION";
export type QuestionnaireDifficulty = "Mudah" | "Sedang" | "Sulit";
export type QuestionnaireStatus = "Aktif" | "Draft" | "Nonaktif";

export type InstrumentCategoryType = "PRE_TEST" | "DSMQR" | "DSMES";

export interface QuestionChoice {
  readonly id?: string;
  readonly optionText: string;
  readonly scoreValue?: number;
  readonly isCorrect: boolean;
  readonly displayOrder?: number;
}

export interface QuestionItem {
  readonly id?: string;
  readonly questionText: string;
  readonly questionImageUrl?: string;
  readonly explanation?: string;
  readonly displayOrder?: number;
  readonly choices: readonly QuestionChoice[];
}

export interface QuestionCategoryItem {
  readonly id?: string;
  readonly title: string;
  readonly description?: string;
  readonly displayOrder?: number;
  readonly instrumentCategory?: InstrumentCategoryType;
  readonly questions: readonly QuestionItem[];
}

export interface QuestionnaireRecord {
  readonly id: string;
  readonly title: string;
  readonly type: QuestionnaireType;
  readonly scope?: QuestionnaireScope;
  readonly description?: string;
  readonly educationId?: string;
  readonly educationTitle?: string;
  readonly passingScore?: number;
  readonly difficulty?: QuestionnaireDifficulty;
  readonly status: QuestionnaireStatus;
  readonly categoryCount: number;
  readonly questionCount: number;
  readonly participantCount: number;
  readonly averageScore: number | null;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly sourcePreTestId?: string;
  readonly isLinkedToPreTest?: boolean;
  readonly pairedQuestionnaireId?: string;
  readonly pairedQuestionnaireTitle?: string;
  readonly categories?: readonly QuestionCategoryItem[];
}

// Backward compatibility aliases
export type Quiz = QuestionnaireRecord;
export type QuizQuestion = FormQuestion;
export type QuizChoice = FormChoice;
export type QuizCategory = FormCategory;

export interface FormChoice {
  id?: string;
  optionText: string;
  scoreValue?: number;
  isCorrect: boolean;
}

export interface FormQuestion {
  id?: string;
  questionText: string;
  questionImageUrl?: string;
  explanation: string;
  choices: FormChoice[];
}

export interface FormCategory {
  id?: string;
  title: string;
  description: string;
  instrumentCategory?: InstrumentCategoryType;
  questions: FormQuestion[];
}

export interface QuestionnaireFormFields {
  title: string;
  type: QuestionnaireType;
  scope: QuestionnaireScope;
  description: string;
  educationId: string;
  difficulty: QuestionnaireDifficulty;
  passingScore: number;
  status: QuestionnaireStatus;
  categories: FormCategory[];
  questions?: FormQuestion[];
  sourcePreTestId?: string;
  copyQuestionsFromPreTest?: boolean;
}

export interface EligiblePreTest {
  readonly id: string;
  readonly title: string;
  readonly scope: QuestionnaireScope;
  readonly educationId?: string;
  readonly educationTitle?: string;
  readonly questionCount: number;
  readonly status: QuestionnaireStatus;
}

export interface QuestionnairePair {
  readonly preTest: QuestionnaireRecord;
  readonly postTest: QuestionnaireRecord;
}

export interface QuestionnaireComparisonRow {
  readonly patientId: string;
  readonly patientName: string;
  readonly preTestScore: number | null;
  readonly postTestScore: number | null;
  readonly change: number | null;
  readonly status?: string;
  readonly preDsmes?: number | null;
  readonly postDsmes?: number | null;
  readonly dsmesChange?: number | null;
  readonly preDsmqr?: number | null;
  readonly postDsmqr?: number | null;
  readonly dsmqrChange?: number | null;
}


export interface QuizStats {
  readonly totalQuizzes: number;
  readonly publishedQuizzes: number;
  readonly draftQuizzes: number;
  readonly totalAttempts: number;
  readonly averageScore: number;
}

export interface QuizParticipant {
  readonly id: string;
  readonly patientId: string;
  readonly patientName: string;
  readonly patientAvatar?: string;
  readonly puskesmas: string;
  readonly completionDate: string;
  readonly score: number;
  readonly passed: boolean;
  readonly duration: string;
  readonly selfEfficacyCategory?: string;
  readonly scoreDsmes?: number;
  readonly scoreDsmqr?: number;
  readonly dsmqrCategory?: string;
  readonly scorePreTest?: number;
}

export interface ParticipantQuestionAnalysis {
  readonly id: string;
  readonly questionNumber: number;
  readonly questionText: string;
  readonly instrumentCategory?: string;
  readonly patientAnswer: string;
  readonly correctAnswer: string;
  readonly isCorrect: boolean;
  readonly explanation?: string;
}

export interface ParticipantQuizDetail {
  readonly participant: QuizParticipant;
  readonly quizTitle: string;
  readonly type: string;
  readonly scope: "APPLICATION" | "EDUCATION" | string;
  readonly questionAnalysis: readonly ParticipantQuestionAnalysis[];
}

export interface PaginationMeta {
  readonly page: number;
  readonly per_page: number;
  readonly total: number;
  readonly total_pages: number;
}

export type QuizSortBy = "newest" | "oldest" | "title";

export interface QuizListParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly type?: string;
  readonly scope?: QuestionnaireScope;
  readonly status?: string;
  readonly sort_by?: QuizSortBy;
  readonly sort_order?: "asc" | "desc";
}
