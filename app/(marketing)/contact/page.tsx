/*
<ai_context>
This is the contact page with contact form, company info, and FAQ.
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Phone,
  Send,
  Sparkles,
  ArrowRight,
  Github,
  Twitter,
  ChevronDown,
  Globe
} from "lucide-react"

export default async function ContactPage() {
  console.log("[Contact Page] Rendering contact page")

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Drop us a line anytime",
      value: "hello@firebaseboilerplate.com",
      action: "mailto:hello@firebaseboilerplate.com",
      gradient: "from-purple-600 to-purple-400"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team",
      value: "Available 9am-5pm EST",
      action: "#",
      gradient: "from-purple-500 to-purple-300"
    },
    {
      icon: Twitter,
      title: "Twitter",
      description: "Follow us for updates",
      value: "@firebaseboiler",
      action: "https://twitter.com",
      gradient: "from-purple-600 to-purple-400"
    },
    {
      icon: Github,
      title: "GitHub",
      description: "Check out our code",
      value: "firebase-boilerplate",
      action: "https://github.com",
      gradient: "from-purple-500 to-purple-300"
    }
  ]

  const faqs = [
    {
      question: "What is Firebase Boilerplate?",
      answer:
        "Firebase Boilerplate is a production-ready starter template for building modern web applications with Next.js, Firebase, and Stripe. It includes authentication, payments, analytics, and more out of the box."
    },
    {
      question: "How quickly can I get started?",
      answer:
        "You can have a fully functional app running in under 5 minutes. Just clone the repo, add your environment variables, and deploy to Vercel with one click."
    },
    {
      question: "Do you offer support?",
      answer:
        "Yes! We offer community support through GitHub discussions and priority support for Pro users. Our team typically responds within 24 hours."
    },
    {
      question: "Can I use this for commercial projects?",
      answer:
        "Absolutely! Firebase Boilerplate is licensed for both personal and commercial use. Build as many projects as you want."
    },
    {
      question: "What's included in the Pro version?",
      answer:
        "Pro users get priority support, early access to new features, advanced components, and exclusive templates. Plus, you're supporting the continued development of the project."
    }
  ]

  return (
    <div className="py-16 md:py-24">
      {/* Hero Section */}
      <section className="relative mb-16 md:mb-24">
        <div className="to-background absolute inset-0 -z-10 bg-gradient-to-b from-purple-50/50" />

        <div className="container max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-purple-600">
              CONTACT
            </h1>

            <h2 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Let's build something
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {" "}
                amazing together
              </span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
              Have a question, feedback, or just want to say hi? We'd love to
              hear from you. Our team is here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="mb-16 md:mb-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method, index) => (
              <Link key={method.title} href={method.action} className="group">
                <Card className="h-full cursor-pointer border-purple-100/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)] dark:bg-gray-900/80">
                  <CardHeader className="text-center">
                    <div
                      className={`mx-auto size-12 rounded-full bg-gradient-to-r ${method.gradient} mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20`}
                    >
                      <method.icon className="size-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {method.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm font-medium text-purple-600 transition-colors group-hover:text-purple-700">
                      {method.value}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="mb-16 md:mb-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-purple-100/20 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          required
                          className="bg-white/50 dark:bg-gray-900/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          required
                          className="bg-white/50 dark:bg-gray-900/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="bg-white/50 dark:bg-gray-900/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        required
                        className="bg-white/50 dark:bg-gray-900/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your project..."
                        rows={6}
                        required
                        className="resize-none bg-white/50 dark:bg-gray-900/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      className="group w-full"
                    >
                      <span className="flex items-center gap-3">
                        Send Message
                        <Send className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Company Info */}
            <div className="space-y-6">
              <Card className="border-purple-100/20 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
                <CardHeader>
                  <CardTitle className="text-xl">Office Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Monday - Friday</p>
                      <p className="text-muted-foreground text-sm">
                        9:00 AM - 6:00 PM EST
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Weekend</p>
                      <p className="text-muted-foreground text-sm">
                        Limited support available
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100/20 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
                <CardHeader>
                  <CardTitle className="text-xl">Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Headquarters</p>
                      <p className="text-muted-foreground text-sm">
                        San Francisco, CA
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 size-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Remote Team</p>
                      <p className="text-muted-foreground text-sm">
                        Working worldwide to
                        <br />
                        serve you better
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/30 bg-white/50 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="size-4 text-purple-600" />
                <span className="text-muted-foreground text-sm font-medium">
                  Typical response time: 2-4 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="to-background mb-16 bg-gradient-to-b from-purple-50/30 py-16 md:mb-24 md:py-24">
        <div className="container max-w-4xl">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground text-lg">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-purple-100/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(147,51,234,0.1)] dark:bg-gray-900/80"
              >
                <CardHeader className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <CardTitle className="pr-4 text-lg font-medium">
                      {faq.question}
                    </CardTitle>
                    <ChevronDown className="size-5 shrink-0 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link href="mailto:hello@firebaseboilerplate.com">
              <Button variant="outline" size="lg">
                <Mail className="mr-2 size-5" />
                Email our team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="container max-w-4xl">
          <Card className="border-0 bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-[0_20px_50px_rgba(147,51,234,0.3)]">
            <CardContent className="p-12">
              <h3 className="mb-4 text-3xl font-bold md:text-4xl">
                Ready to get started?
              </h3>
              <p className="mb-8 text-lg text-purple-100 md:text-xl">
                Join thousands of developers building with Firebase Boilerplate
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-2xl"
                  >
                    <span className="flex items-center gap-3 font-semibold">
                      Start Building
                      <ArrowRight className="size-5" />
                    </span>
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white bg-transparent text-white hover:bg-white/10"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
