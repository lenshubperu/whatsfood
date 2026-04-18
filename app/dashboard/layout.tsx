"use client";

import MainHeader from "@/components/dashboard/MainHeader";
import { useBusiness } from "@/hooks/useBusiness";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { business, loading } = useBusiness();

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      
      {/* HEADER */}
      <MainHeader business={business} />

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Cargando...
          </p>
        ) : (
          children
        )}
      </main>

    </div>
  );
}