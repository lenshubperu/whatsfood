"use client";

import { useEffect, useState } from "react";
import PaymentCard from "./PaymentCard";
import AddPaymentModal from "./AddPaymentModal";
import ConfirmModal from "@/components/ui/ConfirmModal"; // ✅ NUEVO
import {
  Smartphone,
  Banknote,
  CreditCard,
  Landmark,
  GripVertical,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";

// 🧠 DND
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* =========================
   TYPES
========================= */
type Method = {
  id: string;
  type: keyof typeof UI;
  number?: string;
  holder?: string;
  enabled: boolean;
  position?: number;
};

/* =========================
   UI CONFIG
========================= */
const UI = {
  yape: {
    name: "Yape",
    color: "bg-purple-100 border-purple-300",
    icon: <Smartphone className="text-purple-600" />,
  },
  plin: {
    name: "Plin",
    color: "bg-blue-100 border-blue-300",
    icon: <Smartphone className="text-blue-600" />,
  },
  cash: {
    name: "Efectivo",
    color: "bg-green-100 border-green-300",
    icon: <Banknote className="text-green-600" />,
  },
  transfer: {
    name: "Transferencia",
    color: "bg-gray-100 border-gray-300",
    icon: <Landmark className="text-gray-600" />,
  },
  card: {
    name: "Tarjeta",
    color: "bg-pink-100 border-pink-300",
    icon: <CreditCard className="text-pink-600" />,
  },
};

/* =========================
   COMPONENT
========================= */
export default function PaymentMethods() {
  const { business } = useBusinessContext();

  const [methods, setMethods] = useState<Method[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Method | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // 🔥 DELETE MODAL STATE
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (!business) return;

    const init = async () => {
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("business_id", business.id);

      if (!data || data.length === 0) {
        const defaults = ["yape", "plin", "cash", "transfer", "card"];

        await supabase.from("payment_methods").insert(
          defaults.map((type, index) => ({
            business_id: business.id,
            type,
            enabled: false,
            position: index,
          }))
        );
      }

      await load();
    };

    init();
  }, [business]);

  /* =========================
     LOAD
  ========================= */
  const load = async () => {
    if (!business) return;

    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("business_id", business.id)
      .order("position", { ascending: true });

    setMethods((data || []) as Method[]);
  };

  /* =========================
     TOGGLE
  ========================= */
  const toggle = async (m: Method) => {
    const newValue = !m.enabled;

    setMethods((prev) =>
      prev.map((i) =>
        i.id === m.id ? { ...i, enabled: newValue } : i
      )
    );

    try {
      setTogglingId(m.id);

      const { error } = await supabase
        .from("payment_methods")
        .update({ enabled: newValue })
        .eq("id", m.id);

      if (error) throw error;
    } catch (e) {
      console.error(e);

      // rollback
      setMethods((prev) =>
        prev.map((i) =>
          i.id === m.id ? { ...i, enabled: m.enabled } : i
        )
      );
    } finally {
      setTogglingId(null);
    }
  };

  /* =========================
     DELETE (PREMIUM)
  ========================= */
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await supabase
        .from("payment_methods")
        .delete()
        .eq("id", deleteId);

      setMethods((prev) =>
        prev.filter((m) => m.id !== deleteId)
      );
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  /* =========================
     DRAG
  ========================= */
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = methods.findIndex((m) => m.id === active.id);
    const newIndex = methods.findIndex((m) => m.id === over.id);

    const newItems = arrayMove(methods, oldIndex, newIndex);

    setMethods(newItems);

    await Promise.all(
      newItems.map((item, index) =>
        supabase
          .from("payment_methods")
          .update({ position: index })
          .eq("id", item.id)
      )
    );
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Métodos de pago
          </h2>
          <p className="text-sm text-gray-500">
            Configura cómo recibirás los pagos
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm"
        >
          + Agregar
        </button>
      </div>

      {/* LIST */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={methods.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {methods.map((m) => {
              const ui = UI[m.type];
              if (!ui) return null;

              return (
                <SortableItem key={m.id} id={m.id}>
                  <PaymentCard
                    name={ui.name}
                    number={m.number}
                    holder={m.holder}
                    active={m.enabled}
                    loading={togglingId === m.id}
                    onToggle={() => toggle(m)}
                    onDelete={() => setDeleteId(m.id)} // ✅ CAMBIO
                    onEdit={() => setEditing(m)}
                    color={ui.color}
                    icon={ui.icon}
                  />
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* ADD / EDIT MODAL */}
      <AddPaymentModal
        open={open || !!editing}
        method={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onCreated={load}
      />

      {/* DELETE MODAL */}
      <ConfirmModal
        open={!!deleteId}
        title="Eliminar método"
        description="Esta acción no se puede deshacer"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}

/* =========================
   SORTABLE ITEM
========================= */
function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </div>

      <div className="pl-6">{children}</div>
    </div>
  );
}