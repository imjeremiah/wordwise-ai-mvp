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
    description: "Bank-level security with Firebase Auth. Your data is always protected.",
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
    description: "Accept payments worldwide with pre-built Stripe checkout flows.",
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
    description: "Beautiful on all devices with Tailwind CSS and responsive design.",
    gradient: "from-purple-500 to-purple-300"
  }
]

export const FeaturesSection = () => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-purple-50/30">
      <div className="container max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-bold font-mono text-purple-600 text-sm uppercase tracking-wider mb-4"
          >
            FEATURES
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-semibold text-3xl sm:text-4xl md:text-5xl mb-6"
          >
            Everything you need to
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"> ship fast</span>
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Stop reinventing the wheel. Get all the features you need out of the box
            so you can focus on building your product.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              {/* Card content */}
              <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/20 hover:border-purple-300/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)] h-full">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} shadow-lg shadow-purple-500/20`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
            <Rocket className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              And much more coming soon...
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 