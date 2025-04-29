"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, FolderOpen, Settings, Search, LogOut, Brain, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)
  const session = useSession()
  const userEmail = session.data?.user?.email || ""
  const userName = session.data?.user?.name || "Username"
  
  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed left-4 top-4 z-40"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 border-r bg-background transition-transform md:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b px-6 py-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="text-lg font-semibold">Inquiro</span>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              <NavItem href="/dashboard" icon={<BarChart3 className="h-4 w-4" />} isActive={pathname === "/dashboard"}>
                Analytics
              </NavItem>
              <NavItem
                href="/dashboard/papers"
                icon={<FileText className="h-4 w-4" />}
                isActive={pathname === "/dashboard/papers" || pathname.startsWith("/dashboard/papers/")}
              >
                Papers
              </NavItem>
              <NavItem
                href="/dashboard/collections"
                icon={<FolderOpen className="h-4 w-4" />}
                isActive={pathname === "/dashboard/collections" || pathname.startsWith("/dashboard/collections/")}
              >
                Collections
              </NavItem>
              <NavItem
                href="/dashboard/search"
                icon={<Search className="h-4 w-4" />}
                isActive={pathname === "/dashboard/search"}
              >
                Search
              </NavItem>

              <div className="mt-6 px-3">
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">Settings</h3>
                <NavItem
                  href="/dashboard/settings"
                  icon={<Settings className="h-4 w-4" />}
                  isActive={pathname === "/dashboard/settings"}
                >
                  Settings
                </NavItem>
              </div>
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">US</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  isActive?: boolean
  children: React.ReactNode
}

function NavItem({ href, icon, isActive, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <span
        className={cn(
          "transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground",
        )}
      >
        {icon}
      </span>
      {children}
    </Link>
  )
}

