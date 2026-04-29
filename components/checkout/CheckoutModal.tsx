"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type Extra = { id: string; name: string; price: number };

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras: Extra[];
};

type Business = {
  name: string;
  phone: string; // sin +51
  payment_methods?: string[];
};

export default function CheckoutModal({
  cart,
  total,
  business,
  onClose,
}: {
  cart: CartItem[];
  total: number;
  business: Business;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "",
    address: "",
    reference: "",
    payment: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const touch = (name: string) =>
    setTouched((t) => ({ ...t, [name]: true }));

  // ===== VALIDACIONES =====
  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = "Ingresa tu nombre";
    if (!form.phone.match(/^\d{9}$/))
      e.phone = "Teléfono válido de 9 dígitos";
    if (!form.district.trim()) e.district = "Distrito requerido";
    if (!form.address.trim()) e.address = "Dirección requerida";
    if (!form.payment) e.payment = "Selecciona método de pago";

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  // ===== MENSAJE =====
  const buildMessage = () => {
    let text = `Hola 👋, quiero hacer un pedido en *${business.name}*:\n\n`;

    text += `🛒 *Pedido:*\n`;
    cart.forEach((item) => {
      const extrasText = item.extras?.length
        ? ` (${item.extras.map((e) => e.name).join(", ")})`
        : "";
      text += `- ${item.name}${extrasText} x${item.quantity}\n`;
    });

    text += `\n💵 *Total:* S/ ${total.toFixed(2)}\n\n`;

    text += `📍 *Datos:*\n`;
    text += `Nombre: ${form.name}\n`;
    text += `Teléfono: ${form.phone}\n`;
    text += `Distrito: ${form.district}\n`;
    text += `Dirección: ${form.address}\n`;
    if (form.reference) text += `Referencia: ${form.reference}\n`;

    text += `\n💰 *Pago:* ${form.payment}`;

    return encodeURIComponent(text);
  };

  const sendWhatsApp = async () => {
    // marcar todo como tocado para mostrar errores si hay
    setTouched({
      name: true,
      phone: true,
      district: true,
      address: true,
      payment: true,
    });

    if (!isValid) return;

    try {
      setSubmitting(true);

      // (opcional PROD) guardar pedido antes de abrir WA
      // await fetch("/api/orders", { method: "POST", body: JSON.stringify({ cart, total, form }) });

      const url = `https://wa.me/51${business.phone}?text=${buildMessage()}`;
      window.open(url, "_blank");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const Input = ({
    name,
    placeholder,
    type = "text",
  }: {
    name: keyof typeof form;
    placeholder: string;
    type?: string;
  }) => (
    <div>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handle}
        onBlur={() => touch(name)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border transition
          ${touched[name] && errors[name]
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-200 focus:ring-green-500"
          }
          bg-gray-50 focus:outline-none focus:ring-2`}
      />
      {touched[name] && errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50">
      <div className="bg-white w-full rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto animate-[slideUp_.25s_ease]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Tu pedido</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* RESUMEN */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between text-sm mb-1">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>
                S/{" "}
                {(
                  (item.price +
                    item.extras.reduce((a, e) => a + e.price, 0)) *
                  item.quantity
                ).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2 border-t pt-2">
            <span>Total</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* DATOS */}
        <div className="space-y-3">
          <Input name="name" placeholder="Nombre" />
          <Input name="phone" placeholder="Teléfono (9 dígitos)" />
          <Input name="district" placeholder="Distrito" />
          <Input name="address" placeholder="Dirección" />
          <Input name="reference" placeholder="Referencia (opcional)" />

          <div>
            <select
              name="payment"
              value={form.payment}
              onChange={handle}
              onBlur={() => touch("payment")}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50
                ${touched.payment && errors.payment
                  ? "border-red-400"
                  : "border-gray-200"
                }`}
            >
              <option value="">Método de pago</option>
              {(business.payment_methods || [
                "Yape",
                "Plin",
                "Efectivo",
              ]).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            {touched.payment && errors.payment && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payment}
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={!isValid || submitting}
          onClick={sendWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold mt-5 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isValid && <CheckCircle2 className="w-4 h-4" />}
          {submitting
            ? "Enviando..."
            : "Enviar pedido por WhatsApp"}
        </button>
      </div>

      {/* animación */}
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: .6; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}