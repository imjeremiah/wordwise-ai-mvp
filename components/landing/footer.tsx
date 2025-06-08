/*
<ai_context>
This server component provides the footer.
Contains company info, links, and social media.
</ai_context>
*/

"use server"

import Link from "next/link"
import { Code2, Github, Twitter, Linkedin, Youtube } from "lucide-react"

export async function Footer() {
  console.log("[Footer] Rendering footer")

  const currentYear = new Date().getFullYear()

  return (
    <footer className="from-background to-muted/30 border-t border-purple-100/20 bg-gradient-to-b">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company info */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 shadow-sm">
                <Code2 className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold">DevAgency</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Stop renting software. Start owning it. We build custom platforms
              in 2 weeks that you'll own forever.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="#projects"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#faq"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#consultation-form"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  Book a Call
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="mb-4 font-semibold">Stay Connected</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Follow us for AI development tips and success stories.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-purple-100 transition-colors hover:bg-purple-200"
                aria-label="GitHub"
              >
                <Github className="size-5 text-purple-600" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-purple-100 transition-colors hover:bg-purple-200"
                aria-label="Twitter"
              >
                <Twitter className="size-5 text-purple-600" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-purple-100 transition-colors hover:bg-purple-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5 text-purple-600" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-purple-100 transition-colors hover:bg-purple-200"
                aria-label="YouTube"
              >
                <Youtube className="size-5 text-purple-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-purple-100/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground text-sm">
              © {currentYear} DevAgency. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground transition-colors hover:text-purple-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground transition-colors hover:text-purple-600"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
