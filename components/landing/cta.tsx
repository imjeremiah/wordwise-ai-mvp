/*
<ai_context>
This server component provides the CTA section.
Shows a compelling call to action with purple gradient.
</ai_context>
*/

"use server"

import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, DollarSign, Shield } from "lucide-react"
import Link from "next/link"

export async function CTASection() {
  console.log("[CTASection] Rendering CTA section")

  return (
    <section className="relative overflow-hidden py-12 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to stop paying{" "}
            <span className="text-purple-200">$33,000/year</span> for software
            you'll never own?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-100">
            Join 100+ businesses who've already made the switch. Get custom
            software that you own forever, built in just 2 weeks.
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="#consultation-form">
              <Button
                size="lg"
                className="hover-lift group bg-white px-8 py-6 text-lg font-medium text-purple-600 shadow-xl hover:bg-gray-100 hover:shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  Start your build
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            <Link href="#testimonials">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 px-8 py-6 text-lg font-medium text-white backdrop-blur-sm hover:bg-white/20"
              >
                See success stories
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3 text-white">
              <Clock className="size-5 text-purple-200" />
              <span className="text-sm font-medium">2 week delivery</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <DollarSign className="size-5 text-purple-200" />
              <span className="text-sm font-medium">One-time payment</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <Shield className="size-5 text-purple-200" />
              <span className="text-sm font-medium">100% guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
