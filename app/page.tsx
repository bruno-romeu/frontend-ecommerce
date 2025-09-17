import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { BestSellersSection } from "@/components/best-sellers-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <BestSellersSection />
        <ManifestoSection />
      </main>
      <Footer />
    </div>
  )
}
