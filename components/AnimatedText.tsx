"use client";
import { useEffect, useState } from "react";

const words = [
  "por WhatsApp",
  "automáticos",
  "sin esfuerzo",
  "24/7",
];

export default function AnimatedText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-green-500 transition-all duration-500">
      {words[index]}
    </span>
  );
}