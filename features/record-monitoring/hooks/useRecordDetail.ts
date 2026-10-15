"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { recordMonitoringService } from "../services/recordMonitoringService";
import { patientService } from "@/services/patientService";
import type {
  PatientRecord,
  BloodSugarLog,
  MealLog,
  ActivityLog,
  MedicationLog,
  PatientActivityAnalyticsResponse,
} from "../types/record";

interface UseRecordDetailReturn {
  readonly patient: PatientRecord | null;
  readonly bloodSugarLogs: BloodSugarLog[];
  readonly mealLogs: MealLog[];
  readonly activityLogs: ActivityLog[];
  readonly medicationLogs: MedicationLog[];
  readonly activityAnalytics: PatientActivityAnalyticsResponse | null;
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
  readonly analyticsDays: number;
  readonly setAnalyticsDays: (days: number) => void;
  readonly isAnalyticsLoading: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => void;
  readonly mealDate: string;
  readonly setMealDate: (date: string) => void;
  readonly activityDate: string;
  readonly setActivityDate: (date: string) => void;
  readonly medicationDate: string;
  readonly setMedicationDate: (date: string) => void;
  readonly isMealLoading: boolean;
  readonly isActivityLoading: boolean;
  readonly isMedicationLoading: boolean;
}

const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function useRecordDetail(patientId: string): UseRecordDetailReturn {
  const pathname = usePathname();
  const rolePrefix: 'admin' | 'staff' = pathname.startsWith("/staff") ? "staff" : "admin";

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [bloodSugarLogs, setBloodSugarLogs] = useState<BloodSugarLog[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [activityAnalytics, setActivityAnalytics] = useState<PatientActivityAnalyticsResponse | null>(null);
  const [appUsage, setAppUsage] = useState<{
    totalSeconds: number;
    totalFormatted: string;
    dailyUsages: {
      date: string;
      totalSeconds: number;
      totalFormatted: string;
      sessionCount: number;
    }[];
  } | null>(null);
  const [analyticsDays, setAnalyticsDays] = useState<number>(7);

  const [mealDate, setMealDate] = useState<string>(getTodayStr());
  const [activityDate, setActivityDate] = useState<string>(getTodayStr());
  const [medicationDate, setMedicationDate] = useState<string>(getTodayStr());

  const [isLoading, setIsLoading] = useState(true);
  const [isMealLoading, setIsMealLoading] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [isMedicationLoading, setIsMedicationLoading] = useState(false);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const p = await recordMonitoringService.getPatientRecordById(patientId, rolePrefix);
      if (!p) {
        setError("Pasien tidak ditemukan.");
        return;
      }

      const [bs, meals, acts, meds, analytics, usage] = await Promise.all([
        recordMonitoringService.getBloodSugarLogs(patientId, rolePrefix),
        recordMonitoringService.getMealLogs(patientId, rolePrefix, mealDate),
        recordMonitoringService.getActivityLogs(patientId, rolePrefix, activityDate),
        recordMonitoringService.getMedicationLogs(patientId, rolePrefix, medicationDate),
        recordMonitoringService.getActivityAnalytics(patientId, rolePrefix, analyticsDays),
        patientService.getPatientAppUsage(patientId, rolePrefix),
      ]);

      setPatient(p);
      setBloodSugarLogs(bs);
      setMealLogs(meals);
      setActivityLogs(acts);
      setMedicationLogs(meds);
      setActivityAnalytics(analytics);
      setAppUsage(usage);
    } catch {
      setError("Gagal memuat detail catatan monitoring.");
    } finally {
      setIsLoading(false);
    }
  }, [patientId, rolePrefix, mealDate, activityDate, medicationDate, analyticsDays]);

  useEffect(() => {
    if (patientId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleSetMealDate = useCallback((date: string) => {
    setMealDate(date);
    if (!patientId) return;
    setIsMealLoading(true);
    recordMonitoringService.getMealLogs(patientId, rolePrefix, date)
      .then(setMealLogs)
      .finally(() => setIsMealLoading(false));
  }, [patientId, rolePrefix]);

  const handleSetActivityDate = useCallback((date: string) => {
    setActivityDate(date);
    if (!patientId) return;
    setIsActivityLoading(true);
    recordMonitoringService.getActivityLogs(patientId, rolePrefix, date)
      .then(setActivityLogs)
      .finally(() => setIsActivityLoading(false));
  }, [patientId, rolePrefix]);

  const handleSetMedicationDate = useCallback((date: string) => {
    setMedicationDate(date);
    if (!patientId) return;
    setIsMedicationLoading(true);
    recordMonitoringService.getMedicationLogs(patientId, rolePrefix, date)
      .then(setMedicationLogs)
      .finally(() => setIsMedicationLoading(false));
  }, [patientId, rolePrefix]);

  const handleSetAnalyticsDays = useCallback((days: number) => {
    setAnalyticsDays(days);
    if (!patientId) return;
    setIsAnalyticsLoading(true);
    recordMonitoringService.getActivityAnalytics(patientId, rolePrefix, days)
      .then(setActivityAnalytics)
      .finally(() => setIsAnalyticsLoading(false));
  }, [patientId, rolePrefix]);

  return {
    patient,
    bloodSugarLogs,
    mealLogs,
    activityLogs,
    medicationLogs,
    activityAnalytics,
    appUsage,
    analyticsDays,
    setAnalyticsDays: handleSetAnalyticsDays,
    isAnalyticsLoading,
    isLoading,
    error,
    refetch: fetchData,
    mealDate,
    setMealDate: handleSetMealDate,
    activityDate,
    setActivityDate: handleSetActivityDate,
    medicationDate,
    setMedicationDate: handleSetMedicationDate,
    isMealLoading,
    isActivityLoading,
    isMedicationLoading,
  };
}
