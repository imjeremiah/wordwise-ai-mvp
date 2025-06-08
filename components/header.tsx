/*
<ai_context>
This client component provides the header with Firebase auth functionality.
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
  Sparkles,
  Home,
  FileText,
  CreditCard
} from "lucide-react"

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
      <header className="sticky top-0 z-50 border-b border-purple-100/20 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg shadow-purple-500/20 transition-all duration-200 group-hover:shadow-purple-500/30">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
              Firebase Boilerplate
            </span>
          </Link>
          <Loader2 className="size-5 animate-spin text-purple-600" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-purple-100/20 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg shadow-purple-500/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-purple-500/30">
            <Sparkles className="size-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
            Firebase Boilerplate
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {/* Navigation Links */}
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/about">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:bg-purple-50 hover:text-purple-600"
              >
                About
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:bg-purple-50 hover:text-purple-600"
              >
                Pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:bg-purple-50 hover:text-purple-600"
              >
                Contact
              </Button>
            </Link>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-10 rounded-full transition-all duration-200 hover:bg-purple-50"
                >
                  <Avatar className="size-10 border-2 border-purple-100 transition-all duration-200 hover:border-purple-300">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-purple-100/20 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90"
              >
                <DropdownMenuItem className="flex items-center gap-3 text-sm">
                  <UserIcon className="size-4 text-purple-600" />
                  <span className="text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 hover:bg-purple-50 hover:text-purple-600"
                  >
                    <Home className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/billing"
                    className="flex items-center gap-3 hover:bg-purple-50 hover:text-purple-600"
                  >
                    <CreditCard className="size-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
                className="shadow-lg hover:shadow-xl"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
