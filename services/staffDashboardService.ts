import { axiosInstance } from "@/lib/axios";

export interface StaffDashboardStats {
  readonly total_assigned_patients: number;
  readonly active_assigned_patients: number;
  readonly total_attempts: number;
  readonly average_blood_sugar: number;
  readonly stability_percentage: number;
  readonly glucose_distribution: {
    readonly hypoglycemia_count: number;
    readonly normal_count: number;
    readonly prediabetes_count: number;
    readonly elevated_count: number;
    readonly hyperglycemia_count: number;
  };
  readonly priority_patients: readonly PriorityPatientResponse[];
  readonly non_compliant_patients: readonly PriorityPatientResponse[];
}

export interface PriorityPatientResponse {
  readonly id: string;
  readonly full_name: string;
  readonly nickname: string;
  readonly email: string;
  readonly whatsapp_number: string;
  readonly diabetes_type: string;
  readonly compliance: number;
  readonly last_active_at: string | null;
  readonly priority_reason: string;
  readonly latest_glucose: number | null;
  readonly latest_glucose_status: string;
}

export interface PopulationMetricsResponse {
  readonly food_intake: readonly FoodIntakeItemResponse[];
  readonly physical_activity: readonly PhysicalActivityItemResponse[];
  readonly medication_adherence: readonly AdherenceItemResponse[];
  readonly food_patients: readonly PatientContributionResponse[];
  readonly activity_patients: readonly PatientContributionResponse[];
  readonly medication_patients: readonly PatientContributionResponse[];
}

export interface PatientContributionResponse {
  readonly patient_id: string;
  readonly full_name: string;
  readonly profile_photo_url?: string;
  readonly count: number;
}

export interface FoodIntakeItemResponse {
  readonly category: string;
  readonly percentage: number;
  readonly count: number;
  readonly color: string;
}

export interface PhysicalActivityItemResponse {
  readonly level: string;
  readonly count: number;
}

export interface AdherenceItemResponse {
  readonly label: string;
  readonly percentage: number;
  readonly count: number;
  readonly color: string;
}

export interface TrendPatientResponse {
  readonly id: string;
  readonly full_name: string;
  readonly nickname: string;
  readonly avg_start: number;
  readonly avg_current: number;
  readonly increase: number;
  readonly percentage_increase: number;
}

export const staffDashboardService = {
  async getStats(): Promise<StaffDashboardStats> {
    const res = await axiosInstance.get("/staff/dashboard/stats");
    return res.data?.data ?? {};
  },

  async getPopulationMetrics(range: number = 7): Promise<PopulationMetricsResponse> {
    const res = await axiosInstance.get("/staff/dashboard/population-metrics", {
      params: { range },
    });
    return res.data?.data ?? {};
  },

  async getPatientTrends(range: number = 7): Promise<readonly TrendPatientResponse[]> {
    const res = await axiosInstance.get("/staff/dashboard/patient-trends", {
      params: { range },
    });
    return res.data?.data ?? [];
  },
} as const;
