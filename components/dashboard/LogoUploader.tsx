"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { supabase } from "@/lib/supabase/client";

export default function LogoUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { business, setBusiness } = useBusinessContext();

  const [preview, setPreview] = useState<string | null>(
    business?.logo_url || null
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const url = URL.createObjectURL(f);

    setPreview(url);
    setFile(f);
  };

  const upload = async () => {
    if (!file || !business) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("businessId", business.id);

      const res = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const newUrl = data.url + "?t=" + Date.now();

      await supabase
        .from("businesses")
        .update({ logo_url: newUrl })
        .eq("id", business.id);

      setBusiness((prev: any) => ({
        ...prev,
        logo_url: newUrl,
      }));

      setPreview(newUrl);
      setFile(null);
    } catch {
      alert("Error subiendo logo");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!business) return;

    await supabase
      .from("businesses")
      .update({ logo_url: null })
      .eq("id", business.id);

    setBusiness((prev: any) => ({
      ...prev,
      logo_url: null,
    }));

    setPreview(null);
    setFile(null);
  };

  return (
    <div className="w-full bg-white border rounded-2xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold">
        Logo de tu tienda
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Aparecerá en tu tienda online
      </p>

      <div
        onClick={handleClick}
        className="w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 min-h-[200px] px-4"
      >
        {loading && <Loader2 className="animate-spin" />}

        {!loading && preview && (
          <img src={preview} className="max-h-[120px]" />
        )}

        {!loading && !preview && (
          <>
            <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
            <p>Click para subir logo</p>
          </>
        )}
      </div>

      {/* 🔥 BOTONES */}
      {(file || preview) && (
        <div className="flex gap-2 mt-4">
          {file && (
            <button
              onClick={upload}
              className="flex-1 bg-black text-white py-2 rounded-xl text-sm"
            >
              Confirmar
            </button>
          )}

          {preview && (
            <button
              onClick={remove}
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}