import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Gallery } from "@/components/landing/gallery"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
