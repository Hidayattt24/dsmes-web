import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { quizService } from "../services/quizService";
import type {
  QuestionnaireType,
  QuestionnaireDifficulty,
  QuestionnaireStatus,
} from "../types/quiz";
import { useToast } from "@/components/ui/Toast";

export interface FormChoice {
  id?: string;
  optionText: string;
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
  questions: FormQuestion[];
}

export interface QuestionnaireFormFields {
  title: string;
  type: QuestionnaireType;
  description: string;
  educationId: string;
  difficulty: QuestionnaireDifficulty;
  passingScore: number;
  status: QuestionnaireStatus;
  categories: FormCategory[];
}

interface ArticleOption {
  readonly value: string;
  readonly label: string;
}

const createEmptyChoice = (label = "", isCorrect = false): FormChoice => ({
  optionText: label,
  isCorrect,
});

const createEmptyQuestion = (): FormQuestion => ({
  questionText: "",
  questionImageUrl: "",
  explanation: "",
  choices: [
    createEmptyChoice("", true),
    createEmptyChoice("", false),
    createEmptyChoice("", false),
    createEmptyChoice("", false),
  ],
});

const createEmptyCategory = (title = ""): FormCategory => ({
  title,
  description: "",
  questions: [createEmptyQuestion()],
});

