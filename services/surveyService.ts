import { axiosInstance } from "@/lib/axios";
import type {
  CreateSurveyPayload,
  SurveyAnalytics,
  SurveyDetail,
  SurveyListItem,
  SurveyResponseItem,
  UpdateSurveyPayload,
} from "@/types/survey";

export const surveyService = {
  async getSurveys(params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
    isStaff?: boolean;
  }): Promise<{ items: SurveyListItem[]; total: number }> {
    const endpoint = params?.isStaff ? "/staff/surveys" : "/admin/surveys";
    const res = await axiosInstance.get(endpoint, { params });
    const data = res.data?.data;
    const pagination = res.data?.pagination;
    return {
      items: data ?? [],
      total: pagination?.total ?? (data?.length || 0),
    };
  },

  async getSurveyById(id: string, isStaff?: boolean): Promise<SurveyDetail> {
    const endpoint = paramsIsStaff(id, isStaff);
    const res = await axiosInstance.get(endpoint);
    return res.data?.data;
  },

  async createSurvey(payload: CreateSurveyPayload): Promise<SurveyDetail> {
    const res = await axiosInstance.post("/admin/surveys", payload);
    return res.data?.data;
  },

  async updateSurvey(id: string, payload: UpdateSurveyPayload): Promise<SurveyDetail> {
    const res = await axiosInstance.put(`/admin/surveys/${id}`, payload);
    return res.data?.data;
  },

  async deleteSurvey(id: string): Promise<void> {
    await axiosInstance.delete(`/admin/surveys/${id}`);
  },

  async updateStatus(id: string, status?: string, isActive?: boolean): Promise<SurveyDetail> {
    const res = await axiosInstance.patch(`/admin/surveys/${id}/status`, {
      status,
      is_active: isActive,
    });
    return res.data?.data;
  },

  async duplicateSurvey(id: string): Promise<SurveyDetail> {
    const res = await axiosInstance.post(`/admin/surveys/${id}/duplicate`);
    return res.data?.data;
  },

  async getResponses(
    id: string,
    params?: { page?: number; limit?: number; isStaff?: boolean }
  ): Promise<{ items: SurveyResponseItem[]; total: number }> {
    const base = params?.isStaff ? `/staff/surveys/${id}/responses` : `/admin/surveys/${id}/responses`;
    const res = await axiosInstance.get(base, { params });
    const data = res.data?.data;
    const pagination = res.data?.pagination;
    return {
      items: data ?? [],
      total: pagination?.total ?? (data?.length || 0),
    };
  },

  async getAnalytics(id: string, isStaff?: boolean): Promise<SurveyAnalytics> {
    const base = paramsIsStaff(id, isStaff) + "/analytics";
    const res = await axiosInstance.get(base);
    return res.data?.data;
  },

  async exportCSV(id: string, isStaff?: boolean): Promise<void> {
    const base = paramsIsStaff(id, isStaff) + "/export";
    const res = await axiosInstance.get(base, { responseType: "blob" });
    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `survey_export_${id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
  async exportXLSX(id: string): Promise<void> {
    const res = await axiosInstance.get(`/admin/surveys/${id}/export.xlsx`, { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `survey_${id}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};

function paramsIsStaff(id: string, isStaff?: boolean): string {
  return isStaff ? `/staff/surveys/${id}` : `/admin/surveys/${id}`;
}
