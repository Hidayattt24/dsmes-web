"use client";

import { useEffect, useState } from "react";
import { patientService } from "@/services/patientService";
import type { Patient } from "@/types/patient";

interface UsePatientDetailReturn {
  readonly patient: Patient | null;
  readonly bloodSugar: Record<string, unknown>[];
  readonly meals: Record<string, unknown>[];
  readonly activities: Record<string, unknown>[];
  readonly educationActivities: unknown;
  readonly appUsage: {
    totalSeconds: number;
    totalFormatted: string;
    dailyUsages: {
      date: string;
      totalSeconds: number;
      totalFormatted: string;
      sessionCount: number;
    }[];
  } | null;
  readonly appUsageError: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => void;
}

export function usePatientDetail(id: string): UsePatientDetailReturn {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [bloodSugar, setBloodSugar] = useState<Record<string, unknown>[]>([]);
  const [meals, setMeals] = useState<Record<string, unknown>[]>([]);
  const [activities, setActivities] = useState<Record<string, unknown>[]>([]);
  const [educationActivities, setEducationActivities] = useState<unknown>(null);
  const [appUsage, setAppUsage] = useState<UsePatientDetailReturn["appUsage"]>(null);
  const [appUsageError, setAppUsageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const [patientData, bsData, mealsData, actData, eduActData] = await Promise.all([
        patientService.getPatientById(id),
        patientService.getPatientBloodSugar(id),
        patientService.getPatientMeals(id),
        patientService.getPatientActivities(id),
        patientService.getPatientEducationActivities(id),
      ]);
      if (patientData) {
        setPatient(patientData);
        setBloodSugar(bsData);
        setMeals(mealsData);
        setActivities(actData);
        setEducationActivities(eduActData);
        try {
          setAppUsageError(null);
          setAppUsage(await patientService.getPatientAppUsage(id, "admin"));
        } catch {
          setAppUsage(null);
          setAppUsageError("Gagal memuat durasi penggunaan aplikasi.");
        }
      } else {
        setError("Pasien tidak ditemukan.");
      }
    } catch {
      setError("Gagal memuat detail pasien.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchPatient();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    patient,
    bloodSugar,
    meals,
    activities,
    educationActivities,
    appUsage,
    appUsageError,
    isLoading,
    error,
    refetch: fetchPatient,
  };
}
