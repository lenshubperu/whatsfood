import AnimatedText from "@/components/AnimatedText";
import Footer from "@/components/Footer";
import Link from "next/link";

import {
  Store,
  MessageCircle,
  Settings,
  Clock,
  Utensils,
  Package,
  UserPlus,
  LayoutGrid,
  Plus
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-black">

      {/* NAVBAR */}
      <nav className="w-full flex items-center justify-between px-4 md:px-8 py-4">
        <img src="/logo.png" alt="Whatsfood" className="w-28 md:w-32" />

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login">
            <button className="text-xs md:text-sm text-gray-600 hover:text-black transition">
              Iniciar sesión
            </button>
          </Link>

          <Link href="/register">
            <button className="bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition">
              Registrar restaurante
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-4 md:px-6 mt-8 md:mt-14 max-w-4xl mx-auto">

        <p className="text-green-600 text-xs md:text-sm font-medium">
          MENÚ DIGITAL PARA RESTAURANTES
        </p>

        <h1 className="text-2xl md:text-5xl font-bold leading-tight mt-2">
          Tu menú digital, <br className="hidden md:block" />
          tus pedidos <AnimatedText />
        </h1>

        <p className="text-gray-500 mt-4 text-sm md:text-base max-w-md md:max-w-xl">
          Crea tu menú en minutos, compártelo con un link y recibe pedidos directo en WhatsApp.
          Empieza gratis y mejora cuando tu negocio crezca.
        </p>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-6">
          <Link href="/register" className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-green-500/30">
              Crear mi menú gratis
            </button>
          </Link>

          {/* opcional: si luego creas /pricing */}
          {/* <Link href="/pricing">
            <button className="w-full md:w-auto border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50 transition">
              Ver planes
            </button>
          </Link> */}

          <button className="w-full md:w-auto border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50 transition">
            Ver demo
          </button>
        </div>

        {/* microcopy que sube conversión */}
        <p className="text-xs text-gray-500 mt-3">
          Plan gratuito disponible • Sin tarjeta
        </p>
      </section>

      {/* STATS */}
      <section className="mt-10 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center px-4">
        <div>
          <p className="text-lg md:text-xl font-bold">5 min</p>
          <p className="text-gray-500 text-xs md:text-sm">para crear tu menú</p>
        </div>

        <div>
          <p className="text-lg md:text-xl font-bold">WhatsApp</p>
          <p className="text-gray-500 text-xs md:text-sm">sin apps adicionales</p>
        </div>

        <div>
          <p className="text-lg md:text-xl font-bold">0%</p>
          <p className="text-gray-500 text-xs md:text-sm">comisiones</p>
        </div>
      </section>

      {/* MOCKUP CHAT */}
      <section className="mt-12 md:mt-16 px-4">
        <div className="w-[280px] md:w-[320px] mx-auto bg-[#0A0F1C] rounded-[40px] p-3 shadow-2xl">

          <div className="bg-green-500 rounded-t-[30px] p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Utensils className="w-4 h-4 text-white" />
            </div>

            <div>
              <p className="text-white text-sm font-semibold">Restaurante Demo</p>
              <p className="text-white/80 text-xs">whatsfood/demo</p>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-b-[30px] p-3 flex flex-col gap-3">

            <div className="bg-[#1E293B] text-white text-sm p-3 rounded-xl self-start max-w-[80%] flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-400" />
              Hola, quiero hacer un pedido
            </div>

            <div className="bg-[#111827] text-white text-sm p-3 rounded-xl shadow-inner">
              <div className="flex items-center gap-2 mb-2 text-green-400 font-semibold">
                <Package className="w-4 h-4" />
                Nuevo pedido
              </div>

              <div className="flex justify-between text-xs mb-1">
                <span>2x Alitas BBQ</span>
                <span>S/ 36</span>
              </div>

              <div className="flex justify-between text-xs mb-1">
                <span>1x Hamburguesa</span>
                <span>S/ 15</span>
              </div>

              <div className="flex justify-between text-xs mb-1">
                <span>Extras</span>
                <span>S/ 5</span>
              </div>

              <div className="flex justify-between text-sm font-semibold mt-2 border-t border-white/10 pt-2">
                <span>Total</span>
                <span>S/ 56</span>
              </div>
            </div>

            <div className="bg-green-500 text-white text-sm p-3 rounded-xl self-end max-w-[80%] shadow-lg shadow-green-500/30 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ¡Pedido recibido! En 20 min
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          <div className="mb-14 max-w-2xl">
            <p className="text-green-600 text-xs md:text-sm font-semibold mb-3 tracking-wide">
              POR QUÉ WHATSFOOD
            </p>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              Todo lo que necesita <br />
              tu restaurante
            </h2>

            <p className="text-gray-500 mt-5 text-sm md:text-base">
              Automatiza pedidos, organiza tu menú y gestiona tu negocio desde un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Store, title: "Menú digital profesional", desc: "Crea tu menú con fotos y categorías." },
              { icon: MessageCircle, title: "Pedidos a WhatsApp", desc: "Recibe pedidos automáticamente." },
              { icon: Settings, title: "Gestión simple", desc: "Administra productos fácilmente." },
              { icon: Clock, title: "Horarios automáticos", desc: "Evita pedidos fuera de horario." }
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div key={i} className="group bg-[#020617] text-white p-6 rounded-2xl border border-white/5 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10">
                  <div className="w-11 h-11 bg-green-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>

                  <h3 className="font-semibold text-[15px] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mt-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-green-500 text-xs md:text-sm font-semibold mb-3 tracking-wide">
              CÓMO FUNCIONA
            </p>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-10">
              Empieza a vender <br /> en 3 pasos
            </h2>

            {[
              { icon: UserPlus, title: "Regístrate", desc: "Crea tu cuenta en menos de 2 minutos." },
              { icon: LayoutGrid, title: "Crea tu menú", desc: "Agrega productos fácilmente." },
              { icon: MessageCircle, title: "Recibe pedidos", desc: "Recibe pedidos directo a WhatsApp." }
            ].map((step, i) => {
              const Icon = step.icon;

              return (
                <div key={i} className="flex gap-4 mb-8">
                  <div className="min-w-[40px] h-10 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-green-500" />
                      <h3 className="font-semibold text-base md:text-lg">{step.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOCKUP MENU */}
          <div className="relative">
            <div className="bg-[#020617] rounded-3xl p-6 border border-white/5 shadow-2xl">

              <p className="text-xs text-green-500 mb-4 font-semibold tracking-wide">
                TU MENÚ PÚBLICO
              </p>

              {[
                { name: "Hamburguesa clásica", price: "S/ 15", img: "/food/burger.png" },
                { name: "Alitas BBQ", price: "S/ 18", img: "/food/wings.png" },
                { name: "Papas fritas", price: "S/ 8", img: "/food/fries.png" },
                { name: "Limonada", price: "S/ 6", img: "/food/lemonade.png" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3 mb-3 hover:bg-white/10 transition group">

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden shadow-inner shadow-black/20">
                      <img src={item.img} className="w-10 h-10 object-contain group-hover:scale-110 transition duration-300" />
                    </div>

                    <div>
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.price}</p>
                    </div>
                  </div>

                  <button className="bg-green-500 hover:bg-green-600 w-9 h-9 rounded-lg flex items-center justify-center transition shadow-md shadow-green-500/30">
                    <Plus className="w-4 h-4 text-white" />
                  </button>

                </div>
              ))}

              <div className="mt-4 bg-green-500 text-white text-sm rounded-xl py-3 px-4 flex justify-between items-center font-medium shadow-lg shadow-green-500/20">
                <span>Ver pedido (3)</span>
                <span>S/ 41</span>
              </div>

            </div>

            <div className="absolute -inset-1 bg-green-500/10 blur-2xl rounded-3xl -z-10" />
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mt-32 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">

          <div className="relative bg-[#020617] rounded-3xl p-10 md:p-14 text-center border border-white/5 overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 blur-2xl" />

            <div className="relative z-10">

              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                Empieza hoy. <br />
                <span className="text-green-400">
                  Empieza gratis.
                </span>
              </h2>

              <p className="text-gray-400 mt-5 max-w-xl mx-auto text-sm md:text-base">
                Crea tu menú digital y empieza a recibir pedidos por WhatsApp en minutos.
                Empieza gratis y mejora a PRO o BUSINESS cuando lo necesites.
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                <Link href="/register">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition shadow-lg shadow-green-500/30">
                    Empezar gratis
                  </button>
                </Link>

                <Link href="/login">
                  <button className="border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition">
                    Iniciar sesión
                  </button>
                </Link>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                Empieza gratis • Mejora tu plan en cualquier momento
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}