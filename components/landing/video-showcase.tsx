/*
<ai_context>
This server component provides the video showcase section below the hero.
Shows a large project dashboard preview with purple shadow effects.
</ai_context>
*/

"use server"

import Image from "next/image"

export async function VideoShowcaseSection() {
  console.log("[VideoShowcaseSection] Rendering video showcase")

  return (
    <div className="relative pb-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div
          className="relative scale-100 overflow-hidden rounded-2xl border border-purple-200/20 opacity-100 shadow-2xl transition-all duration-700"
          style={{
            boxShadow: "0 20px 50px rgba(147, 51, 234, 0.15)",
            animationDelay: "600ms"
          }}
        >
          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-purple-900/30 via-purple-900/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-purple-600/10 to-transparent" />

          {/* Video/Image container */}
          <div className="group relative w-full">
            <img
              alt="Agency Project Dashboard"
              width={1920}
              height={1080}
              className="h-auto w-full"
              src="/images/agency-dashboard.svg"
            />

            {/* Play button overlay */}
            <button
              className="absolute inset-0 z-20 flex items-center justify-center"
              aria-label="Play project showcase video"
            >
              <div className="group-hover:shadow-purple-lg flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-500 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 size-8 text-white"
                  aria-hidden="true"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="from-background absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent" />
    </div>
  )
}
