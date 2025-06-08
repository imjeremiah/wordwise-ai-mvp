import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center transition-all duration-200 font-medium",
  {
    variants: {
      variant: {
        default:
          "px-4 py-2 bg-purple-50 text-purple-900 rounded-full text-sm border border-purple-200/50",
        gradient:
          "px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-full text-[13px] font-semibold shadow-lg",
        secondary:
          "px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200/50",
        destructive:
          "px-4 py-2 bg-red-50 text-red-900 rounded-full text-sm border border-red-200/50",
        outline: 
          "px-4 py-2 border border-border rounded-full text-sm",
        trust:
          "gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-purple-200/30 text-sm",
        feature:
          "gap-2 px-4 py-2 bg-purple-50 rounded-full text-sm"
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
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
