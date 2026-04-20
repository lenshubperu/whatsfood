export default function SecuritySection() {
  return (
    <div className="space-y-6">
      {/* CAMBIAR CONTRASEÑA */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Cambiar contraseña
        </h3>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Contraseña actual"
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition">
            Guardar cambios
          </button>
        </div>
      </div>

      {/* ZONA PELIGROSA */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-red-600 font-semibold mb-2">
          Zona peligrosa
        </h3>
        <p className="text-sm text-red-500 mb-4">
          Esta acción no se puede deshacer
        </p>

        <button className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition">
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
}