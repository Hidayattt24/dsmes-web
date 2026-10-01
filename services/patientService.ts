import { axiosInstance } from "@/lib/axios";
import type { Patient, PatientStats, PatientMeasurement } from "@/types/patient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendPatientToFrontend(p: any): Patient {
  const fullName = (p.full_name ?? "") as string;
  const names = fullName ? fullName.split(" ") : ["P"];
  const initials = names.map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  let age = 0;
  if (p.date_of_birth) {
    const dob = new Date(p.date_of_birth as string);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const assignedStaff = p.assigned_staff as Record<string, unknown> | undefined;
  const doctor = (assignedStaff?.full_name as string) ?? "-";
  const puskesmas = (p.health_facility as string) ?? (assignedStaff?.position_title as string) ?? "-";

  const patientStatus = (p.status as string) ?? "";
  const calorieInfo = p.calorie_status_info as Record<string, unknown> | undefined;

  return {
    id: String(p.id),
    name: (p.full_name as string) ?? "",
    age,
    gender: (p.gender as string) === "laki_laki" || (p.gender as string) === "Laki-laki" ? "Laki-laki" : "Perempuan",
    status: patientStatus === "aktif" || patientStatus === "Aktif" ? "Aktif" : "Nonaktif",
    lastActive: p.last_active_at ? new Date(p.last_active_at as string).toLocaleDateString("id-ID") : "Belum aktif",
    initials,
    whatsapp: (p.whatsapp_number as string) ?? "",
    height: (p.height_cm as number) ?? 0,
    weight: (p.weight_kg as number) ?? 0,
    bloodType: ((p.blood_type as string) ?? "O") as "A" | "B" | "AB" | "O",
    registeredAt: p.created_at ? new Date(p.created_at as string).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "",
    compliance: (p.compliance as number) ?? 0,
    interventionType: ((p.intervention_type as string) ?? "Mobile App") as "Mobile App" | "Web App",
    diabetesType: (p.diabetes_type as string) ?? "Diabetes Tipe 2",
    doctor,
    puskesmas,
    treatmentFacility: (p.treatment_facility as string) ?? "",
    address: (p.address as string) ?? "",
    email: (p.email as string) ?? "",
    dateOfBirth: (p.date_of_birth as string) ?? "",
    district: (p.district as string) ?? "",
    city: (p.city as string) ?? "",
    livingArrangement: (p.living_arrangement as string) ?? "",
    educationLevel: (p.education_level as string) ?? "",
    diabetesDuration: (p.diabetes_duration as string) ?? "",
    accountStatus: patientStatus === "aktif" || patientStatus === "Aktif" ? "Terverifikasi" : "Belum Terverifikasi",
    nik: (p.nik as string) ?? "",
    bpjs: (p.bpjs as string) ?? "",
    emergencyName: (p.emergency_name as string) ?? "",
    emergencyRelation: (p.emergency_relation as string) ?? "",
    emergencyPhone: (p.emergency_phone as string) ?? "",
    avatarUrl: (p.profile_photo_url as string) || undefined,
    
    patientCode: (p.patient_code as string) ?? "",
    diagnosisDate: (p.diagnosis_date as string) ?? "",
    currentMedication: (p.current_medication as string) ?? "",
    allergies: (p.allergies as string) ?? "",
    smokingStatus: (p.smoking_status as string) ?? "",
    physicalActivityLevel: (p.physical_activity_level as string) ?? "",

    latestBloodSugar: p.latest_blood_sugar as number | undefined,
    averageBloodSugar: p.average_blood_sugar as number | undefined,
    latestWeight: p.latest_weight as number | undefined,
    bmi: p.bmi as number | undefined,
    waistCircumferenceCm: p.waist_circumference_cm as number | undefined,
    dailyCalorieTarget: p.daily_calorie_target as number | undefined,
    latestActivityTime: p.latest_activity_time as string | undefined,
    latestActivityName: p.latest_activity_name as string | undefined,
    calorieStatusInfo: calorieInfo ? {
      targetCalories: (calorieInfo.target_calories as number) || 0,
      consumedCalories: (calorieInfo.consumed_calories as number) ?? 0,
      achievementPercentage: (calorieInfo.achievement_percentage as number) ?? 0,
      calorieDifference: (calorieInfo.calorie_difference as number) ?? 0,
      calorieDifferenceStr: (calorieInfo.calorie_difference_str as string) ?? "0 kcal",
      calorieStatus: (calorieInfo.calorie_status as string) ?? "Asupan Sangat Rendah",
      calorieStatusCode: (calorieInfo.calorie_status_code as string) ?? "very_low",
      calorieDescription: (calorieInfo.calorie_description as string) ?? "-",
    } : undefined,
    measurements: Array.isArray(p.measurements)
      ? (p.measurements as Array<Record<string, unknown>>).map(mapBackendMeasurementToFrontend)
      : undefined,
    latestMeasurement: p.latest_measurement
      ? mapBackendMeasurementToFrontend(p.latest_measurement as Record<string, unknown>)
      : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendMeasurementToFrontend(m: any): PatientMeasurement {
  return {
    id: m.id,
    patientId: m.patient_id,
    weightKg: m.weight_kg,
    heightCm: m.height_cm,
    bmi: m.bmi,
    bloodPressureSystolic: m.blood_pressure_systolic,
    bloodPressureDiastolic: m.blood_pressure_diastolic,
    bloodSugar: m.blood_sugar,
    bloodSugarTimeType: m.blood_sugar_time_type || m.measurement_time_type || "fasting",
    waistCircumferenceCm: m.waist_circumference_cm,
    dailyCalorieTarget: m.daily_calorie_target,
    notes: m.notes,
    recordedById: m.recorded_by_id,
    recordedByName: m.recorded_by_name ?? "System",
    recordedByRole: m.recorded_by_role ?? "admin",
    measuredAt: m.measured_at,
    createdAt: m.created_at,
  };
}

export const patientService = {
  /** Fetch patients with backend filtering and pagination */
  async getPatients(params?: {
    search?: string;
    gender?: string;
    status?: string;
    compliance_min?: number;
    compliance_max?: number;
    page?: number;
    limit?: number;
  }): Promise<{ patients: Patient[]; total: number }> {
    const res = await axiosInstance.get("/admin/patients", { params });
    const items = res.data?.data ?? [];
    const total = res.data?.meta?.total ?? items.length;
    return {
      patients: items.map(mapBackendPatientToFrontend),
      total,
    };
  },

  /** Fetch a specific patient by ID */
  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const res = await axiosInstance.get(`/admin/patients/${id}`);
      if (res.data?.success && res.data?.data) {
        return mapBackendPatientToFrontend(res.data.data);
      }
      return null;
    } catch {
      return null;
    }
  },

  /** Fetch statistics summary for the patient metrics */
  async getPatientStats(): Promise<PatientStats> {
    try {
      const res = await axiosInstance.get("/admin/patients/stats");
      const data = res.data?.data;
      let youngest = data?.youngest_age ?? 0;
      let oldest = data?.oldest_age ?? 0;

      // Fallback: If stats returns 0 (e.g., pending backend restart), compute from patient list
      if ((!youngest || !oldest) && (data?.total_patients ?? 0) > 0) {
        const patientsRes = await patientService.getPatients({ limit: 100 });
        const ages = patientsRes.patients
          .map((p) => p.age)
          .filter((a) => typeof a === "number" && a > 0);
        if (ages.length > 0) {
          youngest = Math.min(...ages);
          oldest = Math.max(...ages);
        }
      }

      return {
        totalPatients: data?.total_patients ?? 0,
        activePatients: data?.active_patients ?? 0,
        youngestAge: youngest,
        oldestAge: oldest,
      };
    } catch {
      return { totalPatients: 0, activePatients: 0, youngestAge: 0, oldestAge: 0 };
    }
  },

  /** Fetch patient blood sugar history */
  async getPatientBloodSugar(id: string): Promise<Record<string, unknown>[]> {
    const res = await axiosInstance.get(`/admin/patients/${id}/blood-sugar`, { params: { limit: 100 } });
    return res.data?.data ?? [];
  },

  /** Fetch patient meal logs (past 30 days) */
  async getPatientMeals(id: string): Promise<Record<string, unknown>[]> {
    const res = await axiosInstance.get(`/admin/patients/${id}/meals`);
    return res.data?.data ?? [];
  },

  /** Fetch patient activities timeline */
  async getPatientActivities(id: string): Promise<Record<string, unknown>[]> {
    const res = await axiosInstance.get(`/admin/patients/${id}/activities`);
    return res.data?.data ?? [];
  },

  /** Fetch patient education activities */
  async getPatientEducationActivities(id: string): Promise<unknown> {
    try {
      const res = await axiosInstance.get(`/admin/patients/${id}/activities/education`);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  /** Fetch health measurements history for a patient */
  async getPatientMeasurements(id: string, rolePrefix: 'admin' | 'staff' = 'admin'): Promise<PatientMeasurement[]> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/patients/${id}/measurements`);
      const data = res.data?.data;
      if (Array.isArray(data)) {
        return data.map(mapBackendMeasurementToFrontend);
      }
      return [];
    } catch {
      return [];
    }
  },

  /** Create a new health measurement record as Admin */
  async createPatientMeasurement(id: string, data: Record<string, unknown>): Promise<PatientMeasurement | null> {
    const res = await axiosInstance.post(`/admin/patients/${id}/measurements`, data);
    if (res.data?.success && res.data?.data) {
      return mapBackendMeasurementToFrontend(res.data.data);
    }
    return null;
  },

  /** Update patient personal & health info as Admin */
  async updatePatientByAdmin(id: string, data: Record<string, unknown>): Promise<Patient | null> {
    const res = await axiosInstance.put(`/admin/patients/${id}`, data);
    if (res.data?.success && res.data?.data) {
      return mapBackendPatientToFrontend(res.data.data);
    }
    return null;
  },
} as const;
