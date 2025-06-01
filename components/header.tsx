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
import { Loader2, LogOut, User as UserIcon } from "lucide-react"

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
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold">
            Logo
          </Link>
          <Loader2 className="size-4 animate-spin" />
        </div>
      </header>
    )
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-8 rounded-full"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <UserIcon className="size-4" />
                  <span className="text-sm">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
