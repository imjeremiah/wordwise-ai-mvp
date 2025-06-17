/*
<ai_context>
This is the about page with company information and values.
Uses purple-centric design for WordWise AI.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import Link from "next/link"
import {
  Target,
  Users,
  Zap,
  Heart,
  Trophy,
  Code,
  Sparkles,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Lightbulb,
  PenTool,
  FileText,
  BookOpen
} from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  console.log("[About Page] Rendering about page")

  const values = [
    {
      icon: PenTool,
      title: "Writing Excellence",
      description:
        "We're focused on helping writers create clear, compelling content with AI assistance.",
      gradient: "from-purple-600 to-purple-400"
    },
    {
      icon: Users,
      title: "User-Centric",
      description:
        "Built for writers, by writers. We understand the challenges of great writing.",
      gradient: "from-purple-500 to-purple-300"
    },
    {
      icon: Zap,
      title: "Real-time Intelligence",
      description:
        "Instant grammar and style suggestions that adapt to your writing context.",
      gradient: "from-purple-600 to-purple-400"
    },
    {
      icon: Heart,
      title: "Privacy First",
      description:
        "Your writing stays private. AI assistance without compromising confidentiality.",
      gradient: "from-purple-500 to-purple-300"
    }
  ]

  const stats = [
    { label: "Writers Helped", value: "10,000+", icon: Users },
    { label: "Documents Improved", value: "2.5M+", icon: FileText },
    { label: "Grammar Fixes", value: "50M+", icon: BookOpen },
    { label: "Happy Writers", value: "9.8/10", icon: Heart }
  ]

  return (
    <div className="py-16 md:py-24">
      {/* Hero Section */}
      <section className="relative bg-white py-24">
        <div className="absolute inset-0 -z-10 bg-white" />
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-instrument mb-6 text-6xl font-bold leading-tight tracking-tight text-black">
              Transforming Writing with{" "}
              <span className="text-purple-600">AI Intelligence</span>
            </h1>

            <h2 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              The future of
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {" "}
                confident writing
              </span>
            </h2>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed md:text-xl">
              WordWise AI empowers writers with intelligent grammar and style
              suggestions. Our mission is to help you write with clarity,
              confidence, and impact.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="group bg-purple-600 hover:bg-purple-700"
                >
                  <span className="flex items-center gap-3">
                    Start Writing
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 size-5" />
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16 md:mb-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="border-purple-100/20 bg-white/80 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)] dark:bg-gray-900/80"
              >
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-purple-600 bg-white shadow-sm">
                    <stat.icon className="size-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-purple-600">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16 md:mb-24 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-200/30 bg-white/50 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="size-4 text-purple-600" />
              <span className="text-muted-foreground text-sm font-medium">
                Our Mission
              </span>
            </div>

            <h3 className="mb-6 text-3xl font-semibold md:text-4xl">
              Empowering writers to communicate clearly
            </h3>

            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              We believe that great writing shouldn't be limited by grammar
              concerns or style uncertainty. WordWise AI provides intelligent
              assistance that helps you express your ideas with clarity and
              confidence, while maintaining your unique voice and style.
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Every feature we build is guided by one question: "Will this help
              writers communicate more effectively?" If the answer is yes, we
              build it.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16 md:mb-24">
        <div className="container max-w-6xl">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-semibold md:text-4xl">
              Our Values
            </h3>
            <p className="text-muted-foreground text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {values.map((value, index) => (
              <div key={value.title} className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                <Card className="relative h-full border-purple-100/20 bg-white/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)]">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-purple-600 bg-white shadow-lg">
                    <value.icon className="size-6 text-purple-600" />
                  </div>
                  <h4 className="mb-3 text-xl font-semibold">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-4 rounded-3xl bg-purple-600 py-16 md:mx-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="font-instrument mb-6 text-4xl font-bold md:text-5xl">
            Ready to Transform Your Writing?
          </h2>
          <p className="mb-8 text-xl text-purple-100">
            Join thousands of writers who are already creating better content
            with WordWise AI assistance.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-2xl"
          >
            Start Writing Better Today
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
