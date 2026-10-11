"use client";

import React from "react";
import type { FoodMaster } from "@/features/data-food/types/food";

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly food: FoodMaster | null;
}

export function FoodDetailModal({ isOpen, onClose, food }: Props) {
  if (!isOpen || !food) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-[family-name:var(--font-poppins)]">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F4F1] text-[#00695C] flex items-center justify-center font-bold text-lg">
              {food.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C]">{food.name}</h3>
              <p className="text-xs font-medium text-[#718096]">
                {food.manufacturer || "Tanpa Merk"} &bull; {food.serving_size}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A0AEC0] hover:text-[#1A202C] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl select-none">close</span>
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="bg-[#F0F9F8] border border-[#00695C]/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-[#00695C]">
                Total Kalori (Energi)
              </span>
              <h2 className="text-3xl font-extrabold text-[#00695C]">
                {food.energy_kcal} <span className="text-sm font-bold">kcal</span>
              </h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-[#00695C] select-none">
              local_fire_department
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-xs text-[#718096] font-semibold">Protein</span>
              <p className="text-lg font-extrabold text-[#1A202C] mt-0.5 font-mono">
                {food.protein_g} g
              </p>
            </div>
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-xs text-[#718096] font-semibold">Karbohidrat Total</span>
              <p className="text-lg font-extrabold text-[#1A202C] mt-0.5 font-mono">
                {food.carbohydrate_g} g
              </p>
            </div>
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-xs text-[#718096] font-semibold">Lemak Total</span>
              <p className="text-lg font-extrabold text-[#1A202C] mt-0.5 font-mono">
                {food.fat_g} g
              </p>
            </div>
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-xs text-[#718096] font-semibold">Gula</span>
              <p className="text-lg font-extrabold text-[#1A202C] mt-0.5 font-mono">
                {food.sugar_g} g
              </p>
            </div>
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-xs text-[#718096] font-semibold">Natrium / Sodium</span>
              <p className="text-lg font-extrabold text-[#1A202C] mt-0.5 font-mono">
                {food.sodium_mg} mg
              </p>
            </div>
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-xs text-[#718096] font-semibold">Serat Pangan</span>
              <p className="text-lg font-extrabold text-[#1A202C] mt-0.5 font-mono">
                {food.fiber_g} g
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] text-xs text-[#718096] space-y-1 font-medium">
            <p>
              <span className="font-bold text-[#1A202C]">Basis Nilai Gizi:</span>{" "}
              {food.nutrition_basis === "PER_SERVING"
                ? "Per Sajian (Serving)"
                : food.nutrition_basis === "PER_PACKAGE"
                ? "Per Kemasan"
                : food.nutrition_basis === "UNVERIFIED"
                ? "Perlu Verifikasi (Basis Tidak Diketahui)"
                : "Per 100 gram"}
            </p>
            <p>
              <span className="font-bold text-[#1A202C]">Sumber Data:</span>{" "}
              {food.source === "excel_import"
                ? "Impor File Excel"
                : food.source === "manual"
                ? "Input Form Manual"
                : food.source || "Input Form Manual"}
            </p>
            {food.barcode && <p><span className="font-bold text-[#1A202C]">Barcode:</span> {food.barcode}</p>}
            <p><span className="font-bold text-[#1A202C]">Tanggal Dibuat:</span> {food.created_at}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-right">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-xl border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#F8FAFC] text-xs font-bold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
