export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-[#020617] text-white">

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LOGO */}
       <p className="text-white/90 font-semibold text-lg tracking-tight">
  WhatsFood
</p>

        {/* LINKS */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <button className="hover:text-white transition">
            Iniciar sesión
          </button>

          <button className="hover:text-white transition">
            Registrarse
          </button>

          <button className="hover:text-white transition">
            Aviso de privacidad
          </button>
        </div>

        {/* CREDIT */}
        <p className="text-xs text-gray-500 text-center md:text-right">
          © 2026 WhatsFood.pe · Creado con{" "}
          <span className="text-red-500">♥</span>{" "}
          por <span className="text-orange-400 font-medium">DevLab</span>
        </p>

      </div>

    </footer>
  );
}