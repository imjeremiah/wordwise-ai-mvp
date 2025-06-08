import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "rounded-full border border-purple-200/50 bg-purple-50 px-4 py-2 text-sm text-purple-900",
        gradient:
          "rounded-full bg-gradient-to-r from-purple-600 to-purple-400 px-5 py-2 text-[13px] font-semibold text-white shadow-lg",
        secondary:
          "rounded-full border border-gray-200/50 bg-gray-100 px-4 py-2 text-sm text-gray-700",
        destructive:
          "rounded-full border border-red-200/50 bg-red-50 px-4 py-2 text-sm text-red-900",
        outline: "border-border rounded-full border px-4 py-2 text-sm",
        trust:
          "gap-2 rounded-full border border-purple-200/30 bg-white/50 px-4 py-2 text-sm backdrop-blur-sm",
        feature: "gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm"
      },
      size: {
        default: "",
        sm: "px-3 py-1 text-xs",
        lg: "px-5 py-2.5 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
