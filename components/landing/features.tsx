/*
<ai_context>
This client component provides the features section for the landing page.
</ai_context>
*/

"use client"

import {
  Shield,
  Zap,
  CreditCard,
  BarChart,
  Cloud,
  Smartphone,
  Lock,
  Rocket
} from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with Firebase Auth. Your data is always protected.",
    gradient: "from-purple-600 to-purple-400"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with Next.js 15 and server components.",
    gradient: "from-purple-500 to-purple-300"
  },
  {
    icon: CreditCard,
    title: "Stripe Integration",
    description:
      "Accept payments worldwide with pre-built Stripe checkout flows.",
    gradient: "from-purple-600 to-purple-400"
  },
  {
    icon: BarChart,
    title: "Analytics Built-in",
    description: "Track user behavior and metrics with PostHog analytics.",
    gradient: "from-purple-500 to-purple-300"
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description: "Store and serve files efficiently with Firebase Storage.",
    gradient: "from-purple-600 to-purple-400"
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description:
      "Beautiful on all devices with Tailwind CSS and responsive design.",
    gradient: "from-purple-500 to-purple-300"
  }
]

export const FeaturesSection = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="from-background bg-gradient-to-b to-purple-50/30 py-16 md:py-24">
      <div className="container max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-purple-600"
          >
            FEATURES
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl font-semibold sm:text-4xl md:text-5xl"
          >
            Everything you need to
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              {" "}
              ship fast
            </span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
          >
            Stop reinventing the wheel. Get all the features you need out of the
            box so you can focus on building your product.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              viewport={{ once: true }}
              className={`group relative transition-all duration-700 ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

              {/* Card content */}
              <div className="relative h-full rounded-2xl border border-purple-100/20 bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-purple-300/40 hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)] dark:bg-gray-900/50">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div
                      className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-r ${feature.gradient} shadow-lg shadow-purple-500/20`}
                    >
                      <feature.icon className="size-6 text-white" />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="text-foreground mb-2 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2">
            <Rocket className="size-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              And much more coming soon...
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
