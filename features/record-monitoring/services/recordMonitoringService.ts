import { axiosInstance } from "@/lib/axios";
import type { PatientMeasurement } from "@/types/patient";
import type {
  PatientRecord,
  PatientListParams,
  PaginationMeta,
  BloodSugarLog,
  MealLog,
  ActivityLog,
  MedicationLog,
  RecordMonitoringStats,
  PatientActivityAnalyticsResponse,
} from "../types/record";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapPatientRecord = (data: any): PatientRecord => {
  let age = 50;
  if (data.date_of_birth) {
    const dob = new Date(data.date_of_birth);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const emergencyContact = data.emergency_phone
    ? `${data.emergency_phone} (${data.emergency_relation ?? "Keluarga"})`
    : "-";

  const bloodSugar = data.latest_blood_sugar ? `${data.latest_blood_sugar} mg/dL` : "-";

  let bloodSugarTime = "-";
  if (data.latest_blood_sugar_time) {
    const bsDate = new Date(data.latest_blood_sugar_time);
    const today = new Date();
    const isToday = bsDate.toDateString() === today.toDateString();
    if (isToday) {
      bloodSugarTime = bsDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    } else {
      bloodSugarTime = bsDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) +
        " " + bsDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    }
  }

  // Show meal type and food name
  const mealTypeLabel = data.latest_meal_type
    ? (data.latest_meal_type === "sarapan" ? "Sarapan" :
      data.latest_meal_type === "makan_siang" ? "Makan Siang" :
      data.latest_meal_type === "makan_malam" ? "Makan Malam" : "Cemilan")
    : null;

  const meal = data.latest_meal_name || (data.latest_meal_type ? (data.latest_meal_calories > 0 ? `${Math.round(data.latest_meal_calories)} kcal` : mealTypeLabel ?? "-") : "-");
  const mealType = data.latest_meal_name
    ? (mealTypeLabel ? `${mealTypeLabel}${data.latest_meal_calories > 0 ? ` • ${Math.round(data.latest_meal_calories)} kcal` : ''}` : "-")
    : (mealTypeLabel ?? "-");

  // Activity: show activity name + relative time
  let activity = "-";
  let activityType = "-";
  if (data.latest_activity_name) {
    activity = data.latest_activity_name;
    if (data.latest_activity_time) {
      const actDate = new Date(data.latest_activity_time);
      const today = new Date();
      const diffMs = today.getTime() - actDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        activityType = actDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      } else if (diffDays === 1) {
        activityType = "Kemarin";
      } else {
        activityType = actDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      }
    }
  }

  const rawBsType = (data.latest_blood_sugar_type || "").toLowerCase();
  let bloodSugarMeasurementLabel = "";
  if (rawBsType === "fasting" || rawBsType === "puasa") {
    bloodSugarMeasurementLabel = "Puasa";
  } else if (rawBsType === "before_meal" || rawBsType === "sebelum_makan") {
    bloodSugarMeasurementLabel = "Sebelum Makan";
  } else if (rawBsType === "after_meal" || rawBsType === "sesudah_makan") {
    bloodSugarMeasurementLabel = "2 Jam Sesudah Makan";
  } else if (rawBsType === "before_bed" || rawBsType === "sebelum_tidur") {
    bloodSugarMeasurementLabel = "Sebelum Tidur";
  } else if (rawBsType === "random" || rawBsType === "sewaktu") {
    bloodSugarMeasurementLabel = "Sewaktu";
  } else if (data.latest_blood_sugar) {
    bloodSugarMeasurementLabel = "Sewaktu";
  }

  // Classification comes from the backend ClassifyBloodGlucose() — single source of truth.
  const backendCategory = (data.latest_blood_sugar_status ?? "").toLowerCase();
  // Map the backend category to an Indonesian display label.
  const statusLabels: Record<string, string> = {
    hypoglycemia: "Hipoglikemia",
    low_warning: "Waspada Rendah",
    normal: "Normal",
    target: "Normal",
    prediabetes: "Waspada",
    elevated: "Waspada",
    hyperglycemia: "Hiperglikemia",
  };
  let status: string = statusLabels[backendCategory] ?? "";
  if (!status && data.latest_blood_sugar) {
    status = "Normal";
  }

  const initials = data.full_name
    ? data.full_name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()
    : "P";

  const doctor = data.assigned_staff?.full_name ?? "-";
  const puskesmas = data.health_facility ?? data.assigned_staff?.position_title ?? "-";
  const registeredAt = data.created_at
    ? new Date(data.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "-";

  return {
    id: data.id,
    name: data.full_name,
    age,
    gender: data.gender === "laki_laki" ? "Laki-laki" : "Perempuan",
    dateOfBirth: data.date_of_birth ?? "-",
    address: data.address ?? "-",
    initials,
    puskesmas,
    avatarUrl: data.profile_photo_url || undefined,
    lastActive: data.latest_activity_time
      ? new Date(data.latest_activity_time).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
      : "Hari ini",
    diagnosisDate: data.diagnosis_date ?? "-",
    emergencyContact,
    dailyCalorieTarget: data.daily_calorie_target,
    compliance: data.compliance ?? 0,
    complianceLabel: data.compliance_label || undefined,
    complianceBreakdown: data.compliance_breakdown ? {
      bloodSugarScore: data.compliance_breakdown.blood_sugar_score ?? 0,
      foodScore: data.compliance_breakdown.food_score ?? 0,
      activityScore: data.compliance_breakdown.activity_score ?? 0,
      medicationScore: data.compliance_breakdown.medication_score ?? 0,
    } : undefined,
    lastActiveAt: data.last_active_at,
    whatsapp: data.whatsapp_number ?? "-",
    height: data.height_cm ?? 0,
    weight: data.weight_kg ?? 0,
    bloodType: data.blood_type ?? "-",
    registeredAt,
    interventionType: data.intervention_type ?? "-",
    diabetesType: data.diabetes_type ?? "-",
    doctor,
    email: data.email ?? "-",
    district: data.district ?? "-",
    city: data.city ?? "-",
    livingArrangement: data.living_arrangement ?? "-",
    educationLevel: data.education_level ?? "-",
    diabetesDuration: data.diabetes_duration ?? "-",
    accountStatus: data.status === "aktif" || data.status === "Aktif" ? "Terverifikasi" : "Belum Terverifikasi",
    nik: data.nik ?? "-",
    bpjs: data.bpjs ?? "-",
    emergencyName: data.emergency_name ?? "-",
    emergencyRelation: data.emergency_relation ?? "-",
    emergencyPhone: data.emergency_phone ?? "-",
    patientCode: data.patient_code ?? "-",
    currentMedication: data.current_medication ?? "-",
    allergies: data.allergies ?? "-",
    smokingStatus: data.smoking_status ?? "-",
    physicalActivityLevel: data.physical_activity_level ?? "-",
    latestBloodSugar: data.latest_blood_sugar,
    averageBloodSugar: data.average_blood_sugar,
    latestWeight: data.latest_weight,
    bmi: data.bmi,
    latestActivityTime: data.latest_activity_time,
    latestActivityName: data.latest_activity_name,
    calorieStatusInfo: data.calorie_status_info ? {
      targetCalories: data.calorie_status_info.target_calories || 0,
      consumedCalories: data.calorie_status_info.consumed_calories ?? 0,
      achievementPercentage: data.calorie_status_info.achievement_percentage ?? 0,
      calorieDifference: data.calorie_status_info.calorie_difference ?? 0,
      calorieDifferenceStr: data.calorie_status_info.calorie_difference_str ?? "0 kcal",
      calorieStatus: data.calorie_status_info.calorie_status ?? "Asupan Sangat Rendah",
      calorieStatusCode: data.calorie_status_info.calorie_status_code ?? "very_low",
      calorieDescription: data.calorie_status_info.calorie_description ?? "-",
    } : undefined,
    measurements: Array.isArray(data.measurements)
      ? data.measurements.map(mapBackendMeasurementToFrontend)
      : undefined,
    latestMeasurement: data.latest_measurement
      ? mapBackendMeasurementToFrontend(data.latest_measurement)
      : undefined,
    dailySummary: {
      bloodSugar,
      bloodSugarTime,
      bloodSugarMeasurementType: rawBsType,
      bloodSugarMeasurementLabel,
      meal,
      mealType,
      activity,
      activityType,
      status,
      bloodSugarStatus: data.latest_blood_sugar_status,
      avgBloodSugar: data.average_blood_sugar,
    },
  };
};

