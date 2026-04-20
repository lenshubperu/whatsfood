"use client";

import { useRef } from "react";
import { toast } from "sonner";

export function useAutoSave<T>({
  saveFn,
  successMessage = "Guardado",
  errorMessage = "Error al guardar",
  delay = 600,
}: {
  saveFn: (data: T) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  delay?: number;
}) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const inFlight = useRef(false);
  const lastData = useRef<T | null>(null);
  const toastId = useRef<string | number | null>(null);

  const trigger = (data: T) => {
    lastData.current = data;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (inFlight.current) return;

      try {
        inFlight.current = true;

        // 🔥 evita múltiples toasts
        if (!toastId.current) {
          toastId.current = toast.loading("Guardando...");
        }

        await saveFn(lastData.current as T);

        toast.success(successMessage, {
          id: toastId.current,
        });

      } catch (e) {
        console.error(e);

        toast.error(errorMessage, {
          id: toastId.current || undefined,
        });

      } finally {
        inFlight.current = false;
        toastId.current = null;
      }
    }, delay);
  };

  return { trigger };
}