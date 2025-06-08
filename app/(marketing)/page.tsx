/*
<ai_context>
This is the marketing home page.
Updated with all sections from the beautiful design.
</ai_context>
*/

"use server"

import { HeroSection } from "@/components/landing/hero"
import { VideoShowcaseSection } from "@/components/landing/video-showcase"
import { AboutSection } from "@/components/landing/about"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { ProjectsSection } from "@/components/landing/projects"
import { DreamOutcomeSection } from "@/components/landing/dream-outcome"
import { FeaturesSection } from "@/components/landing/features"
import { PricingSection } from "@/components/landing/pricing"
import { FAQSection } from "@/components/landing/faq"
import { CTASection } from "@/components/landing/cta"
import { ConsultationForm } from "@/components/landing/consultation-form"
import { Footer } from "@/components/landing/footer"

export default async function HomePage() {
  console.log("[HomePage] Rendering marketing page")

  return (
    <>
      <HeroSection />
      <VideoShowcaseSection />
      <AboutSection />
      <TestimonialsSection />
      <ProjectsSection />
      <DreamOutcomeSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <ConsultationForm />
      <Footer />
    </>
  )
}
