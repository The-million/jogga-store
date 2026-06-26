import { TopBanner } from "@/components/TopBanner";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Hero } from "@/components/Hero";
import { FlashSale } from "@/components/FlashSale";
import { ProductGrid } from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <TopBanner />
      <Header />
      <CategoryNav />
      <Hero />
      <FlashSale />
      <ProductGrid />
    </div>
  );
}
