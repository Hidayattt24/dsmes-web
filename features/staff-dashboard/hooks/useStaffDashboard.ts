import { useState, useEffect, useCallback } from "react";
import { staffDashboardService } from "@/services/staffDashboardService";
import type {
  StaffDashboardStats,
  PriorityPatientResponse,
  TrendPatientResponse,
  PhysicalActivityItemResponse,
  PatientContributionResponse,
} from "@/services/staffDashboardService";

export type TimeRange = 7 | 30 | 90;

export interface DashboardSummaryCardData {
  readonly label: string;
  readonly value: string | number;
  readonly change: string;
  readonly isPositive: boolean;
  readonly icon: string;
  readonly variant: "primary" | "muted" | "warning" | "error";
  readonly progressBar?: number;
}

export interface FoodIntakeItem {
  readonly category: string;
  readonly percentage: number;
  readonly count: number;
  readonly color: string;
}

export interface PhysicalActivityItem {
  readonly level: string;
  readonly count: number;
}

export interface AdherenceItem {
  readonly label: string;
  readonly percentage: number;
  readonly color: string;
  readonly count: number;
}

export interface PatientContribution {
  readonly patientId: string;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly count: number;
}

export interface PriorityPatient {
  readonly id: string;
  readonly name: string;
  readonly diabetesType?: string;
  readonly bloodSugar: number | null;
  readonly glucoseStatus: string;
  readonly reason: string;
  readonly compliance: number;
  readonly lastActiveAt: string | null;
}

export interface TrendPatient {
  readonly id: string;
  readonly name: string;
  readonly avgStart: number;
  readonly avgCurrent: number;
  readonly increase: number;
  readonly percentageIncrease: number;
}

function mapPriorityPatient(p: PriorityPatientResponse): PriorityPatient {
  return {
    id: p.id,
    name: p.full_name,
    diabetesType: p.diabetes_type,
    bloodSugar: p.latest_glucose,
    glucoseStatus: p.latest_glucose_status,
    reason: p.priority_reason,
    compliance: p.compliance,
    lastActiveAt: p.last_active_at,
  };
}

function mapTrendPatient(p: TrendPatientResponse): TrendPatient {
  return {
    id: p.id,
    name: p.full_name,
    avgStart: p.avg_start,
    avgCurrent: p.avg_current,
    increase: p.increase,
    percentageIncrease: p.percentage_increase,
  };
}

function mapPatientContribution(p: PatientContributionResponse): PatientContribution {
  return {
    patientId: p.patient_id,
    name: p.full_name,
    avatarUrl: p.profile_photo_url || undefined,
    count: p.count,
  };
}

function buildSummaryCards(stats: StaffDashboardStats | null): DashboardSummaryCardData[] {
  if (!stats) return [];
  const highGlucose = stats.glucose_distribution.prediabetes_count + stats.glucose_distribution.elevated_count + stats.glucose_distribution.hyperglycemia_count;
  return [
    {
      label: "Total Pasien Terdaftar",
      value: stats.total_assigned_patients,
      change: "Data terkini",
      isPositive: true,
      icon: "group",
      variant: "primary",
    },
    {
      label: "Pasien Perlu Perhatian",
      value: highGlucose,
      change: `${stats.glucose_distribution.hyperglycemia_count} hiperglikemia, ${stats.glucose_distribution.hypoglycemia_count} hipoglikemia`,
      isPositive: false,
      icon: "warning",
      variant: "error",
    },
    {
      label: "Rata-rata Gula Darah",
      value: `${Math.round(stats.average_blood_sugar)} mg/dL`,
      change: "Rata-rata keseluruhan",
      isPositive: stats.average_blood_sugar <= 140,
      icon: "analytics",
      variant: stats.average_blood_sugar <= 140 ? "primary" : "warning",
    },
    {
      label: "Pasien Terkendali",
      value: `${stats.stability_percentage.toFixed(1)}%`,
      change: `${stats.stability_percentage >= 80 ? "Terkendali baik" : "Perlu perhatian"}`,
      isPositive: stats.stability_percentage >= 80,
      icon: "verified",
      variant: stats.stability_percentage >= 80 ? "primary" : "warning",
      progressBar: Math.round(stats.stability_percentage),
    },
  ];
}

