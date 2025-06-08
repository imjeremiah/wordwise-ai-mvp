import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        gradient: "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-[0_10px_40px_rgba(147,51,234,0.3)] hover:shadow-[0_15px_50px_rgba(147,51,234,0.4)] hover:-translate-y-0.5",
        destructive:
          "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        outline:
          "border border-purple-200/50 bg-white/80 hover:bg-purple-50 hover:border-purple-300/50 backdrop-blur-sm",
        secondary:
          "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/50",
        ghost: "bg-purple-50/50 hover:bg-purple-100/50 text-purple-700 backdrop-blur-sm",
        link: "text-purple-600 underline-offset-4 hover:underline hover:text-purple-700"
      },
      size: {
        default: "h-10 px-6 py-2 text-sm rounded-full",
        sm: "h-9 px-4 text-sm rounded-full",
        lg: "h-12 px-8 py-6 text-lg rounded-full",
        xl: "h-14 px-10 py-6 text-lg rounded-full",
        icon: "size-10 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
