import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jogga Store — Livraison express 24h au Congo",
  description: "Articles importés, stock au Congo, livrés chez vous en moins de 24h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        <CurrencyProvider>
          <main className="pb-24 min-h-dvh">{children}</main>
          <BottomNav />
        </CurrencyProvider>
      </body>
    </html>
  );
}
