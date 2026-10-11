export interface FoodMaster {
  id: string;
  name: string;
  manufacturer: string;
  serving_size: string;

  energy_kcal: number;
  protein_g: number;
  carbohydrate_g: number;
  fat_g: number;
  sugar_g: number;
  sodium_mg: number;
  fiber_g: number;
  saturated_fat_g: number;

  energy_percentage_dv: number;
  protein_percentage_dv: number;
  carbohydrate_percentage_dv: number;
  fat_percentage_dv: number;
  sodium_percentage_dv: number;

  total_fat: number;
  saturated_fat: number;
  sodium: number;
  protein: number;
  total_carbohydrate: number;
  dietary_fiber: number;
  energy: number;

  nutrition_basis?: 'PER_100G' | 'PER_SERVING' | 'PER_PACKAGE' | 'UNVERIFIED';
  source: string;
  barcode: string;
  image_url: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateFoodDTO {
  name: string;
  manufacturer?: string;
  serving_size: string;
  energy_kcal: number;
  protein_g: number;
  carbohydrate_g: number;
  fat_g: number;
  sugar_g?: number;
  sodium_mg?: number;
  fiber_g?: number;
  saturated_fat_g?: number;

  energy_percentage_dv?: number;
  protein_percentage_dv?: number;
  carbohydrate_percentage_dv?: number;
  fat_percentage_dv?: number;
  sodium_percentage_dv?: number;

  total_fat?: number;
  saturated_fat?: number;
  sodium?: number;
  protein?: number;
  total_carbohydrate?: number;
  dietary_fiber?: number;
  energy?: number;

  nutrition_basis?: 'PER_100G' | 'PER_SERVING' | 'PER_PACKAGE' | 'UNVERIFIED';
  source?: string;
  barcode?: string;
  image_url?: string;
  status?: 'active' | 'inactive';
}

export type UpdateFoodDTO = Partial<CreateFoodDTO>;

export interface FoodListParams {
  q?: string;
  manufacturer?: string;
  min_calories?: number;
  max_calories?: number;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ExcelImportRow {
  row_index: number;
  is_valid: boolean;
  errors: string[];
  data: CreateFoodDTO;
}

export interface ExcelImportPreviewResponse {
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  rows: ExcelImportRow[];
}

export interface ExcelImportConfirmResponse {
  success_count: number;
  failed_count: number;
}

export interface FoodStats {
  total_foods: number;
  today_imported_foods: number;
  total_manufacturers: number;
  active_foods: number;
}
