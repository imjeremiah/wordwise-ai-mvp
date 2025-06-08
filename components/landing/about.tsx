/*
<ai_context>
This server component provides the about section.
Explains the company's expertise and value proposition.
</ai_context>
*/

import { Sparkles, Shield, Code2 } from "lucide-react"

export async function AboutSection() {
  console.log("[AboutSection] Rendering about section")

  return (
    <section className="from-background to-muted/30 bg-gradient-to-b py-16 md:py-24">
      <div className="container max-w-7xl">
        <div className="mx-auto mb-16 text-center">
          <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
            About Us
          </h2>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Graduates of the World's Most Elite{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              AI Program
            </span>
          </h3>
          <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-lg">
            While traditional developers are still coding by hand, we learned
            directly from the pioneers of AI development. Gauntlet AI accepts
            less than 1% of applicants. We made it through.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
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
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
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
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
              <Code2 className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">Risk Free Guarantee</h4>
            <p className="text-muted-foreground text-sm">
              We work until you love it or it's free. No contracts, no deposits,
              no risk. Pay only when you see it working.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
