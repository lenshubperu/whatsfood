import { Check } from "lucide-react";

export default function PlanSection() {
  return (
    <div className="space-y-6">
      {/* PLAN ACTUAL */}
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              Plan Free
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ACTIVO
              </span>
            </h2>
            <p className="text-gray-500 mt-1">
              Ideal para empezar a vender online en minutos
            </p>
          </div>

          <span className="text-green-600 text-sm font-medium">
            ● Activo
          </span>
        </div>

        <ul className="mt-6 space-y-3 text-gray-700">
          {[
            "Hasta 10 productos",
            "Link con branding WhatsFood",
            "Recibe pedidos directo en tu WhatsApp",
            "Hasta 3 métodos de pago",
            "Soporte básico",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check size={18} className="text-green-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* UPGRADE */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* PRO */}
        <div className="bg-white rounded-2xl p-6 border-2 border-green-500 shadow-md relative">
          <span className="absolute top-4 right-4 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
            Más popular
          </span>

          <h3 className="text-xl font-semibold">PRO</h3>
          <p className="text-3xl font-bold mt-2">
            S/ 15
            <span className="text-sm text-gray-500"> / mes</span>
          </p>

          <ul className="mt-4 space-y-2 text-gray-700 text-sm">
            <li>✔ Productos ilimitados</li>
            <li>✔ Sin branding</li>
            <li>✔ Métodos de pago ilimitados</li>
            <li>✔ Soporte prioritario</li>
          </ul>

          <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-xl font-medium hover:bg-green-600 transition">
            Mejorar plan
          </button>
        </div>

        {/* BUSINESS */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-xl font-semibold">BUSINESS</h3>
          <p className="text-3xl font-bold mt-2">
            S/ 29
            <span className="text-sm text-gray-500"> / mes</span>
          </p>

          <ul className="mt-4 space-y-2 text-gray-700 text-sm">
            <li>✔ Todo PRO</li>
            <li>✔ Link personalizado</li>
            <li>✔ Pedidos en tiempo real</li>
            <li>✔ Estadísticas de ventas</li>
            <li>✔ Soporte 24/7</li>
          </ul>

          <button className="mt-6 w-full border border-gray-300 py-2 rounded-xl font-medium hover:bg-gray-50 transition">
            Ver plan
          </button>
        </div>
      </div>
    </div>
  );
}