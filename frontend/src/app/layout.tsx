import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Jogga Store — Livraison express 24h au Congo",
  description: "Articles importés, stock au Congo, livrés chez vous en moins de 24h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <CurrencyProvider>
          <main className="pb-24 min-h-dvh">{children}</main>
          <BottomNav />
        </CurrencyProvider>
      </body>
    </html>
  );
}
