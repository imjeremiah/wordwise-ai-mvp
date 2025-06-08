/*
<ai_context>
This is the about page with company information, team section, and values.
Uses purple-centric design with glassmorphism effects.
</ai_context>
*/

"use server"

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
  Linkedin
} from "lucide-react"

export default async function AboutPage() {
  console.log("[About Page] Rendering about page")

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We're focused on helping developers ship faster and build better products.",
      gradient: "from-purple-600 to-purple-400"
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Built by developers, for developers. We prioritize community feedback.",
      gradient: "from-purple-500 to-purple-300"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Performance is not optional. Every millisecond counts in user experience.",
      gradient: "from-purple-600 to-purple-400"
    },
    {
      icon: Heart,
      title: "Developer Love",
      description:
        "We obsess over developer experience and making your life easier.",
      gradient: "from-purple-500 to-purple-300"
    }
  ]

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      avatar: "👨‍💻",
      bio: "Full-stack developer with 10+ years building SaaS products",
      social: {
        twitter: "#",
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "Sarah Chen",
      role: "Lead Engineer",
      avatar: "👩‍💻",
      bio: "Firebase expert and performance optimization enthusiast",
      social: {
        twitter: "#",
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "Mike Rodriguez",
      role: "Head of Design",
      avatar: "🎨",
      bio: "Creating beautiful, functional interfaces for modern web apps",
      social: {
        twitter: "#",
        github: "#",
        linkedin: "#"
      }
    }
  ]

  const stats = [
    { label: "Active Users", value: "10,000+", icon: Users },
    { label: "GitHub Stars", value: "2,500+", icon: Trophy },
    { label: "Components", value: "50+", icon: Code },
    { label: "Happy Developers", value: "1,000+", icon: Heart }
  ]

  return (
    <div className="py-16 md:py-24">
      {/* Hero Section */}
      <section className="relative mb-16 md:mb-24">
        <div className="to-background absolute inset-0 -z-10 bg-gradient-to-b from-purple-50/50" />

        <div className="container max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-purple-600">
              ABOUT US
            </h1>

            <h2 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Building the future of
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {" "}
                web development
              </span>
            </h2>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed md:text-xl">
              We're on a mission to help developers ship faster and build better
              products. Our Firebase boilerplate is just the beginning of that
              journey.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button variant="gradient" size="lg" className="group">
                  <span className="flex items-center gap-3">
                    Get Started
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
          </div>
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
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg shadow-purple-500/20">
                    <stat.icon className="size-6 text-white" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
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
      <section className="to-background mb-16 bg-gradient-to-b from-purple-50/30 py-16 md:mb-24 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-200/30 bg-white/50 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="size-4 text-purple-600" />
              <span className="text-muted-foreground text-sm font-medium">
                Our Mission
              </span>
            </div>

            <h3 className="mb-6 text-3xl font-semibold md:text-4xl">
              Empowering developers to build faster
            </h3>

            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              We believe that developers should spend their time building unique
              features, not reinventing common functionality. That's why we
              created this comprehensive Firebase boilerplate - to give you a
              production-ready foundation so you can focus on what makes your
              product special.
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Every decision we make is guided by one question: "Will this help
              developers ship faster and build better products?" If the answer
              is yes, we do it.
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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                <div className="relative rounded-2xl border border-purple-100/20 bg-white/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-purple-300/40 dark:bg-gray-900/50">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div
                        className={`flex size-14 items-center justify-center rounded-full bg-gradient-to-r ${value.gradient} shadow-lg shadow-purple-500/20`}
                      >
                        <value.icon className="size-7 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="mb-2 text-xl font-semibold">
                        {value.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16 md:mb-24">
        <div className="container max-w-6xl">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-semibold md:text-4xl">
              Meet the Team
            </h3>
            <p className="text-muted-foreground text-lg">
              The people behind Firebase Boilerplate
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Card
                key={member.name}
                className="border-purple-100/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)] dark:bg-gray-900/80"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-400 text-4xl shadow-lg shadow-purple-500/20">
                    {member.avatar}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-purple-600">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4 text-sm">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link
                      href={member.social.twitter}
                      className="text-muted-foreground transition-colors hover:text-purple-600"
                    >
                      <Twitter className="size-5" />
                    </Link>
                    <Link
                      href={member.social.github}
                      className="text-muted-foreground transition-colors hover:text-purple-600"
                    >
                      <Github className="size-5" />
                    </Link>
                    <Link
                      href={member.social.linkedin}
                      className="text-muted-foreground transition-colors hover:text-purple-600"
                    >
                      <Linkedin className="size-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-4 rounded-3xl bg-gradient-to-r from-purple-600 to-purple-400 py-16 md:mx-8 md:py-24">
        <div className="container max-w-4xl text-center text-white">
          <h3 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to build something amazing?
          </h3>
          <p className="mb-8 text-lg text-purple-100 md:text-xl">
            Join thousands of developers who are shipping faster with our
            boilerplate.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-purple-600 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-2xl"
            >
              <span className="flex items-center gap-3 font-semibold">
                Start Building Today
                <ArrowRight className="size-5" />
              </span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
