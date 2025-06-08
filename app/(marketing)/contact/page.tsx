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
        <div className="absolute inset-0 -z-10 bg-white" />

        <div className="container max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-purple-600">
              CONTACT US
            </h1>
            <h2 className="font-instrument mb-6 text-5xl font-bold leading-tight tracking-tight text-black">
              Let's Start a{" "}
              <span className="text-purple-600">Conversation</span>
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
                      className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-purple-600 bg-white shadow-sm`}
                    >
                      <method.icon className="size-6 text-purple-600" />
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
      <section className="mb-16 bg-white py-16 md:mb-24 md:py-24">
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
          <Card className="border-0 bg-purple-600 text-white shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">Ready to get started?</h3>
              <p className="mb-6 text-purple-100">
                Join thousands of developers building amazing products.
              </p>
              <Button
                size="lg"
                className="bg-white text-purple-600 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-2xl"
              >
                Get Started Free
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
