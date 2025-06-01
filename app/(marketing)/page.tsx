/*
<ai_context>
This is the marketing home page.
</ai_context>
*/

import { HeroSection } from "@/components/landing/hero"
import { LogoCarousel } from "@/components/landing/logo-carousel"
import { TestimonialsSection } from "@/components/landing/testimonials"

export default async function HomePage() {
  return (
    <div className="pb-20">
      <HeroSection />
      <LogoCarousel />
      <TestimonialsSection />
      {/* pricing */}
      {/* faq */}
      {/* blog */}
      {/* footer */}
    </div>
  )
}
