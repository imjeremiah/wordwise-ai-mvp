/*
<ai_context>
This client component provides the hero section for the landing page.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronRight, Rocket, Github, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import posthog from "posthog-js"
import AnimatedGradientText from "../magicui/animated-gradient-text"
import HeroVideoDialog from "../magicui/hero-video-dialog"

export const HeroSection = () => {
  const handleGetStartedClick = () => {
    posthog.capture("clicked_get_started")
  }

  return (
    <section className="relative py-16 md:py-24 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-background -z-10" />
      
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-purple-200/30">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Trusted by 100+ businesses
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Build your SaaS
              </span>
              <br />
              in just 2 weeks
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="max-w-2xl mb-8"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Production-ready Firebase boilerplate with authentication, payments, 
              and everything you need to launch your startup fast.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {["Firebase Auth", "Stripe Payments", "Production Ready"].map((feature, index) => (
              <div
                key={feature}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Check className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href="/dashboard" onClick={handleGetStartedClick}>
              <Button variant="gradient" size="lg" className="group">
                <span className="flex items-center gap-3">
                  Get Started
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
            
            <Link href="https://github.com/ReeceHarding/firebase-boilerplate">
              <Button variant="outline" size="lg">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </Link>
          </motion.div>

          {/* Video preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            className="w-full max-w-5xl"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-purple-100/20">
              <HeroVideoDialog
                animationStyle="top-in-bottom-out"
                videoSrc="https://www.youtube.com/embed/9yS0dR0kP-s"
                thumbnailSrc="/hero.png"
                thumbnailAlt="Hero Video"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
