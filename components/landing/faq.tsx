/*
<ai_context>
This client component provides the FAQ section.
Uses accordion for expandable questions and answers.
</ai_context>
*/

"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How is this different from hiring traditional developers?",
    answer:
      "Traditional developers code by hand, taking months to build what we create in weeks. We use AI to generate thousands of lines of perfect code instantly, then our experts customize it for your needs. Same result, 10x faster, 90% cheaper."
  },
  {
    question: "What if I need changes after the project is done?",
    answer:
      "You get 6 months of free support and unlimited revisions until you're 100% satisfied. After that, you own the code completely - you can modify it yourself, hire anyone to change it, or come back to us for updates. No lock-in, ever."
  },
  {
    question: "How can you build so fast?",
    answer:
      "We're graduates of Gauntlet AI, the world's most elite AI engineering program. While others are still learning ChatGPT, we're using advanced AI systems to generate production-ready code instantly. We build at the speed of thought, not the speed of typing."
  },
  {
    question: "What kind of software can you build?",
    answer:
      "Anything you're currently paying monthly for: internal tools, communication platforms, project management systems, analytics dashboards, CRMs, inventory management, booking systems, and more. If it's SaaS, we can build you a better version that you'll own forever."
  },
  {
    question: "Is the code high quality?",
    answer:
      "Our AI generates cleaner code than most humans write. Every project includes modern architecture, comprehensive testing, security best practices, and detailed documentation. Plus, you get the full source code - nothing is hidden or obfuscated."
  },
  {
    question: "What happens if I'm not satisfied?",
    answer:
      "Simple: you don't pay. We work until you love it or it's free. No deposits, no risk. We're so confident in our ability to deliver that we only get paid when you're thrilled with the result."
  },
  {
    question: "Can you integrate with my existing tools?",
    answer:
      "Yes! We can integrate with any API, database, or system you're currently using. Most clients have us build standalone systems first, then gradually replace their entire SaaS stack as they see the savings add up."
  },
  {
    question: "How do I know you won't disappear after payment?",
    answer:
      "We've built our reputation on delivering exceptional results. Every client gets 6 months of support, and we're always here if you need future updates. Plus, since you own the code, you're never dependent on us - that's the whole point!"
  }
]

export function FAQSection() {
  console.log("[FAQSection] Rendering FAQ section")

  return (
    <section
      id="faq"
      className="from-muted/30 to-background bg-gradient-to-b py-12 md:py-24"
    >
      <div className="container max-w-4xl">
        <div className="mx-auto mb-12 text-center">
          <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
            FAQ
          </h2>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Got questions?{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              We've got answers
            </span>
          </h3>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-purple-100/20 transition-colors data-[state=open]:border-purple-300/40"
            >
              <AccordionTrigger className="py-6 text-left transition-colors hover:text-purple-600 hover:no-underline">
                <span className="pr-4 text-base font-medium md:text-lg">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 pr-12">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? We'd love to help.
          </p>
          <a
            href="#consultation-form"
            className="inline-flex items-center gap-2 font-medium text-purple-600 transition-colors hover:text-purple-700"
          >
            Schedule a free consultation
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