export function useQuizForm(quizId?: string) {
  const router = useRouter();
  const { showToast } = useToast();

  const [fields, setFields] = useState<QuestionnaireFormFields>({
    title: "",
    type: "POST_TEST",
    description: "",
    educationId: "",
    difficulty: "Sedang",
    passingScore: 80,
    status: "Draft",
    categories: [createEmptyCategory("Soal Post-Test")],
  });

  const [articleOptions, setArticleOptions] = useState<readonly ArticleOption[]>([]);
  const [existingPreTest, setExistingPreTest] = useState<{ id: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if Pre-Test already exists in the system when creating new
  useEffect(() => {
    if (quizId) return;
    const checkPreTest = async () => {
      try {
        const res = await quizService.getQuizzes({ type: "PRE_TEST", limit: 5 });
        if (res.items && res.items.length > 0) {
          const pre = res.items[0];
          setExistingPreTest({ id: pre.id, title: pre.title });
          setFields((prev) => ({
            ...prev,
            type: "POST_TEST",
          }));
        }
      } catch {}
    };
    checkPreTest();
  }, [quizId]);

  // Load published articles for dropdown
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const articles = await quizService.getArticles();
        setArticleOptions(articles);
      } catch {
        showToast({
          type: "warning",
          title: "Peringatan",
          description: "Gagal memuat daftar materi edukasi.",
        });
      }
    };
    loadArticles();
  }, [showToast]);

  // Load initial data if editing
  useEffect(() => {
    if (!quizId) return;
    const loadQuiz = async () => {
      setIsLoading(true);
      try {
        const rolePrefix = typeof window !== "undefined" && window.location.pathname.startsWith("/staff") ? "staff" : "admin";
        const found = await quizService.getQuizById(quizId, rolePrefix);
        if (found) {
          const loadedCategories: FormCategory[] = (found.categories ?? []).map((cat) => ({
            id: cat.id,
            title: cat.title,
            description: cat.description ?? "",
            questions: (cat.questions ?? []).map((q) => ({
              id: q.id,
              questionText: q.questionText,
              questionImageUrl: q.questionImageUrl ?? "",
              explanation: q.explanation ?? "",
              choices: (q.choices ?? []).map((c) => ({
                id: c.id,
                optionText: c.optionText,
                isCorrect: c.isCorrect,
              })),
            })),
          }));

          setFields({
            title: found.title,
            type: found.type,
            description: found.description ?? "",
            educationId: found.educationId ?? "",
            difficulty: found.difficulty ?? "Sedang",
            passingScore: found.passingScore ?? 80,
            status: found.status,
            categories: loadedCategories.length > 0 ? loadedCategories : [createEmptyCategory()],
          });
        }
      } catch {
        showToast({
          type: "error",
          title: "Gagal",
          description: "Gagal memuat kuesioner.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [quizId, showToast]);

  const handleChange = useCallback((key: keyof QuestionnaireFormFields, val: unknown) => {
    setFields((prev) => {
      const updated = { ...prev, [key]: val };
      if (key === "type" && val === "PRE_TEST") {
        updated.educationId = "";
      }
      return updated;
    });
  }, []);

  // Category manipulation
  const addCategory = useCallback(() => {
    setFields((prev) => ({
      ...prev,
      categories: [...prev.categories, createEmptyCategory(`Kategori ${prev.categories.length + 1}`)],
    }));
  }, []);

  const deleteCategory = useCallback(
    (catIndex: number) => {
      setFields((prev) => {
        if (prev.categories.length <= 1) {
          showToast({
            type: "warning",
            title: "Peringatan",
            description: "Kuesioner minimal harus memiliki 1 kategori.",
          });
          return prev;
        }
        return {
          ...prev,
          categories: prev.categories.filter((_, i) => i !== catIndex),
        };
      });
    },
    [showToast]
  );

  const handleCategoryChange = useCallback((catIndex: number, field: "title" | "description", value: string) => {
    setFields((prev) => {
      const updated = [...prev.categories];
      updated[catIndex] = { ...updated[catIndex], [field]: value };
      return { ...prev, categories: updated };
    });
  }, []);

  // Question manipulation
  const addQuestion = useCallback((catIndex = 0) => {
    setFields((prev) => {
      const updatedCats = [...prev.categories];
      if (!updatedCats[catIndex]) {
        updatedCats[catIndex] = createEmptyCategory("Soal Post-Test");
      }
      updatedCats[catIndex] = {
        ...updatedCats[catIndex],
        questions: [...updatedCats[catIndex].questions, createEmptyQuestion()],
      };
      return { ...prev, categories: updatedCats };
    });
  }, []);

  const deleteQuestion = useCallback(
    (catIndex: number, qIndex: number) => {
      setFields((prev) => {
        const cat = prev.categories[catIndex];
        if (!cat || cat.questions.length <= 1) {
          showToast({
            type: "warning",
            title: "Peringatan",
            description: "Minimal harus memiliki 1 pertanyaan.",
          });
          return prev;
        }
        const updatedCats = [...prev.categories];
        updatedCats[catIndex] = {
          ...cat,
          questions: cat.questions.filter((_, i) => i !== qIndex),
        };
        return { ...prev, categories: updatedCats };
      });
    },
    [showToast]
  );

  const handleQuestionChange = useCallback(
    (catIndex: number, qIndex: number, field: "questionText" | "explanation", value: string) => {
      setFields((prev) => {
        const updatedCats = [...prev.categories];
        const cat = updatedCats[catIndex];
        const updatedQuestions = [...cat.questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
        updatedCats[catIndex] = { ...cat, questions: updatedQuestions };
        return { ...prev, categories: updatedCats };
      });
    },
    []
  );

  // Choice manipulation
  const addChoice = useCallback((catIndex: number, qIndex: number) => {
    setFields((prev) => {
      const updatedCats = [...prev.categories];
      const cat = updatedCats[catIndex];
      const updatedQuestions = [...cat.questions];
      const q = updatedQuestions[qIndex];

      if (q.choices.length >= 5) {
        showToast({
          type: "warning",
          title: "Peringatan",
          description: "Maksimal 5 pilihan jawaban per pertanyaan.",
        });
        return prev;
      }

      updatedQuestions[qIndex] = {
        ...q,
        choices: [...q.choices, createEmptyChoice("")],
      };
      updatedCats[catIndex] = { ...cat, questions: updatedQuestions };
      return { ...prev, categories: updatedCats };
    });
  }, [showToast]);

  const deleteChoice = useCallback(
    (catIndex: number, qIndex: number, choiceIndex: number) => {
      setFields((prev) => {
        const updatedCats = [...prev.categories];
        const cat = updatedCats[catIndex];
        const updatedQuestions = [...cat.questions];
        const q = updatedQuestions[qIndex];

        if (q.choices.length <= 2) {
          showToast({
            type: "warning",
            title: "Peringatan",
            description: "Minimal harus memiliki 2 pilihan jawaban.",
          });
          return prev;
        }

        const filteredChoices = q.choices.filter((_, i) => i !== choiceIndex);
        if (q.choices[choiceIndex].isCorrect && filteredChoices.length > 0) {
          filteredChoices[0] = { ...filteredChoices[0], isCorrect: true };
        }

        updatedQuestions[qIndex] = { ...q, choices: filteredChoices };
        updatedCats[catIndex] = { ...cat, questions: updatedQuestions };
        return { ...prev, categories: updatedCats };
      });
    },
    [showToast]
  );

  const handleChoiceChange = useCallback(
    (catIndex: number, qIndex: number, choiceIndex: number, value: string) => {
      setFields((prev) => {
        const updatedCats = [...prev.categories];
        const cat = updatedCats[catIndex];
        const updatedQuestions = [...cat.questions];
        const q = updatedQuestions[qIndex];
        const updatedChoices = [...q.choices];
        updatedChoices[choiceIndex] = { ...updatedChoices[choiceIndex], optionText: value };
        updatedQuestions[qIndex] = { ...q, choices: updatedChoices };
        updatedCats[catIndex] = { ...cat, questions: updatedQuestions };
        return { ...prev, categories: updatedCats };
      });
    },
    []
  );

  const setCorrectChoice = useCallback((catIndex: number, qIndex: number, choiceIndex: number) => {
    setFields((prev) => {
      const updatedCats = [...prev.categories];
      const cat = updatedCats[catIndex];
      const updatedQuestions = [...cat.questions];
      const q = updatedQuestions[qIndex];
      const updatedChoices = q.choices.map((c, i) => ({
        ...c,
        isCorrect: i === choiceIndex,
      }));
      updatedQuestions[qIndex] = { ...q, choices: updatedChoices };
      updatedCats[catIndex] = { ...cat, questions: updatedQuestions };
      return { ...prev, categories: updatedCats };
    });
  }, []);

  // Submit Handler
  const save = useCallback(
    async (targetStatus: QuestionnaireStatus) => {
      if (!fields.title.trim()) {
        showToast({
          type: "error",
          title: "Validasi Gagal",
          description: "Judul Kuesioner wajib diisi.",
        });
        return;
      }

      if (fields.type === "POST_TEST" && !fields.educationId) {
        showToast({
          type: "error",
          title: "Validasi Gagal",
          description: "Pilih Materi Edukasi Terkait untuk Post-Test.",
        });
        return;
      }

      // Ensure categories payload structure
      const formattedCategories: FormCategory[] = fields.categories.map((cat, idx) => {
        let catTitle = cat.title.trim();
        if (fields.type === "POST_TEST" && !catTitle) {
          catTitle = fields.title.trim() || "Soal Post-Test";
        } else if (!catTitle) {
          catTitle = `Kategori ${idx + 1}`;
        }
        return {
          ...cat,
          title: catTitle,
        };
      });

      // Validate questions inside categories or PRE_TEST questions
      if (fields.type === "PRE_TEST") {
        const questionsList = formattedCategories[0]?.questions || [];
        if (questionsList.length === 0) {
          showToast({
            type: "error",
            title: "Validasi Gagal",
            description: "Pre-Test wajib memiliki minimal 1 pertanyaan.",
          });
          return;
        }

        for (let qIdx = 0; qIdx < questionsList.length; qIdx++) {
          const q = questionsList[qIdx];
          if (!q.questionText.trim()) {
            showToast({
              type: "error",
              title: "Validasi Gagal",
              description: `Soal #${qIdx + 1} belum memiliki teks pertanyaan.`,
            });
            return;
          }
        }
      } else {
        // Validate POST_TEST questions and choices
        for (let cIdx = 0; cIdx < formattedCategories.length; cIdx++) {
          const cat = formattedCategories[cIdx];
          if (cat.questions.length === 0) {
            showToast({
              type: "error",
              title: "Validasi Gagal",
              description: `Kategori "${cat.title}" belum memiliki soal.`,
            });
            return;
          }

          for (let qIdx = 0; qIdx < cat.questions.length; qIdx++) {
            const q = cat.questions[qIdx];
            if (!q.questionText.trim()) {
              showToast({
                type: "error",
                title: "Validasi Gagal",
                description: `Soal #${qIdx + 1} belum memiliki teks pertanyaan.`,
              });
              return;
            }

            const hasValidChoice = q.choices.some((c) => c.optionText.trim().length > 0);
            if (!hasValidChoice) {
              showToast({
                type: "error",
                title: "Validasi Gagal",
                description: `Soal #${qIdx + 1} harus memiliki minimal 1 pilihan jawaban bertuliskan teks.`,
              });
              return;
            }

            const hasCorrectChoice = q.choices.some((c) => c.isCorrect && c.optionText.trim().length > 0);
            if (!hasCorrectChoice) {
              showToast({
                type: "error",
                title: "Validasi Gagal",
                description: `Soal #${qIdx + 1} belum memiliki jawaban benar yang valid.`,
              });
              return;
            }
          }
        }
      }

      setIsSaving(true);
      try {
        const payload: QuestionnaireFormFields = {
          ...fields,
          status: targetStatus,
          categories: formattedCategories,
        };

        let result;
        if (quizId) {
          result = await quizService.updateQuiz(quizId, payload);
        } else {
          result = await quizService.createQuiz(payload);
        }

        if (result) {
          showToast({
            type: "success",
            title: "Berhasil",
            description: quizId ? "Kuesioner berhasil diperbarui." : "Kuesioner berhasil dibuat.",
          });
          const rolePrefix = typeof window !== "undefined" && window.location.pathname.startsWith("/staff") ? "staff" : "admin";
          router.push(`/${rolePrefix}/manajemen-kuisioner`);
          router.refresh();
        }
      } catch (err: unknown) {
        let errorMsg = "Gagal menyimpan kuesioner.";
        if (typeof err === "object" && err !== null && "response" in err) {
          const resErr = err as { response?: { data?: { message?: string } } };
          if (resErr.response?.data?.message) {
            errorMsg = resErr.response.data.message;
          }
        } else if (err instanceof Error) {
          errorMsg = err.message;
        }
        showToast({
          type: "error",
          title: "Gagal Menyimpan",
          description: errorMsg,
        });
      } finally {
        setIsSaving(false);
      }
    },
    [fields, quizId, router, showToast]
  );

  const cancel = useCallback(() => {
    const rolePrefix = typeof window !== "undefined" && window.location.pathname.startsWith("/staff") ? "staff" : "admin";
    router.push(`/${rolePrefix}/manajemen-kuisioner`);
  }, [router]);

  return {
    fields,
    articleOptions,
    existingPreTest,
    isLoading,
    isSaving,
    handleChange,
    addCategory,
    deleteCategory,
    handleCategoryChange,
    addQuestion,
    deleteQuestion,
    handleQuestionChange,
    addChoice,
    deleteChoice,
    handleChoiceChange,
    setCorrectChoice,
    save,
    cancel,
  };
}
