"use client";

import PlanSection from "@/components/PlanSection";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PlanModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* TU PRICING REAL */}
        <div className="p-6">
          <PlanSection selectable />
        </div>

      </div>
    </div>
  );
}