import Navbar from "@/components/Navbar"
import Hero from "@/src/components/Hero"
import Services from "@/src/components/Services"
import Testimonials from "@/src/components/Testimonials"
import Gallery from "@/src/components/Gallery"
import CTA from "@/src/components/CTA"
import Footer from "@/src/components/Footer"

export const metadata = {
  title: "Tiny Treasures Studio - Professional Photography for Every Milestone",
  description:
    "Capture precious moments with our professional photography packages for newborns, babies, and families.",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
