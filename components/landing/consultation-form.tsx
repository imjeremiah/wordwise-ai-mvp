/*
<ai_context>
This client component provides the consultation form.
Allows users to book a free consultation call.
</ai_context>
*/

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Video, CheckCircle } from "lucide-react"
import posthog from "posthog-js"

export function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    project: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log("[ConsultationForm] Form submitted", formData)
    posthog.capture("consultation_form_submitted", formData)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <section
        id="consultation-form"
        className="from-background to-muted/30 bg-gradient-to-b py-12 md:py-24"
      >
        <div className="container max-w-2xl">
          <div className="rounded-3xl border border-purple-100/20 bg-white/50 p-8 text-center backdrop-blur-sm md:p-12 dark:bg-gray-900/50">
            <CheckCircle className="mx-auto mb-4 size-16 text-green-600" />
            <h3 className="mb-4 text-2xl font-semibold">Thank you!</h3>
            <p className="text-muted-foreground mb-6">
              We'll review your project and reach out within 24 hours to
              schedule your free consultation.
            </p>
            <p className="text-muted-foreground text-sm">
              Check your email for confirmation and next steps.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="consultation-form"
      className="from-background to-muted/30 bg-gradient-to-b py-12 md:py-24"
    >
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left side - Info */}
          <div>
            <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
              Get Started
            </h2>
            <h3 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl">
              Book your free{" "}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                strategy call
              </span>
            </h3>
            <p className="text-muted-foreground mt-6 text-lg">
              Let's discuss your project and see how much you could save by
              owning your software instead of renting it.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <Video className="size-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">30-minute video call</h4>
                  <p className="text-muted-foreground text-sm">
                    We'll screen share and show you exactly how we'd build your
                    project
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <Calendar className="size-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Custom project roadmap</h4>
                  <p className="text-muted-foreground text-sm">
                    Get a detailed plan of exactly what we'll build and when
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <Clock className="size-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">No obligation</h4>
                  <p className="text-muted-foreground text-sm">
                    If we're not a fit, we'll point you in the right direction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="rounded-3xl border border-purple-100/20 bg-white/50 p-8 backdrop-blur-sm dark:bg-gray-900/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="company">Company name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="budget">Monthly SaaS budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="$2,000 - $5,000"
                  className="mt-2"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  How much do you currently spend on SaaS tools?
                </p>
              </div>

              <div>
                <Label htmlFor="project">Tell us about your project</Label>
                <Textarea
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="We need a custom CRM to replace Salesforce..."
                  rows={4}
                  required
                  className="mt-2"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  What would you like us to build? Which tools would it replace?
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-purple-md hover:shadow-purple-lg w-full bg-gradient-to-r from-purple-600 to-purple-500 py-6 text-lg font-medium text-white hover:from-purple-700 hover:to-purple-600"
              >
                {isSubmitting ? "Submitting..." : "Book free consultation"}
              </Button>

              <p className="text-muted-foreground text-center text-xs">
                No spam, no sales pressure. Just an honest conversation about
                your needs.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