export function useStaffDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<StaffDashboardStats | null>(null);

  const [foodIntake, setFoodIntake] = useState<readonly FoodIntakeItem[]>([]);
  const [physicalActivity, setPhysicalActivity] = useState<readonly PhysicalActivityItem[]>([]);
  const [medicationAdherence, setMedicationAdherence] = useState<readonly AdherenceItem[]>([]);

  const [foodPatients, setFoodPatients] = useState<readonly PatientContribution[]>([]);
  const [activityPatients, setActivityPatients] = useState<readonly PatientContribution[]>([]);
  const [medicationPatients, setMedicationPatients] = useState<readonly PatientContribution[]>([]);

  const [priorityPatients, setPriorityPatients] = useState<readonly PriorityPatient[]>([]);
  const [trendPatients, setTrendPatients] = useState<readonly TrendPatient[]>([]);

  const [hasError, setHasError] = useState(false);

  const [foodRange, setFoodRange] = useState<TimeRange>(7);
  const [activityRange, setActivityRange] = useState<TimeRange>(7);
  const [adherenceRange, setAdherenceRange] = useState<TimeRange>(7);
  const [trendRange, setTrendRange] = useState<TimeRange>(7);

  // Fetch all dashboard data on mount — each request is independent
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const s = await staffDashboardService.getStats();
        if (cancelled) return;
        setStats(s);
        setHasError(false);
        setPriorityPatients((s.priority_patients ?? []).map(mapPriorityPatient));
      } catch {
        if (!cancelled) setHasError(true);
      }

      try {
        const metrics = await staffDashboardService.getPopulationMetrics(7);
        if (cancelled) return;
        setFoodIntake(metrics.food_intake);
        setPhysicalActivity(metrics.physical_activity.map((a: PhysicalActivityItemResponse) => ({ level: a.level, count: a.count })));
        setMedicationAdherence(metrics.medication_adherence);
        setFoodPatients((metrics.food_patients ?? []).map(mapPatientContribution));
        setActivityPatients((metrics.activity_patients ?? []).map(mapPatientContribution));
        setMedicationPatients((metrics.medication_patients ?? []).map(mapPatientContribution));
      } catch {
        // Population metrics error handled silently
      }

      try {
        const trends = await staffDashboardService.getPatientTrends(7);
        if (cancelled) return;
        setTrendPatients(trends.map(mapTrendPatient));
      } catch {
        // Patient trends error handled silently
      }

      if (!cancelled) setIsLoading(false);
    }

    fetchAll();

    return () => { cancelled = true; };
  }, []);

  const updateFoodRange = useCallback(async (range: TimeRange) => {
    setFoodRange(range);
    const data = await staffDashboardService.getPopulationMetrics(range);
    setFoodIntake(data.food_intake);
    setFoodPatients((data.food_patients ?? []).map(mapPatientContribution));
  }, []);

  const updateActivityRange = useCallback(async (range: TimeRange) => {
    setActivityRange(range);
    const data = await staffDashboardService.getPopulationMetrics(range);
    setPhysicalActivity(data.physical_activity.map((a: PhysicalActivityItemResponse) => ({ level: a.level, count: a.count })));
    setActivityPatients((data.activity_patients ?? []).map(mapPatientContribution));
  }, []);

  const updateAdherenceRange = useCallback(async (range: TimeRange) => {
    setAdherenceRange(range);
    const data = await staffDashboardService.getPopulationMetrics(range);
    setMedicationAdherence(data.medication_adherence);
    setMedicationPatients((data.medication_patients ?? []).map(mapPatientContribution));
  }, []);

  const updateTrendRange = useCallback(async (range: TimeRange) => {
    setTrendRange(range);
    const data = await staffDashboardService.getPatientTrends(range);
    setTrendPatients(data.map(mapTrendPatient));
  }, []);

  const summaryCards = buildSummaryCards(stats);

  return {
    isLoading,
    hasError,
    summaryCards,
    foodIntake,
    physicalActivity,
    medicationAdherence,
    foodPatients,
    activityPatients,
    medicationPatients,
    priorityPatients,
    trendPatients,
    foodRange,
    activityRange,
    adherenceRange,
    trendRange,
    setFoodRange: updateFoodRange,
    setActivityRange: updateActivityRange,
    setAdherenceRange: updateAdherenceRange,
    setTrendRange: updateTrendRange,
  };
}
