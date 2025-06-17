/*
<ai_context>
This is the main sidebar component for the dashboard.
Uses shadcn's sidebar components with purple-centric design.
</ai_context>
*/

"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  User,
  Home,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { FirebaseProfile } from "@/types/firebase-types"

interface AppSidebarProps {
  profile: FirebaseProfile | null
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)

  const handleLogout = async () => {
    console.log("[Sidebar] Logging out...")

    try {
      // Delete session
      const response = await fetch("/api/auth/session", {
        method: "DELETE"
      })

      if (response.ok) {
        console.log("[Sidebar] Logout successful, redirecting...")
        router.push("/login")
      } else {
        console.error("[Sidebar] Failed to logout")
      }
    } catch (error) {
      console.error("[Sidebar] Logout error:", error)
    }
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard"
    },
    {
      title: "Editor",
      icon: FileText,
      href: "/editor"
    },
    {
      title: "Account",
      icon: User,
      items: [
        {
          title: "Profile",
          href: "/dashboard/profile"
        },
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: Settings
        },
        {
          title: "Billing",
          href: "/dashboard/billing",
          icon: CreditCard
        }
      ]
    }
  ]

  return (
    <Sidebar className="border-r border-purple-100/20">
      <SidebarHeader className="border-b border-purple-100/20">
        <Link href="/" className="group flex items-center gap-3 px-2 py-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg shadow-purple-500/20 transition-shadow group-hover:shadow-purple-500/30">
            <span className="text-sm font-bold text-white">FB</span>
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-lg font-semibold text-transparent">
            Firebase Boilerplate
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="from-background bg-gradient-to-b to-purple-50/20">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map(item => (
              <React.Fragment key={item.title}>
                {item.items ? (
                  <Collapsible
                    open={isProfileOpen}
                    onOpenChange={setIsProfileOpen}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="hover:bg-purple-50 hover:text-purple-700 data-[state=open]:bg-purple-50 data-[state=open]:text-purple-700">
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className="hover:bg-purple-50 hover:text-purple-700"
                              >
                                <Link href={subItem.href}>
                                  {subItem.icon && (
                                    <subItem.icon className="size-4" />
                                  )}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-purple-50 hover:text-purple-700"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-purple-100/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 data-[state=open]:bg-purple-50 data-[state=open]:text-purple-700"
                >
                  <Avatar className="mr-2 size-8 border-2 border-purple-200/50">
                    <AvatarImage
                      src={profile?.photoURL || ""}
                      alt={profile?.displayName}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
                      {profile?.displayName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">
                      {profile?.displayName || "User"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {profile?.email}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] border-purple-100/20 bg-white/90 backdrop-blur-md dark:bg-gray-900/90"
                align="start"
              >
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-purple-50 hover:text-purple-700"
                >
                  <Link href="/dashboard/profile">
                    <User className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-purple-50 hover:text-purple-700"
                >
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-purple-100/20" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
