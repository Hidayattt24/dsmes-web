import type { CalorieStatusInfo, PatientMeasurement } from "@/types/patient";

export interface DailySummary {
  readonly bloodSugar: string;
  readonly bloodSugarTime: string;
  readonly bloodSugarMeasurementType?: string;
  readonly bloodSugarMeasurementLabel?: string;
  readonly meal: string;
  readonly mealType: string;
  readonly activity: string;
  readonly activityType: string;
  /** Diagnostic category from the backend ClassifyBloodGlucose() — e.g. "Normal", "Prediabetes", "Hyperglycemia". */
  readonly status: string;
  readonly bloodSugarStatus?: string;
  readonly avgBloodSugar?: number;
}

export interface PatientRecord {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly gender: "Laki-laki" | "Perempuan";
  readonly dateOfBirth: string;
  readonly address: string;
  readonly initials: string;
  readonly puskesmas: string;
  readonly district: string;
  readonly city: string;
  readonly livingArrangement: string;
  readonly educationLevel: string;
  readonly diabetesDuration: string;
  readonly avatarUrl?: string;
  readonly lastActive: string;
  readonly dailySummary: DailySummary;
  readonly diagnosisDate: string;
  readonly emergencyContact: string;
  readonly dailyCalorieTarget?: number;
  readonly compliance: number;
  readonly complianceLabel?: string;
  readonly complianceBreakdown?: ComplianceBreakdown;
  readonly lastActiveAt?: string;

  readonly whatsapp: string;
  readonly height: number;
  readonly weight: number;
  readonly bloodType: string;
  readonly registeredAt: string;
  readonly interventionType: string;
  readonly diabetesType: string;
  readonly doctor: string;
  readonly email: string;
  readonly accountStatus: string;
  readonly nik: string;
  readonly bpjs: string;
  readonly emergencyName: string;
  readonly emergencyRelation: string;
  readonly emergencyPhone: string;
  readonly patientCode: string;
  readonly currentMedication: string;
  readonly allergies: string;
  readonly smokingStatus: string;
  readonly physicalActivityLevel: string;
  readonly latestBloodSugar?: number;
  readonly averageBloodSugar?: number;
  readonly latestWeight?: number;
  readonly bmi?: number;
  readonly latestActivityTime?: string;
  readonly latestActivityName?: string;
  readonly calorieStatusInfo?: CalorieStatusInfo;
  readonly measurements?: PatientMeasurement[];
  readonly latestMeasurement?: PatientMeasurement;
}

export type { CalorieStatusInfo };

export interface PaginationMeta {
  readonly page: number;
  readonly per_page: number;
  readonly total: number;
  readonly total_pages: number;
}

export interface PatientListResponse {
  readonly items: PatientRecord[];
  readonly pagination: PaginationMeta;
}

export interface BloodSugarLog {
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly glucoseValue: number;
  readonly measurementTimeType: string;
  readonly measurementTimeLabel: string;
  readonly status: string;
  readonly classificationLabel?: string;
  readonly severity?: string;
  readonly referenceMin?: number;
  readonly referenceMax?: number;
  readonly referenceRangeText?: string;
  readonly recommendation?: string;
  readonly colorIndicator?: string;
  readonly measuredAt?: string;
  readonly before?: number;
  readonly after?: number;
  readonly rawDate?: Date;
}

export interface MealLog {
  readonly id: string;
  readonly type: "Sarapan" | "Siang" | "Cemilan" | "Malam";
  readonly title: string;
  readonly time: string;
  readonly calories: number;
}

export interface ActivityLog {
  readonly id: string;
  readonly name: string;
  readonly time: string;
  readonly intensity: "Ringan" | "Sedang" | "Berat";
  readonly duration: number;
  readonly caloriesBurned: number;
  readonly rawDate?: Date;
}

export interface MedicationLog {
  readonly id: string;
  readonly name: string;
  readonly dosage: string;
  readonly time: string;
  readonly status: "Diminum" | "Terlewat" | "Mendatang";
  readonly dateGroup: string;
}

export interface RecordMonitoringStats {
  readonly totalBloodSugarRecords: number;
  readonly totalMealRecords: number;
  readonly totalActivityRecords: number;
  readonly totalMedicationRecords: number;
}

export interface ComplianceBreakdown {
  readonly bloodSugarScore: number;
  readonly foodScore: number;
  readonly activityScore: number;
  readonly medicationScore: number;
}

export interface ActivityAnalyticsItem {
  readonly count: number;
  readonly percentage: number;
}

export interface PatientActivityAnalyticsResponse {
  readonly totalRecords: number;
  readonly bloodSugar: ActivityAnalyticsItem;
  readonly food: ActivityAnalyticsItem;
  readonly physicalActivity: ActivityAnalyticsItem;
  readonly medication: ActivityAnalyticsItem;
  readonly mostUsed: string;
  readonly leastUsed: string;
}

export interface PatientListParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly gender?: string;
  readonly status?: string;
  readonly sort_by?: string;
  readonly sort_order?: string;
  readonly blood_sugar_status?: string;
  readonly risk_level?: string;
  readonly compliance_min?: number;
  readonly compliance_max?: number;
  readonly age_min?: number;
  readonly age_max?: number;
}

