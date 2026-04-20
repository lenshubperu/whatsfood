"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { supabase } from "@/lib/supabase/client";

export default function LogoUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { business, setBusiness } = useBusinessContext();

  const [preview, setPreview] = useState<string | null>(
    business?.logo_url || null
  );
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = async (file: File) => {
    if (!file || !business) return;

    // 🔒 VALIDACIONES
    if (file.size > 5 * 1024 * 1024) {
      alert("Máx 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Solo imágenes");
      return;
    }

    setLoading(true);

    try {
      // 👉 preview instantáneo (UX)
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("businessId", business.id);

      const res = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.url) throw new Error();

      const newUrl = data.url + "?t=" + Date.now();

      // 👉 guardar en DB
      await supabase
        .from("businesses")
        .update({ logo_url: newUrl })
        .eq("id", business.id);

      // 👉 actualizar UI
      setPreview(newUrl);

      // 👉 🔥 actualizar contexto global (CLAVE)
      setBusiness((prev: any) => ({
        ...prev,
        logo_url: newUrl,
      }));
    } catch (error) {
      console.error(error);
      alert("Error subiendo logo");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="w-full bg-white border rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* HEADER */}
      <h3 className="text-base sm:text-lg font-semibold">
        Logo de tu tienda
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Aparecerá en tu tienda online
      </p>

      {/* DROP ZONE */}
      <div
        onClick={handleClick}
        className="
          w-full
          border-2 border-dashed border-gray-300
          rounded-2xl
          flex flex-col items-center justify-center
          text-center
          cursor-pointer
          transition
          hover:border-gray-400 hover:bg-gray-50
          min-h-[160px] sm:min-h-[200px] md:min-h-[220px]
          px-4 relative
        "
      >
        {loading && (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        )}

        {!loading && preview ? (
          <img
            src={preview}
            alt="logo preview"
            className="max-h-[120px] sm:max-h-[150px] object-contain"
          />
        ) : null}

        {!loading && !preview && (
          <>
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>

            <p className="text-sm sm:text-base font-medium">
              Click para subir logo
            </p>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              PNG, JPG o SVG • Cuadrado recomendado • Máx 5MB
            </p>
          </>
        )}
      </div>

      {/* INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/svg+xml"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}