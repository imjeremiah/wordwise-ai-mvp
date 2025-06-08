/*
<ai_context>
This server component provides the final call-to-action section.
Uses purple gradient background with compelling messaging.
</ai_context>
*/

import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, DollarSign, Shield } from "lucide-react"
import Link from "next/link"

export async function CTASection() {
  console.log("[CTASection] Rendering CTA section")

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
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
        <div className="mx-auto max-w-5xl text-center">
          {/* Trust Signal Badge - matching hero style */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <div className="size-2 animate-pulse rounded-full bg-white" />
            <span className="text-sm font-medium text-white/90">
              Join 100+ businesses saving millions
            </span>
          </div>

          {/* Main heading - matching hero style */}
          <h2 className="font-instrument mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            Ready to stop paying{" "}
            <span className="relative">
              <span className="text-purple-200">$33,000/year</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 9C2 9 75 3 150 3C225 3 298 9 298 9"
                  stroke="url(#cta-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="cta-gradient"
                    x1="2"
                    y1="9"
                    x2="298"
                    y2="9"
                  >
                    <stop stopColor="#E9D5FF" />
                    <stop offset="1" stopColor="#F3E8FF" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            for software you'll never own?
          </h2>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-purple-100 md:text-2xl">
            Get custom software that you own forever, built in just
            <span className="font-semibold text-white"> 2 weeks</span>.
          </p>

          {/* Feature Pills - matching hero style */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Clock className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                2 week delivery
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <DollarSign className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                One-time payment
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Shield className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                100% guarantee
              </span>
            </div>
          </div>

          {/* CTA Buttons - matching hero style */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/#consultation-form">
              <Button
                size="lg"
                className="shadow-purple-lg hover-lift group bg-white px-8 py-6 text-lg font-medium text-purple-600 shadow-xl hover:bg-gray-100 hover:shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  Start building for free
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link href="#testimonials">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 px-8 py-6 text-lg font-medium text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/20"
              >
                See success stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
