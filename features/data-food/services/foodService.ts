import { axiosInstance } from "@/lib/axios";
import type {
  FoodMaster,
  CreateFoodDTO,
  UpdateFoodDTO,
  FoodListParams,
  ExcelImportPreviewResponse,
  ExcelImportConfirmResponse,
  FoodStats,
  FoodRequest,
  FoodRequestStats,
  FoodRequestListParams,
  ApproveFoodProposalDTO,
} from "@/features/data-food/types/food";

export const foodService = {
  getFoods: async (params?: FoodListParams) => {
    const res = await axiosInstance.get("/admin/foods", { params });
    const meta = res.data.meta || res.data.pagination || {};
    return {
      data: (res.data.data as FoodMaster[]) || [],
      pagination: {
        total_items: meta.total ?? meta.total_items ?? res.data.data?.length ?? 0,
        current_page: meta.page ?? meta.current_page ?? params?.page ?? 1,
        per_page: meta.per_page ?? params?.limit ?? 20,
        total_pages: meta.total_pages ?? 1,
      },
    };
  },

  getFoodById: async (id: string): Promise<FoodMaster> => {
    const res = await axiosInstance.get(`/admin/foods/${id}`);
    return res.data.data;
  },

  createFood: async (data: CreateFoodDTO): Promise<FoodMaster> => {
    const res = await axiosInstance.post("/admin/foods", data);
    return res.data.data;
  },

  updateFood: async (id: string, data: UpdateFoodDTO): Promise<FoodMaster> => {
    const res = await axiosInstance.put(`/admin/foods/${id}`, data);
    return res.data.data;
  },

  deleteFood: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/foods/${id}`);
  },

  previewImport: async (file: File): Promise<ExcelImportPreviewResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/admin/foods/import/preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  confirmImport: async (items: CreateFoodDTO[]): Promise<ExcelImportConfirmResponse> => {
    const res = await axiosInstance.post("/admin/foods/import/confirm", { items });
    return res.data.data;
  },

  exportFoods: async (params?: FoodListParams, format: "xlsx" | "csv" = "xlsx") => {
    const res = await axiosInstance.get("/admin/foods/export", {
      params: { ...params, format },
      responseType: "blob",
    });
    return res.data;
  },

  getStats: async (): Promise<FoodStats> => {
    const res = await axiosInstance.get("/admin/foods/stats");
    return res.data.data;
  },

  getFoodRequests: async (params?: FoodRequestListParams) => {
    const res = await axiosInstance.get("/admin/food-requests", { params });
    const meta = res.data.meta || res.data.pagination || {};
    return {
      data: (res.data.data as FoodRequest[]) || [],
      pagination: {
        total_items: meta.total ?? meta.total_items ?? res.data.data?.length ?? 0,
        current_page: meta.page ?? meta.current_page ?? params?.page ?? 1,
        per_page: meta.per_page ?? params?.limit ?? 20,
        total_pages: meta.total_pages ?? 1,
      },
    };
  },

  getFoodRequestStats: async (): Promise<FoodRequestStats> => {
    const res = await axiosInstance.get("/admin/food-requests/stats");
    return res.data.data;
  },

  approveFoodRequest: async (id: string, data: ApproveFoodProposalDTO): Promise<FoodMaster> => {
    const res = await axiosInstance.post(`/admin/food-requests/${id}/approve`, data);
    return res.data.data;
  },

  rejectFoodRequest: async (id: string, reason: string): Promise<void> => {
    await axiosInstance.post(`/admin/food-requests/${id}/reject`, { reason });
  },
};

