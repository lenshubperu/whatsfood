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

  const trigger = (data: T) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (inFlight.current) return;

      try {
        inFlight.current = true;
        const id = toast.loading("Guardando...");
        await saveFn(data);
        toast.success(successMessage, { id });
      } catch (e) {
        console.error(e);
        toast.error(errorMessage);
      } finally {
        inFlight.current = false;
      }
    }, delay);
  };

  return { trigger };
}