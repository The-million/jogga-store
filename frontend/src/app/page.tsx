import { TopBanner } from "@/components/TopBanner";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Hero } from "@/components/Hero";
import { FlashSale } from "@/components/FlashSale";
import { SuperDeals } from "@/components/SuperDeals";
import { ProductGrid } from "@/components/ProductGrid";
import { Trends } from "@/components/Trends";
import { BrandZone } from "@/components/BrandZone";

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <TopBanner />
      <Header />
      <CategoryNav />
      <Hero />
      <FlashSale />
      <SuperDeals />
      <ProductGrid />
      <Trends />
      <BrandZone />
    </div>
  );
}
