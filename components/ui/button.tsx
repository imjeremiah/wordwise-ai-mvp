import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/20 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
        purple:
          "bg-purple-600 text-white shadow-lg hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl",
        gradient:
          "border-2 border-purple-600 bg-white text-purple-600 shadow-lg hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm",
        outlinePurple:
          "border border-purple-600 bg-white text-purple-600 hover:bg-purple-50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        secondaryPurple:
          "border border-purple-200 bg-white text-purple-700 hover:bg-purple-50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        ghostPurple: "bg-transparent text-purple-700 hover:bg-purple-50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 rounded-full px-6 py-2 text-sm",
        sm: "h-9 rounded-full px-4 text-sm",
        lg: "h-12 rounded-full px-8 py-6 text-lg",
        xl: "h-14 rounded-full px-10 py-6 text-lg",
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
