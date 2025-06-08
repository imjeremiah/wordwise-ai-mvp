/*
<ai_context>
This is the marketing home page.
Updated with all sections from the beautiful design.
</ai_context>
*/

import { HeroSection } from "@/components/landing/hero"
import { VideoShowcaseSection } from "@/components/landing/video-showcase"
import { AboutSection } from "@/components/landing/about"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { ProjectsSection } from "@/components/landing/projects"
import { PricingSection } from "@/components/landing/pricing"
import { FAQSection } from "@/components/landing/faq"
import { CTASection } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  console.log("[HomePage] Rendering marketing page")

  return (
    <>
      <HeroSection />
      <VideoShowcaseSection />
      <AboutSection />
      <TestimonialsSection />
      <ProjectsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  )
}
