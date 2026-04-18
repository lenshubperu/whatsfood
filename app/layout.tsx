import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhatsFood",
  description: "Dashboard SaaS para restaurantes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className="
          min-h-screen
          bg-background text-foreground
          antialiased
          overflow-x-hidden
        "
      >
        {/* 🔥 WRAPPER GLOBAL PRO */}
        <div className="flex min-h-screen flex-col">

          {/* 🔥 CONTENIDO */}
          <main className="flex-1 w-full">
            <div
              className="
                max-w-7xl
                mx-auto
                w-full
                px-4
                sm:px-6
                lg:px-8
                py-4
                sm:py-6
                lg:py-8
              "
            >
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}