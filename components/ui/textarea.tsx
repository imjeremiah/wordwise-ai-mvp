import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "border-border/40 placeholder:text-muted-foreground flex min-h-[80px] w-full resize-none rounded-xl border bg-white/50 px-4 py-3 text-[15px] backdrop-blur-sm transition-all duration-200 focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-gray-900/50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
