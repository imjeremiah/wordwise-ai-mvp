/*
<ai_context>
This server page displays the main dashboard with user stats and quick actions.
It uses Firebase Auth and Firestore to get user data.
</ai_context>
*/

"use server"

import { auth } from "@/lib/firebase-auth"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { redirect } from "next/navigation"
import { 
  CreditCard, 
  User, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  Sparkles
} from "lucide-react"

export default async function DashboardPage() {
  console.log("[Dashboard Page] Checking authentication")
  const { userId } = await auth()
  
  if (!userId) {
    console.log("[Dashboard Page] No user found, redirecting to login")
    redirect("/login")
  }
  
  console.log("[Dashboard Page] Fetching profile for user:", userId)
  const profileResult = await getProfileByUserIdAction(userId)
  const profile = profileResult.isSuccess ? profileResult.data : null
  
  const stats = [
    {
      title: "Monthly Revenue",
      value: "$12,345",
      change: "+12.5%",
      icon: DollarSign,
      gradient: "from-purple-600 to-purple-400"
    },
    {
      title: "Active Users",
      value: "2,345",
      change: "+5.4%",
      icon: User,
      gradient: "from-purple-500 to-purple-300"
    },
    {
      title: "Conversion Rate",
      value: "3.45%",
      change: "+2.1%",
      icon: TrendingUp,
      gradient: "from-purple-600 to-purple-400"
    },
    {
      title: "Avg. Session",
      value: "4m 32s",
      change: "+18.2%",
      icon: Activity,
      gradient: "from-purple-500 to-purple-300"
    }
  ]

  const quickActions = [
    {
      title: "Manage Subscription",
      description: "View and update your billing information",
      icon: CreditCard,
      href: "/dashboard/billing",
      color: "purple"
    },
    {
      title: "Edit Profile",
      description: "Update your personal information",
      icon: User,
      href: "/dashboard/profile",
      color: "blue"
    },
    {
      title: "Account Settings",
      description: "Configure your account preferences",
      icon: Settings,
      href: "/dashboard/settings",
      color: "green"
    }
  ]
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-purple-400 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.displayName || "User"}! 👋
          </h1>
          <p className="text-purple-100 text-lg">
            Here's what's happening with your business today.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)] transition-all duration-300 border-purple-100/20"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg shadow-purple-500/20`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Membership Status */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-100/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Membership Status</CardTitle>
              <CardDescription>Your current plan and benefits</CardDescription>
            </div>
            <Badge 
              variant={profile?.membership === "pro" ? "gradient" : "default"}
              size="lg"
              className="uppercase"
            >
              {profile?.membership || "free"} plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {profile?.membership === "pro" 
                  ? "You have access to all premium features" 
                  : "Upgrade to unlock premium features"}
              </p>
            </div>
            {profile?.membership !== "pro" && (
              <Link href="/pricing">
                <Button variant="gradient" className="group">
                  <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(147,51,234,0.15)] transition-all duration-300 border-purple-100/20 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <action.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {action.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
