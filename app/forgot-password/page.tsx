"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: any) => {
    e.preventDefault();

    if (!email) {
      alert("Ingresa tu correo");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/update-password",
      });

      if (error) {
        alert(error.message);
        return;
      }

      setSent(true);

    } catch (err) {
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full">

        <h1 className="text-xl font-bold mb-2">
          Recuperar contraseña
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>

        {sent ? (
          <p className="text-green-600 text-sm">
            📩 Revisa tu correo para continuar
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

          </form>
        )}

      </div>

    </div>
  );
}