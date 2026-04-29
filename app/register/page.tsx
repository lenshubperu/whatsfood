"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  /* ================= PLAN ================= */
  const [selectedPlan, setSelectedPlan] = useState("free");

  useEffect(() => {
    const plan = localStorage.getItem("selectedPlan") || "free";
    setSelectedPlan(plan);
  }, []);

  const allowedPlans = ["free", "pro", "business"];

  const safePlan = allowedPlans.includes(selectedPlan)
    ? selectedPlan
    : "free";

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startTime] = useState(Date.now());
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordsMatch =
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword;

  const passwordsError =
    form.confirmPassword && form.password !== form.confirmPassword;

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.website) return;

    const timeSpent = Date.now() - startTime;
    if (timeSpent < 2000) return;

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return;
    }

    if (form.password !== form.confirmPassword) return;
    if (form.password.length < 6) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: "https://whatsfoodperu.com/dashboard",
          data: {
            business_name: form.name,
          },
        },
      });

      if (error) {
        console.error(error.message);
        alert(error.message);
        return;
      }

      if (data.user) {
        await supabase.from("businesses").insert({
          user_id: data.user.id,
          name: form.name,
          email: form.email,
          plan: safePlan, // 🔥 PLAN REAL
        });

        // limpiar plan (importante)
        localStorage.removeItem("selectedPlan");

        await fetch("/api/send-welcome", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
          }),
        });

        await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
          }),
        });
      }

      setShowSuccess(true);

    } catch (err) {
      console.error("Error en registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100">
          
          {/* LOGO */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" className="w-24 mb-2" />
            <h1 className="text-xl font-bold">WhatsFood</h1>
            <p className="text-gray-500 text-sm">
              Crea tu cuenta y empieza a vender
            </p>
          </div>

          {/* 🔥 PLAN SELECCIONADO */}
          <div className="text-center text-sm text-gray-600 mb-4">
            Plan seleccionado: <strong>{selectedPlan.toUpperCase()}</strong>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* HONEYPOT */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              className="hidden"
            />

            {/* NOMBRE */}
            <input
              type="text"
              name="name"
              placeholder="Nombre del negocio"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 pr-12 outline-none transition
                  ${form.password.length > 0 && form.password.length < 6
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-green-500"
                  }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {form.password && form.password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repetir contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 pr-12 outline-none transition
                  ${passwordsError
                    ? "border-red-400 focus:ring-red-400"
                    : passwordsMatch
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-200 focus:ring-green-500"
                  }`}
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {passwordsMatch && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-400 hover:text-black"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {passwordsError && (
                <p className="text-red-500 text-xs mt-1">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-green-500/30 disabled:opacity-70"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {/* LINKS */}
            <p className="text-center text-sm text-gray-500 mt-4">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-green-600 hover:underline">
                Inicia sesión
              </a>
            </p>

            <p className="text-center text-sm mt-2">
              <a
                href="/forgot-password"
                className="text-gray-400 hover:text-green-600 transition"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </p>

          </form>

          {/* FOOT */}
          <div className="text-xs text-gray-400 text-center mt-6 flex items-center justify-center gap-2">
            <span>Sin comisiones • Empieza en minutos</span>
            <img src="/rocket.gif" className="w-5 h-5" />
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <img src="/mail.png" className="w-14 mx-auto mb-4" />

            <h2 className="text-lg font-bold mb-2">
              Revisa tu correo 📩
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Te enviamos un enlace para activar tu cuenta.  
              Si no lo ves, revisa tu bandeja de spam.
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push("/login");
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}