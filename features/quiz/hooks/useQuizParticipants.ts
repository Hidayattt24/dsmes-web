"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { quizService } from "../services/quizService";
import type { Quiz, QuizParticipant, QuestionnairePair, QuestionnaireComparisonRow } from "../types/quiz";

interface UseQuizParticipantsReturn {
  readonly quiz: Quiz | null;
  readonly participants: readonly QuizParticipant[];
  readonly pair: QuestionnairePair | null;
  readonly comparison: readonly QuestionnaireComparisonRow[] | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly searchQuery: string;
  readonly setSearchQuery: (q: string) => void;
  readonly refetch: () => Promise<void>;
}

export function useQuizParticipants(quizId: string): UseQuizParticipantsReturn {
  const pathname = usePathname();
  const rolePrefix: 'admin' | 'staff' = pathname.startsWith("/admin") ? "admin" : "staff";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [participants, setParticipants] = useState<readonly QuizParticipant[]>([]);
  const [pair, setPair] = useState<QuestionnairePair | null>(null);
  const [comparison, setComparison] = useState<readonly QuestionnaireComparisonRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [quizDetail, pList, pairDetail, comparisonRows] = await Promise.all([
        quizService.getQuizById(quizId, rolePrefix),
        quizService.getParticipantsByQuizId(quizId, rolePrefix),
        quizService.getQuizPair(quizId, rolePrefix),
        quizService.getQuizComparison(quizId, rolePrefix),
      ]);
      if (quizDetail) {
        setQuiz(quizDetail);
        setParticipants(pList);
        setPair(pairDetail);
        setComparison(comparisonRows);
      } else {
        setError("Kuesioner tidak ditemukan.");
      }
    } catch {
      setError("Gagal memuat data partisipan kuesioner.");
    } finally {
      setIsLoading(false);
    }
  }, [quizId, rolePrefix]);

  useEffect(() => {
    if (quizId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [quizId, fetchData]);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const query = searchQuery.toLowerCase();
      return (
        p.patientName.toLowerCase().includes(query) ||
        p.patientId.toLowerCase().includes(query) ||
        p.puskesmas.toLowerCase().includes(query)
      );
    });
  }, [participants, searchQuery]);

  return {
    quiz,
    participants: filteredParticipants,
    pair,
    comparison,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetch: fetchData,
  };
}
