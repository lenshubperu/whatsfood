"use client";

import { X, Pencil } from "lucide-react";

type Props = {
  name: string;
  number?: string;
  holder?: string;
  active: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  onEdit?: () => void; // 👈 NUEVO
  color: string;
  icon: React.ReactNode;
};

export default function PaymentCard({
  name,
  number,
  holder,
  active,
  onToggle,
  onDelete,
  onEdit,
  color,
  icon,
}: Props) {
  return (
    <div
      className={`
        w-full flex items-center justify-between
        p-4 sm:p-5 rounded-2xl border transition-all duration-300
        ${color}
        ${active ? "opacity-100 scale-[1]" : "opacity-60 scale-[0.98]"}
        hover:scale-[1.01]
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* ICON */}
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>

        {/* INFO */}
        <div className="space-y-0.5">
          <p className="font-semibold text-base">{name}</p>

          {number && (
            <p className="text-sm text-gray-600">
              Número: {number}
            </p>
          )}

          {holder && (
            <p className="text-sm text-gray-600">
              Titular: {holder}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* EDIT */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // 🔥 evita conflicto
              onEdit();
            }}
            className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center hover:bg-blue-100 transition"
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {/* TOGGLE */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 importante
            onToggle();
          }}
          className={`
            w-12 h-6 rounded-full transition relative
            ${active ? "bg-green-500" : "bg-gray-300"}
          `}
        >
          <div
            className={`
              absolute top-1 w-4 h-4 bg-white rounded-full transition
              ${active ? "right-1" : "left-1"}
            `}
          />
        </button>

        {/* DELETE */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // 🔥 importante
              onDelete();
            }}
            className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center hover:bg-red-100 transition"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}