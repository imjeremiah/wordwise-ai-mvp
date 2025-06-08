/*
<ai_context>
This server component provides the about section.
Explains the company's expertise and value proposition.
</ai_context>
*/

import { Sparkles, Shield, Code2, Target, Zap, Users } from "lucide-react"

export async function AboutSection() {
  console.log("[AboutSection] Rendering about section")

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-7xl">
        <div className="mx-auto mb-16 text-center">
          <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-purple-600">
            ABOUT US
          </h2>
          <h3 className="mb-6 text-3xl font-semibold sm:text-4xl md:text-5xl">
            Built for developers, by{" "}
            <span className="text-purple-600">developers</span>
          </h3>
          <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-lg">
            While traditional developers are still coding by hand, we learned
            directly from the pioneers of AI development. Gauntlet AI accepts
            less than 1% of applicants. We made it through.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-purple-600 bg-white">
              <Sparkles className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">
              10x Faster = 10x Cheaper
            </h4>
            <p className="text-muted-foreground text-sm">
              We code at AI speed. What takes agencies 6 months, we ship in 2
              weeks. Less time = less cost = your savings.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-purple-600 bg-white">
              <Shield className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">
              Built by Builders, Not Talkers
            </h4>
            <p className="text-muted-foreground text-sm">
              Gauntlet AI graduates who've shipped to real users. We build, you
              own, SaaS companies cry.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-purple-600 bg-white">
              <Code2 className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">Risk Free Guarantee</h4>
            <p className="text-muted-foreground text-sm">
              We work until you love it or it's free. No contracts, no deposits,
              no risk. Pay only when you see it working.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-purple-600 bg-white">
              <Target className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">Targeted Marketing</h4>
            <p className="text-muted-foreground text-sm">
              We help you reach your target audience effectively.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-purple-600 bg-white">
              <Zap className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">Automated Growth</h4>
            <p className="text-muted-foreground text-sm">
              We automate your growth strategies to scale your business.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-purple-600 bg-white">
              <Users className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">User-Centric Design</h4>
            <p className="text-muted-foreground text-sm">
              We design products with user experience in mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
