export interface Patient {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly gender: "Laki-laki" | "Perempuan";
  readonly status: "Aktif" | "Nonaktif";
  readonly lastActive: string;
  readonly initials: string;
  readonly whatsapp: string;
  readonly height: number;
  readonly weight: number;
  readonly bloodType: "A" | "B" | "AB" | "O";
  readonly registeredAt: string;
  readonly compliance: number; // e.g. 85 for 85%
  readonly todayCompliance?: number;
  readonly todayComplianceLabel?: string;
  readonly todayComplianceBreakdown?: {
    readonly bloodSugarScore: number;
    readonly foodScore: number;
    readonly activityScore: number;
    readonly medicationScore: number;
  };
  readonly weeklyCompliance?: number;
  readonly weeklyComplianceLabel?: string;
  readonly interventionType: "Mobile App" | "Web App";
  readonly diabetesType: string;
  readonly doctor: string;
  readonly puskesmas: string;
  readonly treatmentFacility: string;
  readonly address: string;
  readonly email: string;
  readonly dateOfBirth: string;
  readonly district: string;
  readonly city: string;
  readonly livingArrangement: string;
  readonly educationLevel: string;
  readonly diabetesDuration: string;
  readonly accountStatus: "Terverifikasi" | "Menunggu" | "Belum Terverifikasi";
  
  // NIK & BPJS
  readonly nik: string;
  readonly bpjs: string;

  // Emergency Contact
  readonly emergencyName: string;
  readonly emergencyRelation: string;
  readonly emergencyPhone: string;

  // Avatar Image URL
  readonly avatarUrl?: string;

  // Extended Information
  readonly patientCode?: string;
  readonly diagnosisDate?: string;
  readonly currentMedication?: string;
  readonly allergies?: string;
  readonly smokingStatus?: string;
  readonly physicalActivityLevel?: string;

  // Summary Stats & Measurements
  readonly latestBloodSugar?: number;
  readonly latestBloodSugarStatus?: string;
  readonly latestBloodSugarClassificationLabel?: string;
  readonly latestBloodSugarColor?: string;
  readonly latestBloodSugarType?: string;
  readonly latestBloodSugarReferenceRange?: string;
  readonly averageBloodSugar?: number;
  readonly latestWeight?: number;
  readonly bmi?: number;
  readonly waistCircumferenceCm?: number;
  readonly latestActivityTime?: string;
  readonly latestActivityName?: string;
  readonly calorieStatusInfo?: CalorieStatusInfo;
  readonly dailyCalorieTarget?: number;
  readonly measurements?: PatientMeasurement[];
  readonly latestMeasurement?: PatientMeasurement;
}

export interface PatientMeasurement {
  readonly id: string;
  readonly patientId: string;
  readonly weightKg?: number;
  readonly heightCm?: number;
  readonly bmi?: number;
  readonly bloodPressureSystolic?: number;
  readonly bloodPressureDiastolic?: number;
  readonly bloodSugar?: number;
  readonly bloodSugarTimeType?: string;
  readonly waistCircumferenceCm?: number;
  readonly dailyCalorieTarget?: number;
  readonly notes?: string;
  readonly recordedById?: string;
  readonly recordedByName: string;
  readonly recordedByRole: "admin" | "patient" | string;
  readonly measuredAt: string;
  readonly createdAt: string;
}

export interface CalorieStatusInfo {
  readonly targetCalories: number;
  readonly consumedCalories: number;
  readonly achievementPercentage: number;
  readonly calorieDifference: number;
  readonly calorieDifferenceStr: string;
  readonly calorieStatus: string;
  readonly calorieStatusCode: "excellent" | "slightly_below" | "below" | "very_low" | "above" | "excessive" | string;
  readonly calorieDescription: string;
}

export interface PatientStats {
  readonly totalPatients: number;
  readonly activePatients: number;
  readonly youngestAge: number;
  readonly oldestAge: number;
}
