"use client";

import React from "react";
import { Select } from "@/components/ui/Select";

interface Props {
  readonly searchQuery: string;
  readonly statusFilter: string;
  readonly onSearchChange: (q: string) => void;
  readonly onStatusChange: (status: string) => void;
}

export function FoodFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: Props) {
  const statusOptions = [
    { value: "", label: "Semua Status", icon: "tune" },
    { value: "active", label: "Aktif", icon: "check_circle" },
    { value: "inactive", label: "Nonaktif", icon: "pause_circle" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096] text-xl select-none">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama makanan, merk, atau barcode..."
          className="w-full pl-10 pr-4 h-12 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-1 focus:ring-[#3B67FC] focus:border-[#3B67FC] focus:bg-white transition-all font-[family-name:var(--font-poppins)]"
        />
      </div>

      {/* Custom Select Component */}
      <div className="w-full md:w-64 justify-end">
        <Select
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusChange}
          placeholder="Filter Status"
        />
      </div>
    </div>
  );
}
