"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export default function LogoUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = (file: File) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
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
          px-4
        "
      >
        {preview ? (
          <img
            src={preview}
            alt="logo preview"
            className="max-h-[120px] sm:max-h-[150px] object-contain"
          />
        ) : (
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