"use client";

import MainHeader from "@/components/dashboard/MainHeader";
import { BusinessProvider } from "@/app/context/BusinessProvider";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProvider>
      <div className="bg-[#F5F5F5] min-h-screen">

        {/* 🔥 HEADER */}
        <MainHeader />

        {/* 🔥 CONTENIDO */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          {children}
        </main>

        {/* 🔔 TOAST GLOBAL */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={2500}
        />

      </div>
    </BusinessProvider>
  );
}