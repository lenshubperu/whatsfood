"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    // 🔥 luego aquí conectamos backend
    setTimeout(() => {
      setLoading(false);
      alert("Registro simulado 🚀");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-100">

        <h1 className="text-2xl font-bold mb-2">
          Registrar restaurante
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Crea tu cuenta y empieza a recibir pedidos
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NOMBRE */}
          <input
            type="text"
            name="name"
            placeholder="Nombre de comercio"
            required
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repetir contraseña"
            required
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* CAPTCHA SIMPLE (anti spam básico) */}
          <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded-xl">
            ✔️ No soy un robot (simulado)
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-green-500/30"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

        </form>

      </div>

    </main>
  );
}