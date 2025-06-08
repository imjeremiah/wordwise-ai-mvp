/*
<ai_context>
This login page allows users to sign in with email/password or Google.
It uses Firebase Authentication and creates a session cookie on successful login.
</ai_context>
*/

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[Login Page] Attempting email login for:", email)
    setLoading(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log(
        "[Login Page] Login successful for user:",
        userCredential.user.uid
      )

      // Check if this is a new user (unlikely for login, but check anyway)
      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime
      console.log("[Login Page] Is new user:", isNewUser)

      // Get the ID token
      const idToken = await userCredential.user.getIdToken()
      console.log("[Login Page] Got ID token, creating session...")

      // Send token to server to create session
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken, isNewUser })
      })

      if (response.ok) {
        console.log("[Login Page] Session created, redirecting to dashboard")
        router.push("/dashboard")
      } else {
        throw new Error("Failed to create session")
      }
    } catch (error: any) {
      console.error("[Login Page] Login error:", error)
      setError(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    console.log("[Login Page] Attempting Google login")
    setLoadingGoogle(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      console.log(
        "[Login Page] Google login successful for user:",
        userCredential.user.uid
      )

      // Check if this is a new user
      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime
      console.log("[Login Page] Is new user:", isNewUser)

      // Get the ID token
      const idToken = await userCredential.user.getIdToken()
      console.log("[Login Page] Got ID token, creating session...")

      // Send token to server to create session
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken, isNewUser })
      })

      if (response.ok) {
        console.log("[Login Page] Session created, redirecting to dashboard")
        router.push("/dashboard")
      } else {
        throw new Error("Failed to create session")
      }
    } catch (error: any) {
      console.error("[Login Page] Google login error:", error)
      setError(error.message || "Failed to sign in with Google")
    } finally {
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50/30 p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-purple-300/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <Card className="relative border border-purple-100/20 bg-white/50 shadow-[0_8px_30px_rgba(147,51,234,0.12)] backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-2 text-center">
            <div className="mb-6 flex justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 shadow-[0_10px_40px_rgba(147,51,234,0.3)]"
              >
                <span className="font-instrument text-3xl font-bold text-white">
                  FB
                </span>
              </motion.div>
            </div>
            <CardTitle className="font-instrument bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to continue to your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 px-6 pb-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert
                  variant="destructive"
                  className="border-red-200/50 bg-red-50/50 backdrop-blur-sm"
                >
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground/90 text-sm font-medium"
                >
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="text-muted-foreground/50 absolute left-3.5 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-11 pl-10"
                    placeholder="name@example.com"
                    required
                    disabled={loading || loadingGoogle}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-foreground/90 text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="text-muted-foreground/50 absolute left-3.5 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-11 pl-10"
                    placeholder="Enter your password"
                    required
                    disabled={loading || loadingGoogle}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="gradient"
                size="lg"
                disabled={loading || loadingGoogle}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in to dashboard
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-purple-100/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground rounded-full bg-white/50 px-3 py-1 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 w-full border-purple-200/30 bg-white/50 hover:border-purple-300/50 hover:bg-purple-50/50"
              onClick={handleGoogleLogin}
              disabled={loading || loadingGoogle}
            >
              {loadingGoogle ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 size-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-purple-100/20 pt-6 text-center">
            <div className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-purple-600 underline-offset-4 transition-colors hover:text-purple-700 hover:underline"
              >
                Create free account
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/30 bg-white/50 px-4 py-2 backdrop-blur-sm">
            <div className="size-2 animate-pulse rounded-full bg-gradient-to-r from-purple-600 to-purple-400" />
            <span className="text-muted-foreground text-xs font-medium">
              Trusted by 10,000+ developers
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
