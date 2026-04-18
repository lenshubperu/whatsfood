"use client";

import { Search, Filter } from "lucide-react";

export default function ProductsFilters({
  search,
  setSearch,
  category,
  setCategory,
  showHidden,
  setShowHidden,
  categories,
}: {
  search: string;
  setSearch: (v: string) => void;

  category: string;
  setCategory: (v: string) => void;

  showHidden: boolean;
  setShowHidden: (v: boolean) => void;

  categories: string[];
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-3">

      {/* 🔍 SEARCH */}
      <div className="flex-1 relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="
            w-full pl-10 pr-4 py-3 rounded-xl
            bg-muted border border-border
            focus:outline-none focus:ring-2 focus:ring-green-500/20
          "
        />
      </div>

      {/* 🧠 CATEGORY */}
      <div className="flex items-center gap-2 bg-muted border border-border px-4 py-3 rounded-xl">
        <Filter className="w-4 h-4 text-muted-foreground" />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-transparent outline-none text-sm"
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 👁 OCULTOS */}
      <button
        onClick={() => setShowHidden(!showHidden)}
        className={`
          px-4 py-3 rounded-xl text-sm font-medium transition
          ${
            showHidden
              ? "bg-green-600 text-white"
              : "bg-muted border border-border text-muted-foreground"
          }
        `}
      >
        {showHidden ? "Ocultos activos" : "Ver ocultos"}
      </button>
    </div>
  );
}