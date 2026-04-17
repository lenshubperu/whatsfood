"use client";

import { useState } from "react";

export default function WhatsAppBlock() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Hola, quiero pedir:");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <p className="font-semibold mb-4">
        Configuración WhatsApp
      </p>

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+51 999 999 999"
        className="w-full border p-3 rounded-xl mb-3"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-3 rounded-xl mb-3"
      />

      <div className="bg-gray-100 p-3 rounded-xl text-sm">
        {message}
      </div>

    </div>
  );
}