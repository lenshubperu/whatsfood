export default function QuickActions() {
  return (
    <div>
      <p className="font-semibold mb-4">Acciones rápidas</p>

      <div className="grid md:grid-cols-3 gap-4">

        <button className="bg-green-600 text-white p-6 rounded-2xl text-left">
          ➕ Agregar producto
        </button>

        <button className="bg-white p-6 rounded-2xl border text-left">
          ✏️ Editar catálogo
        </button>

        <button className="bg-white p-6 rounded-2xl border text-left">
          🔗 Ver tienda
        </button>

      </div>
    </div>
  );
}