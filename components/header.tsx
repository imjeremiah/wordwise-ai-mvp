/*
<ai_context>
This client component provides the header with Firebase auth functionality.
Updated with beautiful glassmorphism navigation bar design.
Now hides initially and shows after scrolling.
</ai_context>
*/

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { onAuthStateChanged, User, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2,
  LogOut,
  User as UserIcon,
  Code2,
  Home,
  CreditCard,
  Menu,
  X
} from "lucide-react"

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)

  console.log("[Header] Component rendered")

  useEffect(() => {
    console.log("[Header] Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      console.log(
        "[Header] Auth state changed, user:",
        firebaseUser?.uid || "null"
      )
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 10)

      // Show navbar after scrolling down 100px
      if (scrollY > 100) {
        setShowNavbar(true)
      } else {
        setShowNavbar(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    console.log("[Header] Signing out user")
    try {
      await signOut(auth)
      console.log("[Header] Sign out successful")

      // Clear session cookie
      await fetch("/api/auth/session", {
        method: "DELETE"
      })

      router.push("/login")
    } catch (error) {
      console.error("[Header] Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <nav
        className={`glass-navbar fixed left-1/2 top-8 z-50 flex h-[58px] w-[95%] max-w-[1050px] -translate-x-1/2 items-center justify-between rounded-full px-3 py-1.5 transition-all duration-500 sm:px-4 ${
          scrolled ? "scrolled" : ""
        } ${
          showNavbar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex h-[44px] w-[120px] items-center sm:w-[140px]">
          <Link
            className="block transition-opacity duration-200 hover:no-underline hover:opacity-90 active:no-underline"
            href="/"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 shadow-sm">
                <Code2 className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold">CCO Vibe</span>
            </div>
          </Link>
        </div>
        <Loader2 className="size-5 animate-spin text-purple-600" />
      </nav>
    )
  }

  return (
    <>
      <nav
        className={`glass-navbar fixed left-1/2 top-8 z-50 flex h-[58px] w-[95%] max-w-[1050px] -translate-x-1/2 items-center justify-between rounded-full px-3 py-1.5 transition-all duration-500 sm:px-4 ${
          scrolled ? "scrolled" : ""
        } ${
          showNavbar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex h-[44px] w-[120px] items-center sm:w-[140px]">
          <Link
            className="block transition-opacity duration-200 hover:no-underline hover:opacity-90 active:no-underline"
            href="/"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 shadow-sm">
                <Code2 className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold">CCO Vibe</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            className="font-instrument text-[15px] font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
            href="/about"
          >
            About
          </Link>
          <Link
            className="font-instrument text-[15px] font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
            href="/services"
          >
            Services
          </Link>
          <Link
            className="font-instrument text-[15px] font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
            href="/#pricing"
          >
            Pricing
          </Link>
          <Link
            className="font-instrument text-[15px] font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
            href="/#faq"
          >
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-9 rounded-full border border-purple-200/30 transition-all duration-200 hover:bg-purple-100/50 dark:border-purple-700/30 dark:hover:bg-purple-900/30"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-400 text-sm text-white">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-purple-100/20 bg-white/90 shadow-xl backdrop-blur-xl dark:bg-gray-900/90"
              >
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 text-sm">
                  <UserIcon className="size-4 text-purple-600" />
                  <span className="text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-600"
                  >
                    <Home className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/billing"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-600"
                  >
                    <CreditCard className="size-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Button
                variant="ghost"
                asChild
                className="hover:bg-purple-50 hover:text-purple-600"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                variant="gradient"
                asChild
                className="hover-lift shadow-md hover:shadow-lg"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-xl border border-purple-200/30 bg-purple-50/50 transition-all duration-200 hover:bg-purple-100/50 md:hidden dark:border-purple-700/30 dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="size-4 text-purple-700 dark:text-purple-300" />
            ) : (
              <Menu className="size-4 text-purple-700 dark:text-purple-300" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && showNavbar && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-x-4 top-20 rounded-2xl border border-purple-100/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:bg-gray-900/95">
            <nav className="flex flex-col gap-4">
              <Link
                className="py-2 text-lg font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                className="py-2 text-lg font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                className="py-2 text-lg font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                className="py-2 text-lg font-medium text-purple-700/80 transition-colors duration-200 hover:text-purple-700"
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              {!user && (
                <div className="mt-4 flex flex-col gap-3 border-t border-purple-100/20 pt-4">
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-center hover:bg-purple-50 hover:text-purple-600"
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  </Button>
                  <Button
                    variant="gradient"
                    asChild
                    className="w-full justify-center shadow-md hover:shadow-lg"
                  >
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
