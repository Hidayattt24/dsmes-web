import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { quizService } from "../services/quizService";
import type {
  QuestionnaireType,
  QuestionnaireScope,
  QuestionnaireDifficulty,
  QuestionnaireStatus,
  EligiblePreTest,
} from "../types/quiz";
import { useToast } from "@/components/ui/Toast";

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
  instrumentCategory?: "PRE_TEST" | "DSMQR" | "DSMES";
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
  sourcePreTestId?: string;
  copyQuestionsFromPreTest?: boolean;
}

interface ArticleOption {
  readonly value: string;
  readonly label: string;
}

const createEmptyChoice = (label = "", isCorrect = false, scoreValue?: number): FormChoice => ({
  optionText: label,
  scoreValue,
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

const createEmptyCategory = (
  title = "",
  instrumentCategory: "PRE_TEST" | "DSMQR" | "DSMES" = "PRE_TEST"
): FormCategory => ({
  title,
  description: "",
  instrumentCategory,
  questions: [createEmptyQuestion()],
});

const createInstrumentChoices = (category: "DSMQR" | "DSMES"): FormChoice[] =>
  category === "DSMQR"
    ? [
        createEmptyChoice("Sangat sesuai", false, 4),
        createEmptyChoice("Sesuai", false, 3),
        createEmptyChoice("Kurang sesuai", false, 2),
        createEmptyChoice("Tidak sesuai", false, 1),
      ]
    : [
        createEmptyChoice("Sama sekali tidak yakin", false, 1),
        createEmptyChoice("Sedikit yakin", false, 2),
        createEmptyChoice("Cukup yakin", false, 3),
        createEmptyChoice("Yakin", false, 4),
        createEmptyChoice("Sangat yakin", false, 5),
      ];

export function useQuizForm(quizId?: string) {
  const router = useRouter();
  const { showToast } = useToast();

  const [fields, setFields] = useState<QuestionnaireFormFields>({
    title: "",
    type: "PRE_TEST",
    scope: "APPLICATION",
    description: "",
    educationId: "",
    difficulty: "Sedang",
    passingScore: 80,
    status: "Draft",
    sourcePreTestId: "",
    copyQuestionsFromPreTest: false,
    categories: [
      { ...createEmptyCategory("Pertanyaan DSMQR", "DSMQR"), questions: [{ ...createEmptyQuestion(), choices: createInstrumentChoices("DSMQR") }] },
      { ...createEmptyCategory("Pertanyaan DSMES", "DSMES"), questions: [{ ...createEmptyQuestion(), choices: createInstrumentChoices("DSMES") }] },
    ],
  });

  const [articleOptions, setArticleOptions] = useState<readonly ArticleOption[]>([]);
  const [existingPreTest, setExistingPreTest] = useState<{ id: string; title: string } | null>(null);
  const [eligiblePreTests, setEligiblePreTests] = useState<readonly EligiblePreTest[]>([]);
  const [isLoadingPreTests, setIsLoadingPreTests] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial load
  useEffect(() => {
    // If we have an initial query or state, load articles
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
            instrumentCategory: (cat.instrumentCategory as "PRE_TEST" | "DSMQR" | "DSMES") || "PRE_TEST",
            questions: (cat.questions ?? []).map((q) => ({
              id: q.id,
              questionText: q.questionText,
              questionImageUrl: q.questionImageUrl ?? "",
              explanation: q.explanation ?? "",
              choices: (q.choices ?? []).map((c) => ({
                id: c.id,
                optionText: c.optionText,
                scoreValue: c.scoreValue,
                isCorrect: c.isCorrect,
              })),
            })),
          }));

          setFields({
            title: found.title,
            type: found.type,
            scope: found.scope ?? (found.educationId ? "EDUCATION" : "APPLICATION"),
            description: found.description ?? "",
            educationId: found.educationId ?? "",
            difficulty: found.difficulty ?? "Sedang",
            passingScore: found.passingScore ?? 80,
            status: found.status,
            sourcePreTestId: found.sourcePreTestId ?? "",
            copyQuestionsFromPreTest: false,
            categories: loadedCategories.length > 0 ? loadedCategories : [createEmptyCategory()],
          });
          if (found.sourcePreTestId) {
            setExistingPreTest({ id: found.sourcePreTestId, title: found.pairedQuestionnaireTitle ?? "Pre-Test terpasang" });
          }
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

  useEffect(() => {
    if (fields.type !== "POST_TEST" || (fields.scope === "EDUCATION" && !fields.educationId)) {
      return;
    }

    let active = true;
    quizService.getEligiblePreTests(fields.scope, fields.educationId || undefined)
      .then((items) => {
        if (active) setEligiblePreTests(items);
      })
      .catch(() => {
        if (active) setEligiblePreTests([]);
      })
      .finally(() => {
        if (active) setIsLoadingPreTests(false);
      });
    return () => { active = false; };
  }, [fields.type, fields.scope, fields.educationId]);

  const handleChange = useCallback((key: keyof QuestionnaireFormFields, val: unknown) => {
    if (key === "scope" || key === "educationId" || key === "type") {
      setEligiblePreTests([]);
      setIsLoadingPreTests(true);
    }
    setFields((prev) => {
      const updated = { ...prev, [key]: val };
      if (key === "scope" && val !== prev.scope) {
        if (val === "APPLICATION") {
          updated.educationId = "";
          updated.categories = [
            { ...createEmptyCategory("Pertanyaan DSMQR", "DSMQR"), questions: [{ ...createEmptyQuestion(), choices: createInstrumentChoices("DSMQR") }] },
            { ...createEmptyCategory("Pertanyaan DSMES", "DSMES"), questions: [{ ...createEmptyQuestion(), choices: createInstrumentChoices("DSMES") }] },
          ];
        } else {
          updated.categories = [createEmptyCategory("Soal Kuesioner Edukasi", "PRE_TEST")];
        }
      }
      if ((key === "scope" || key === "educationId" || key === "type") && val !== prev[key]) {
        updated.sourcePreTestId = "";
      }
      return updated;
    });
  }, []);

  const handleQuestionImageChange = useCallback(
    (catIndex: number, qIndex: number, url: string) => {
      setFields((prev) => {
        const updatedCats = [...prev.categories];
        const cat = updatedCats[catIndex];
        const updatedQuestions = [...cat.questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], questionImageUrl: url };
        updatedCats[catIndex] = { ...cat, questions: updatedQuestions };
        return { ...prev, categories: updatedCats };
      });
    },
    []
  );

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
      const instrumentCategory = updatedCats[catIndex].instrumentCategory;
      const question = createEmptyQuestion();
      if (instrumentCategory === "DSMQR" || instrumentCategory === "DSMES") {
        question.choices = createInstrumentChoices(instrumentCategory);
      }
      updatedCats[catIndex] = {
        ...updatedCats[catIndex],
        questions: [...updatedCats[catIndex].questions, question],
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

  const handleChoiceScoreChange = useCallback((catIndex: number, qIndex: number, choiceIndex: number, value: string) => {
    setFields((prev) => {
      const categories = [...prev.categories];
      const category = categories[catIndex];
      const questions = [...category.questions];
      const question = questions[qIndex];
      const choices = [...question.choices];
      choices[choiceIndex] = { ...choices[choiceIndex], scoreValue: value === "" ? undefined : Number(value) };
      questions[qIndex] = { ...question, choices };
      categories[catIndex] = { ...category, questions };
      return { ...prev, categories };
    });
  }, []);

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

      if (fields.scope === "EDUCATION" && !fields.educationId) {
        showToast({
          type: "error",
          title: "Validasi Gagal",
          description: "Pilih Materi Edukasi Terkait untuk Kuesioner.",
        });
        return;
      }

      if (fields.type === "POST_TEST" && !fields.sourcePreTestId) {
        showToast({
          type: "error",
          title: "Validasi Gagal",
          description: "Pilih Pre-Test yang akan dipasangkan.",
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
          instrumentCategory: cat.instrumentCategory || "PRE_TEST",
        };
      });

      // Copied post-tests get categories from selected pre-test on server.
      const shouldCopyQuestions = fields.type === "POST_TEST" && fields.copyQuestionsFromPreTest;
      for (let cIdx = 0; !shouldCopyQuestions && cIdx < formattedCategories.length; cIdx++) {
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
              description: `Soal #${qIdx + 1} pada kategori "${cat.title}" belum memiliki teks pertanyaan.`,
            });
            return;
          }

          const hasValidChoice = q.choices.some((c) => c.optionText.trim().length > 0);
          if (!hasValidChoice) {
            showToast({
              type: "error",
              title: "Validasi Gagal",
              description: `Soal #${qIdx + 1} pada kategori "${cat.title}" harus memiliki minimal 1 pilihan jawaban bertuliskan teks.`,
            });
            return;
          }

          if (fields.scope === "EDUCATION") {
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
          categories: shouldCopyQuestions ? [] : formattedCategories,
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
    eligiblePreTests,
    isLoadingPreTests,
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
    handleChoiceScoreChange,
    setCorrectChoice,
    handleQuestionImageChange,
    save,
    cancel,
  };
}
