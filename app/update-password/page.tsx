"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Mínimo 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      setDone(true);

    } catch {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full">

        <h1 className="text-xl font-bold mb-4">
          Nueva contraseña
        </h1>

        {done ? (
          <p className="text-green-600">
            Contraseña actualizada ✅
          </p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />

            <button
              className="w-full bg-green-500 text-white py-3 rounded-xl"
            >
              {loading ? "Guardando..." : "Actualizar"}
            </button>

          </form>
        )}

      </div>

    </div>
  );
}