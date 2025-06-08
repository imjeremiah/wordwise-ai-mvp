/*
<ai_context>
This client component provides a Twitter-style testimonials carousel.
Shows live case studies with video testimonials in a marquee animation.
</ai_context>
*/

"use client"

import {
  Badge,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark
} from "lucide-react"

interface Testimonial {
  name: string
  handle: string
  avatar: string
  role: string
  company: string
  content: string
  videoPoster: string
  videoSrc: string
  likes: number
  retweets: number
  comments: number
  timeAgo: string
  verified?: boolean
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    handle: "elonmusk",
    avatar: "https://unavatar.io/twitter/elonmusk",
    role: "CEO",
    company: "TechStartup",
    content:
      "They built our entire internal communication platform in 12 days. We're saving $50k/year compared to Slack. The AI features they added are incredible. Best decision we've made.",
    videoPoster: "/images/testimonials/testimonial-1-poster.jpg",
    videoSrc: "/videos/testimonials/testimonial-1.mp4",
    likes: 892,
    retweets: 136,
    comments: 24,
    timeAgo: "2d",
    verified: true
  },
  {
    name: "Michael Rodriguez",
    handle: "sama",
    avatar: "https://unavatar.io/twitter/sama",
    role: "CTO",
    company: "Enterprise",
    content:
      "Replaced our $30k/year project management tool with a custom solution. It's faster, has better UX, and includes AI features we couldn't get anywhere else. Delivered in just 2 weeks!",
    videoPoster: "/images/testimonials/testimonial-2-poster.jpg",
    videoSrc: "/videos/testimonials/testimonial-2.mp4",
    likes: 523,
    retweets: 97,
    comments: 18,
    timeAgo: "1w"
  },
  {
    name: "Emily Watson",
    handle: "naval",
    avatar: "https://unavatar.io/twitter/naval",
    role: "Founder",
    company: "FinTech",
    content:
      "Built our MVP in 14 days. We went from idea to live product with real users. The AI powered analytics they included helped us find product market fit immediately. Worth every penny!",
    videoPoster: "/images/testimonials/testimonial-3-poster.jpg",
    videoSrc: "/videos/testimonials/testimonial-3.mp4",
    likes: 1243,
    retweets: 218,
    comments: 42,
    timeAgo: "3d",
    verified: true
  },
  {
    name: "David Park",
    handle: "balajis",
    avatar: "https://unavatar.io/twitter/balajis",
    role: "Head of Ops",
    company: "Logistics",
    content:
      "Automated our entire inventory management system. What used to take 3 full time employees now runs automatically. ROI in less than 2 months. These guys are wizards!",
    videoPoster: "/images/testimonials/testimonial-4-poster.jpg",
    videoSrc: "/videos/testimonials/testimonial-4.mp4",
    likes: 789,
    retweets: 156,
    comments: 31,
    timeAgo: "5d",
    verified: true
  },
  {
    name: "Jessica Liu",
    handle: "esthercrawford",
    avatar: "https://unavatar.io/twitter/esthercrawford",
    role: "VP Product",
    company: "SaaS",
    content:
      "They rebuilt our customer portal from scratch with AI support features. Customer satisfaction up 40%, support tickets down 60%. Delivered ahead of schedule too!",
    videoPoster: "/images/testimonials/testimonial-5-poster.jpg",
    videoSrc: "/videos/testimonials/testimonial-5.mp4",
    likes: 456,
    retweets: 89,
    comments: 27,
    timeAgo: "1w"
  },
  {
    name: "Robert Thompson",
    handle: "jason",
    avatar: "https://unavatar.io/twitter/jason",
    role: "CEO",
    company: "Manufacturing",
    content:
      "Custom ERP system that replaced 5 different tools we were using. Saves us $200k/year in licensing fees. The AI predictions for demand forecasting are game changing.",
    videoPoster: "/images/testimonials/testimonial-6-poster.jpg",
    videoSrc: "/videos/testimonials/testimonial-6.mp4",
    likes: 678,
    retweets: 124,
    comments: 38,
    timeAgo: "2w",
    verified: true
  }
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="mx-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:scale-[1.02]"
      style={{ width: "320px", height: "560px" }}
    >
      <div className="flex h-full flex-col p-4">
        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="size-10 shrink-0 rounded-full"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900">
                {testimonial.name}
              </span>
              {testimonial.verified && (
                <svg
                  className="size-3.5 shrink-0 text-purple-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500">
                {testimonial.role} @{testimonial.company}
              </span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{testimonial.timeAgo}</span>
            </div>
          </div>
          <button className="rounded-full p-1.5 transition-colors hover:bg-gray-100">
            <svg
              className="size-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-3 text-sm leading-normal text-gray-900">
          {testimonial.content}
        </div>

        {/* Video */}
        <div className="relative mb-3 flex-1 overflow-hidden rounded-xl border border-gray-200">
          <video
            className="size-full object-cover"
            poster={testimonial.videoPoster}
            controls
            preload="metadata"
          >
            <source src={testimonial.videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Actions */}
        <div className="-mx-2 flex items-center justify-between">
          <button className="group/btn flex items-center gap-1 rounded-full p-2 transition-colors hover:bg-purple-50">
            <MessageCircle className="size-4 text-gray-500 group-hover/btn:text-purple-600" />
            <span className="text-xs text-gray-500 group-hover/btn:text-purple-600">
              {testimonial.comments}
            </span>
          </button>
          <button className="group/btn flex items-center gap-1 rounded-full p-2 transition-colors hover:bg-green-50">
            <Repeat2 className="size-4 text-gray-500 group-hover/btn:text-green-600" />
            <span className="text-xs text-gray-500 group-hover/btn:text-green-600">
              {testimonial.retweets}
            </span>
          </button>
          <button className="group/btn flex items-center gap-1 rounded-full p-2 transition-colors hover:bg-red-50">
            <Heart className="size-4 text-gray-500 group-hover/btn:text-red-600" />
            <span className="text-xs text-gray-500 group-hover/btn:text-red-600">
              {testimonial.likes}
            </span>
          </button>
          <button className="group/btn rounded-full p-2 transition-colors hover:bg-blue-50">
            <Share className="size-4 text-gray-500 group-hover/btn:text-blue-600" />
          </button>
          <button className="group/btn rounded-full p-2 transition-colors hover:bg-blue-50">
            <Bookmark className="size-4 text-gray-500 group-hover/btn:text-blue-600" />
          </button>
        </div>
      </div>
    </article>
  )
}

export function TestimonialsSection() {
  console.log("[TestimonialsSection] Rendering testimonials")

  return (
    <section className="pt-12 lg:py-24" id="testimonials">
      <div className="mb-12 text-center">
        <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
          Live Case Studies
        </h2>
        <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
          Watch us build{" "}
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            real software in real time
          </span>
        </h3>
        <p className="text-muted-foreground mt-4 text-lg">
          See exactly how we use AI to build 10x faster
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative">
        <div className="group flex flex-row overflow-hidden p-2 [--duration:80s] [--gap:1rem] [gap:var(--gap)]">
          {/* First set of testimonials */}
          <div className="animate-marquee flex shrink-0 flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`first-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>

          {/* Duplicate set for seamless loop */}
          <div
            className="animate-marquee flex shrink-0 flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`second-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
      </div>
    </section>
  )
}
