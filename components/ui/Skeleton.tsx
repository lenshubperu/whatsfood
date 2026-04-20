"use client";

export default function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`
        animate-pulse
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        bg-[length:200%_100%]
        rounded
        ${className}
      `}
      style={{
        animation: "shimmer 1.5s infinite linear",
      }}
    />
  );
}