export const recordMonitoringService = {
  async getPatientRecords(params: PatientListParams = {}, rolePrefix: 'admin' | 'staff' = 'staff'): Promise<{ items: PatientRecord[]; pagination: PaginationMeta }> {
    const res = await axiosInstance.get(`/${rolePrefix}/patients`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        gender: params.gender || undefined,
        status: params.status || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
        blood_sugar_status: params.blood_sugar_status || undefined,
        risk_level: params.risk_level || undefined,
        compliance_min: params.compliance_min,
        compliance_max: params.compliance_max,
        age_min: params.age_min,
        age_max: params.age_max,
      },
    });
    const list = res.data?.data ?? [];
    const rawMeta = res.data?.meta ?? {};
    const meta: PaginationMeta = {
      page: rawMeta.page ?? 1,
      per_page: rawMeta.per_page ?? params.limit ?? 10,
      total: rawMeta.total ?? 0,
      total_pages: rawMeta.total_pages ?? 0,
    };
    return {
      items: list.map(mapPatientRecord),
      pagination: meta,
    };
  },

  async getPatientRecordById(id: string, rolePrefix: 'admin' | 'staff' = 'staff'): Promise<PatientRecord | null> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/patients/${id}`);
      if (res.data?.data) {
        return mapPatientRecord(res.data.data);
      }
      return null;
    } catch {
      return null;
    }
  },

  async getBloodSugarLogs(patientId: string, rolePrefix: 'admin' | 'staff' = 'staff'): Promise<BloodSugarLog[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/patients/${patientId}/blood-sugar`, { params: { limit: 100 } });
    const list = res.data?.data ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.map((log: any) => {
      const d = log.measured_at ? new Date(log.measured_at) : new Date();
      const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

      const mType = log.measurement_time_type || "random";
      let measurementTimeLabel = log.measurement_time_label;
      if (!measurementTimeLabel || measurementTimeLabel.includes("(")) {
        if (mType === "fasting" || mType === "puasa") measurementTimeLabel = "Puasa";
        else if (mType === "before_meal" || mType === "sebelum_makan") measurementTimeLabel = "Sebelum Makan";
        else if (mType === "after_meal" || mType === "sesudah_makan") measurementTimeLabel = "2 Jam Sesudah Makan";
        else if (mType === "before_bed" || mType === "sebelum_tidur") measurementTimeLabel = "Sebelum Tidur";
        else measurementTimeLabel = "Sewaktu";
      }

      return {
        id: log.id,
        date: dateStr,
        time: timeStr,
        glucoseValue: log.glucose_value ?? 0,
        measurementTimeType: mType,
        measurementTimeLabel,
        status: log.category || log.status || "normal",
        classificationLabel: log.category_label || log.classification_label || "Normal",
        severity: log.severity || "normal",
        referenceMin: log.reference_min,
        referenceMax: log.reference_max,
        referenceRangeText: log.reference_range_text,
        recommendation: log.recommendation,
        colorIndicator: log.color_indicator,
        measuredAt: log.measured_at,
        rawDate: d,
        before: (mType === "before_meal" || mType === "sebelum_makan") ? log.glucose_value : 0,
        after: (mType === "after_meal" || mType === "sesudah_makan") ? log.glucose_value : 0,
      };
    }).sort((a: BloodSugarLog, b: BloodSugarLog) => (b.rawDate?.getTime() ?? 0) - (a.rawDate?.getTime() ?? 0));
  },

  async getMealLogs(patientId: string, rolePrefix: 'admin' | 'staff' = 'staff', date?: string): Promise<MealLog[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/patients/${patientId}/meals`, { params: { limit: 100, date: date || undefined } });
    const list = res.data?.data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.map((log: any) => {
      const loggedDate = new Date(log.logged_at);
      const timeStr = loggedDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      const dateStr = loggedDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

      let type: "Sarapan" | "Siang" | "Cemilan" | "Malam" = "Sarapan";
      if (log.meal_type === "makan_siang") type = "Siang";
      else if (log.meal_type === "makan_malam") type = "Malam";
      else if (log.meal_type === "cemilan") type = "Cemilan";

      return {
        id: log.id,
        type,
        title: `${log.food?.name ?? "Makanan"} (${dateStr})`,
        time: timeStr,
        calories: Math.round((log.food?.calories ?? 0) * (log.portion_multiplier ?? 1)),
      };
    });
  },

  async getActivityLogs(patientId: string, rolePrefix: 'admin' | 'staff' = 'staff', date?: string): Promise<ActivityLog[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/patients/${patientId}/activities`, { params: { limit: 100, date: date || undefined } });
    const list = res.data?.data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.map((log: any) => {
      const loggedDate = log.logged_at ? new Date(log.logged_at) : new Date();
      const dateStr = loggedDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      const timeStr = loggedDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

      let intensity: "Ringan" | "Sedang" | "Berat" = "Ringan";
      if (log.intensity === "sedang") intensity = "Sedang";
      else if (log.intensity === "berat") intensity = "Berat";

      return {
        id: log.id,
        name: log.activity_name || log.descriptive_name || "Aktivitas Fisik",
        time: `${dateStr}, ${timeStr}`,
        intensity,
        duration: Number(log.duration_minutes) || 0,
        caloriesBurned: Math.round(log.calories_burned ?? 0),
        rawDate: loggedDate,
      };
    });
  },

  async getMedicationLogs(patientId: string, rolePrefix: 'admin' | 'staff' = 'staff', date?: string): Promise<MedicationLog[]> {
    const res = await axiosInstance.get(`/${rolePrefix}/patients/${patientId}/medications`, { params: { limit: 100, date: date || undefined } });
    const list = res.data?.data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.map((log: any) => {
      let status: "Diminum" | "Terlewat" | "Mendatang" = "Mendatang";
      if (log.status === "selesai") status = "Diminum";
      else if (log.status === "terlewat") status = "Terlewat";

      const logDate = log.logged_date ? new Date(log.logged_date) : new Date();
      const dateGroup = logDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", weekday: "short" });

      let sched = log.scheduled_time || "08:00";
      if (sched.length >= 5) {
        sched = sched.substring(0, 5) + " WIB";
      }

      return {
        id: log.id || log.reminder_id,
        name: log.activity_name || "Catatan Minum Obat",
        dosage: log.notes || log.dosage || "Sesuai Petunjuk",
        time: `Jadwal: ${sched}`,
        status,
        dateGroup,
      };
    });
  },

  async getStats(rolePrefix: 'admin' | 'staff' = 'staff'): Promise<RecordMonitoringStats> {
    const res = await axiosInstance.get(`/${rolePrefix}/dashboard/stats`);
    const d = res.data?.data ?? {};
    return {
      totalBloodSugarRecords: d.total_sugar_logs ?? 0,
      totalMealRecords: d.total_meal_logs ?? 0,
      totalActivityRecords: d.total_activity_logs ?? 0,
      totalMedicationRecords: d.total_medication_logs ?? 0,
    };
  },

  async getActivityAnalytics(patientId: string, rolePrefix: 'admin' | 'staff' = 'staff', days: number = 7): Promise<PatientActivityAnalyticsResponse | null> {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/patients/${patientId}/activity-analytics?days=${days}`);
      const d = res.data?.data;
      if (!d) return null;
      return {
        totalRecords: d.total_records ?? 0,
        bloodSugar: {
          count: d.blood_sugar?.count ?? 0,
          percentage: d.blood_sugar?.percentage ?? 0,
        },
        food: {
          count: d.food?.count ?? 0,
          percentage: d.food?.percentage ?? 0,
        },
        physicalActivity: {
          count: d.physical_activity?.count ?? 0,
          percentage: d.physical_activity?.percentage ?? 0,
        },
        medication: {
          count: d.medication?.count ?? 0,
          percentage: d.medication?.percentage ?? 0,
        },
        mostUsed: d.most_used || "-",
        leastUsed: d.least_used || "-",
      };
    } catch {
      return null;
    }
  },
} as const;
