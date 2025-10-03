import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { BestSellersSection } from "@/components/best-sellers-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <CategoriesSection />
        <BestSellersSection />
        <ManifestoSection />
      </main>
    </div>
  )
}
