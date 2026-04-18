"use client";

import { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export default function ImageWithFallback({
  src,
  alt = "Imagen",
  className = "",
  style,
  ...rest
}: Props) {
  const [error, setError] = useState(false);

  const handleError = () => setError(true);

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={style}
    >
      <img
        src={error ? ERROR_IMG_SRC : src}
        alt={alt}
        onError={handleError}
        className="w-full h-full object-cover"
        {...rest}
      />
    </div>
  );
}