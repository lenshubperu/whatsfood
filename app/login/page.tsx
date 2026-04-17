"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      // 🔐 CHECK EMAIL CONFIRMADO
      if (!data.user?.email_confirmed_at) {
        alert("Debes confirmar tu correo antes de iniciar sesión 📩");
        return;
      }

      // 🧠 GUARDAR SESIÓN EN TU BACKEND
      const session = data.session;

      if (session) {
        await fetch("/api/save-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: data.user.id,
            session_id: session.access_token,
          }),
        });
      }

      // 🚀 REDIRECT
      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="w-24 mb-2" />
          <h1 className="text-xl font-bold">WhatsFood</h1>
          <p className="text-gray-500 text-sm">
            Inicia sesión en tu cuenta
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <p className="text-right text-sm mt-2">
            <a
              href="/forgot-password"
              className="text-gray-400 hover:text-green-600 transition"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-green-500/30 disabled:opacity-70"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Crear cuenta
          </a>
        </p>

      </div>
    </main>
  );
}