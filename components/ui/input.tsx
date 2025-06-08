import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-border/40 file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-xl border bg-white/50 px-4 py-3 text-[15px] backdrop-blur-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-gray-900/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
