"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/common/BackButton";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/components/ui/Toast";
import { Select } from "@/components/ui/Select";
import { FormLoader } from "@/components/ui/loading";
import { foodService } from "@/features/data-food/services/foodService";
import type { CreateFoodDTO, FoodMaster } from "@/features/data-food/types/food";

interface Props {
  readonly foodId?: string;
}

interface FoodFormItem extends CreateFoodDTO {
  tempId: string;
  isExpanded?: boolean;
}

export function FoodFormFeature({ foodId }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const isEditMode = !!foodId;
  const [loadingInitial, setLoadingInitial] = useState<boolean>(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Multi-item state for Create Mode
  const [items, setItems] = useState<FoodFormItem[]>([
    {
      tempId: "item-1",
      name: "",
      manufacturer: "",
      serving_size: "Per 100 g BDD (Berat Dapat Dimakan)",
      energy_kcal: 0,
      protein_g: 0,
      carbohydrate_g: 0,
      fat_g: 0,
      sugar_g: 0,
      sodium_mg: 0,
      fiber_g: 0,
      saturated_fat_g: 0,
      barcode: "",
      source: "manual",
      nutrition_basis: "PER_100G",
      status: "active",
      isExpanded: true,
    },
  ]);

  const nutritionBasisOptions = [
    { value: "PER_100G", label: "Per 100 gram (BDD)", icon: "scale" },
    { value: "PER_SERVING", label: "Per Sajian (Serving)", icon: "restaurant" },
    { value: "PER_PACKAGE", label: "Per Kemasan", icon: "inventory_2" },
  ];

  const statusOptions = [
    { value: "active", label: "Aktif (Dapat Diakses Pasien)", icon: "check_circle" },
    { value: "inactive", label: "Nonaktif (Draft Internal)", icon: "pause_circle" },
  ];

  useEffect(() => {
    if (foodId) {
      foodService
        .getFoodById(foodId)
        .then((food: FoodMaster) => {
          setItems([
            {
              tempId: food.id,
              name: food.name,
              manufacturer: food.manufacturer || "",
              serving_size: food.serving_size,
              energy_kcal: food.energy_kcal,
              protein_g: food.protein_g,
              carbohydrate_g: food.carbohydrate_g,
              fat_g: food.fat_g,
              sugar_g: food.sugar_g || 0,
              sodium_mg: food.sodium_mg || 0,
              fiber_g: food.fiber_g || 0,
              saturated_fat_g: food.saturated_fat_g || 0,
              barcode: food.barcode || "",
              nutrition_basis: food.nutrition_basis || "PER_100G",
              status: food.status,
              isExpanded: true,
            },
          ]);
        })
        .catch(() => {
          showToast({
            type: "error",
            title: "Gagal Memuat",
            description: "Data makanan tidak ditemukan.",
          });
          router.push(ROUTES.DATA_MAKANAN);
        })
        .finally(() => setLoadingInitial(false));
    }
  }, [foodId, router, showToast]);

  const handleAddItem = () => {
    const newItem: FoodFormItem = {
      tempId: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: "",
      manufacturer: "",
      serving_size: "Per 100 g BDD (Berat Dapat Dimakan)",
      energy_kcal: 0,
      protein_g: 0,
      carbohydrate_g: 0,
      fat_g: 0,
      sugar_g: 0,
      sodium_mg: 0,
      fiber_g: 0,
      saturated_fat_g: 0,
      barcode: "",
      source: "manual",
      nutrition_basis: "PER_100G",
      status: "active",
      isExpanded: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      showToast({
        type: "error",
        title: "Peringatan",
        description: "Minimal harus ada 1 baris data makanan.",
      });
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleExpand = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const handleItemChange = (
    index: number,
    field: keyof CreateFoodDTO,
    value: unknown
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: name, manufacturer, serving_size required
    const invalidIndex = items.findIndex(
      (item) => !item.name.trim() || !item.manufacturer?.trim() || !item.serving_size.trim()
    );
    if (invalidIndex !== -1) {
      showToast({
        type: "error",
        title: "Validasi Gagal",
        description: `Baris #${invalidIndex + 1}: Nama makanan, produsen/merk, dan ukuran porsi wajib diisi.`,
      });
      // Expand invalid row
      setItems((prev) =>
        prev.map((item, i) =>
          i === invalidIndex ? { ...item, isExpanded: true } : item
        )
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && foodId) {
        const item = items[0];
        const formattedData: CreateFoodDTO = {
          name: item.name.trim(),
          manufacturer: item.manufacturer?.trim(),
          serving_size: item.serving_size.trim() || "1 porsi (100g)",
          energy_kcal: Number(item.energy_kcal) || 0,
          protein_g: Number(item.protein_g) || 0,
          carbohydrate_g: Number(item.carbohydrate_g) || 0,
          fat_g: Number(item.fat_g) || 0,
          sugar_g: Number(item.sugar_g) || 0,
          sodium_mg: Number(item.sodium_mg) || 0,
          fiber_g: Number(item.fiber_g) || 0,
          saturated_fat_g: Number(item.saturated_fat_g) || 0,
          barcode: item.barcode?.trim(),
          status: item.status || "active",
        };

        await foodService.updateFood(foodId, formattedData);
        showToast({
          type: "success",
          title: "Berhasil Disimpan",
          description: "Data makanan berhasil diperbarui.",
        });
      } else {
        const formattedItems: CreateFoodDTO[] = items.map((item) => ({
          name: item.name.trim(),
          manufacturer: item.manufacturer?.trim(),
          serving_size: item.serving_size.trim() || "1 porsi (100g)",
          energy_kcal: Number(item.energy_kcal) || 0,
          protein_g: Number(item.protein_g) || 0,
          carbohydrate_g: Number(item.carbohydrate_g) || 0,
          fat_g: Number(item.fat_g) || 0,
          sugar_g: Number(item.sugar_g) || 0,
          sodium_mg: Number(item.sodium_mg) || 0,
          fiber_g: Number(item.fiber_g) || 0,
          saturated_fat_g: Number(item.saturated_fat_g) || 0,
          barcode: item.barcode?.trim(),
          status: item.status || "active",
        }));

        await foodService.confirmImport(formattedItems);
        showToast({
          type: "success",
          title: "Berhasil Ditambahkan",
          description: `${formattedItems.length} data makanan baru berhasil disimpan.`,
        });
      }

      router.push(ROUTES.DATA_MAKANAN);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      showToast({
        type: "error",
        title: "Gagal Menyimpan",
        description:
          error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <FormLoader />;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Header & Back Button */}
      <div className="space-y-3">
        <BackButton href={ROUTES.DATA_MAKANAN} label="Kembali ke Data Makanan" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1A202C]">
              {isEditMode ? "Edit Data Makanan" : "Tambah Data Makanan"}
            </h2>
            <p className="text-xs font-medium text-[#718096] mt-1">
              {isEditMode
                ? "Ubah rincian informasi dan kandungan nilai gizi makanan"
                : "Input satu atau sekaligus banyak data makanan baru dalam satu pengiriman"}
            </p>
          </div>

          {!isEditMode && (
            <button
              type="button"
              onClick={handleAddItem}
              className="h-11 px-5 rounded-xl border border-[#00695C] bg-[#F0F9F8] text-[#00695C] hover:bg-[#00695C] hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <span className="material-symbols-outlined text-lg select-none">add</span>
              <span>Tambah Baris Makanan</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Rows List */}
        {items.map((item, index) => (
          <div
            key={item.tempId}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all"
          >
            {/* Card Header Bar */}
            <div
              className={`p-4 flex items-center justify-between border-b border-[#E2E8F0] ${
                item.isExpanded ? "bg-[#F8FAFC]" : "bg-white"
              }`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                onClick={() => handleToggleExpand(index)}
              >
                <div className="w-8 h-8 rounded-xl bg-[#00695C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  #{index + 1}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-[#1A202C] truncate">
                    {item.name || `Makanan Baru #${index + 1}`}
                  </h4>
                  <p className="text-[11px] text-[#718096]">
                    {item.serving_size} &bull; {item.energy_kcal || 0} kcal &bull; Protein: {item.protein_g || 0}g, Karbo: {item.carbohydrate_g || 0}g, Lemak: {item.fat_g || 0}g
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                {!isEditMode && items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    title="Hapus baris ini"
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg select-none">delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleToggleExpand(index)}
                  className="p-2 rounded-lg text-[#718096] hover:bg-[#EDF2F7] transition-all cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-xl transition-transform duration-200 select-none ${
                      item.isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
              </div>
            </div>

            {/* Expandable Form Body */}
            {item.isExpanded && (
              <div className="p-6 space-y-6">
                {/* Section 1: Informasi Dasar */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                    <span className="material-symbols-outlined text-[#00695C] text-lg select-none">
                      restaurant
                    </span>
                    <h5 className="text-xs font-bold text-[#1A202C] uppercase tracking-wider">
                      Informasi Utama
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1.5">
                        Nama Makanan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        placeholder="Contoh: Nasi Goreng Spesial / Ayam Geprek"
                        className="w-full px-4 h-12 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C] focus:bg-white transition-all font-[family-name:var(--font-poppins)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1.5">
                        Produsen / Merk <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={item.manufacturer || ""}
                        onChange={(e) =>
                          handleItemChange(index, "manufacturer", e.target.value)
                        }
                        placeholder="Contoh: Indofood / Masakan Rumah"
                        className="w-full px-4 h-12 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C] focus:bg-white transition-all font-[family-name:var(--font-poppins)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1.5">
                        Ukuran Porsi Standar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={item.serving_size}
                        onChange={(e) =>
                          handleItemChange(index, "serving_size", e.target.value)
                        }
                        placeholder="Contoh: Per 100 g BDD / 1 sachet (75g)"
                        className="w-full px-4 h-12 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C] focus:bg-white transition-all font-[family-name:var(--font-poppins)]"
                      />
                    </div>

                    <div>
                      <Select
                        label="Basis Nilai Gizi *"
                        value={item.nutrition_basis || "PER_100G"}
                        options={nutritionBasisOptions}
                        onChange={(val) => {
                          // Auto-update serving_size when basis changes
                          const updates: Partial<FoodFormItem> = { nutrition_basis: val as FoodFormItem['nutrition_basis'] };
                          if (val === 'PER_100G') {
                            updates.serving_size = 'Per 100 g BDD (Berat Dapat Dimakan)';
                          } else if (val === 'PER_PACKAGE' && (item.serving_size === 'Per 100 g BDD (Berat Dapat Dimakan)' || item.serving_size === '')) {
                            updates.serving_size = 'Per Kemasan';
                          }
                          setItems(prev => prev.map((it, i) => i === index ? { ...it, ...updates } : it));
                        }}
                      />
                      <p className="text-[10px] text-[#718096] mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm select-none">
                          {item.nutrition_basis === 'PER_100G' ? 'nature' : item.nutrition_basis === 'PER_PACKAGE' ? 'inventory_2' : 'restaurant'}
                        </span>
                        {item.nutrition_basis === 'PER_100G'
                          ? 'Data nutrisi per 100g BDD — digunakan untuk makanan umum'
                          : item.nutrition_basis === 'PER_PACKAGE'
                          ? 'Data nutrisi per kemasan — sesuaikan berat kemasan di kolom Ukuran Porsi'
                          : 'Data nutrisi per sajian — isi berat satu sajian di kolom Ukuran Porsi'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1.5">
                        Kode Barcode (Opsional)
                      </label>
                      <input
                        type="text"
                        value={item.barcode || ""}
                        onChange={(e) =>
                          handleItemChange(index, "barcode", e.target.value)
                        }
                        placeholder="8991234567890"
                        className="w-full px-4 h-12 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1A202C] font-mono focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <Select
                        label="Status Publikasi"
                        value={item.status || "active"}
                        options={statusOptions}
                        onChange={(val) => handleItemChange(index, "status", val)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Energi & Makronutrisi Utama */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                    <span className="material-symbols-outlined text-[#00695C] text-lg select-none">
                      local_fire_department
                    </span>
                    <h5 className="text-xs font-bold text-[#1A202C] uppercase tracking-wider">
                      Energi & Makronutrisi Utama
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#F0F9F8] border border-[#00695C]/20">
                      <label className="block text-xs font-bold text-[#00695C] uppercase mb-1">
                        Energi (kcal)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.energy_kcal}
                        onChange={(e) =>
                          handleItemChange(index, "energy_kcal", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-base font-bold text-[#00695C] font-mono focus:outline-none focus:ring-2 focus:ring-[#00695C]"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                      <label className="block text-xs font-bold text-blue-700 uppercase mb-1">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.protein_g}
                        onChange={(e) =>
                          handleItemChange(index, "protein_g", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-base font-bold text-blue-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
                      <label className="block text-xs font-bold text-amber-700 uppercase mb-1">
                        Karbohidrat (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.carbohydrate_g}
                        onChange={(e) =>
                          handleItemChange(index, "carbohydrate_g", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-base font-bold text-amber-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                      <label className="block text-xs font-bold text-rose-700 uppercase mb-1">
                        Lemak Total (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.fat_g}
                        onChange={(e) =>
                          handleItemChange(index, "fat_g", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-base font-bold text-rose-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Rincian Nutrisi Tambahan */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                    <span className="material-symbols-outlined text-[#00695C] text-lg select-none">
                      nutrition
                    </span>
                    <h5 className="text-xs font-bold text-[#1A202C] uppercase tracking-wider">
                      Rincian Tambahan Nutrisi
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1">
                        Gula (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.sugar_g}
                        onChange={(e) =>
                          handleItemChange(index, "sugar_g", e.target.value)
                        }
                        className="w-full px-3.5 h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-semibold text-[#1A202C] font-mono focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1">
                        Natrium / Sodium (mg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.sodium_mg}
                        onChange={(e) =>
                          handleItemChange(index, "sodium_mg", e.target.value)
                        }
                        className="w-full px-3.5 h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-semibold text-[#1A202C] font-mono focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1">
                        Serat Pangan (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.fiber_g}
                        onChange={(e) =>
                          handleItemChange(index, "fiber_g", e.target.value)
                        }
                        className="w-full px-3.5 h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-semibold text-[#1A202C] font-mono focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] mb-1">
                        Lemak Jenuh (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.saturated_fat_g}
                        onChange={(e) =>
                          handleItemChange(index, "saturated_fat_g", e.target.value)
                        }
                        className="w-full px-3.5 h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-semibold text-[#1A202C] font-mono focus:outline-none focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Row Button on Bottom */}
        {!isEditMode && (
          <div className="text-center py-2">
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-4 border-2 border-dashed border-[#00695C]/30 bg-[#F0F9F8]/50 hover:bg-[#F0F9F8] rounded-2xl text-[#00695C] text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl select-none">add_circle</span>
              <span>+ Tambah Baris Makanan Lainnya</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => router.push(ROUTES.DATA_MAKANAN)}
            className="h-12 px-6 rounded-xl border border-[#E2E8F0] bg-white text-[#4A5568] text-sm font-bold hover:bg-[#F8FAFC] transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-8 rounded-xl bg-[#00695C] text-white text-sm font-bold hover:bg-[#004D40] transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-[#00695C]/20 disabled:opacity-50"
          >
            {isSubmitting && (
              <span className="material-symbols-outlined text-lg animate-spin select-none">
                progress_activity
              </span>
            )}
            <span>
              {isEditMode
                ? "Simpan Perubahan"
                : `Simpan ${items.length} Data Makanan`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
