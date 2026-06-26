import type { Metadata } from "next";
import { Inter, Space_Grotesk, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const bebasNeue = Bebas_Neue({ variable: "--font-bebas", subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400", "700", "900"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Jogga Store — Livraison express 24h au Congo",
  description: "Articles importés, stock au Congo, livrés chez vous en moins de 24h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${bebasNeue.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <CurrencyProvider>
              <main className="pb-24 min-h-dvh">{children}</main>
              <BottomNav />
            </CurrencyProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
