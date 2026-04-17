export default function Activity() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <p className="font-semibold mb-4">
        Actividad reciente
      </p>

      <ul className="space-y-3 text-sm text-gray-600">

        <li className="flex justify-between">
          <span>Producto agregado: Hamburguesa</span>
          <span className="text-xs">Hace 5 min</span>
        </li>

        <li className="flex justify-between">
          <span>Pedido recibido #1234</span>
          <span className="text-xs">Hace 1h</span>
        </li>

      </ul>
    </div>
  );
}