"use client"
import React from "react"
import { Bell, Plus, Search, FileText, FolderOpen, BarChart3, User, X, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mood-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [showSearchOnMobile, setShowSearchOnMobile] = React.useState(false)

  return (
    <header
      className={`sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 ${className}`}
    >
      <div className="hidden md:block md:w-64 md:shrink-0 transition-all duration-300 ease-in-out" />

      <div className="w-full flex items-center justify-between gap-2">
        {/* Mobile Navigation Spacer */}
        <div className="w-8 md:hidden" />

        {/* Quick Navigation Tabs (Visible on medium screens) */}
        <div className="hidden md:flex lg:hidden">
          <Tabs defaultValue="dashboard">
            <TabsList className="h-9">
              <TabsTrigger value="dashboard" className="h-8 px-3">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="papers" className="h-8 px-3">
                <FileText className="h-4 w-4 mr-2" />
                Papers
              </TabsTrigger>
              <TabsTrigger value="collections" className="h-8 px-3">
                <FolderOpen className="h-4 w-4 mr-2" />
                Collections
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search - Responsive */}
        <div
          className={cn(
            "relative transition-all duration-200",
            showSearchOnMobile ? "w-full" : "hidden sm:flex sm:w-full sm:max-w-md",
          )}
        >
          {showSearchOnMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-0 sm:hidden"
              onClick={() => setShowSearchOnMobile(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          )}
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search papers, collections..."
            className={cn("w-full bg-background", showSearchOnMobile ? "pl-10" : "pl-8")}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!showSearchOnMobile && (
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setShowSearchOnMobile(true)}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 hidden sm:flex">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">New</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Upload Paper</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>New Collection</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Button variant="ghost" size="sm" className="h-auto p-1 text-xs font-normal">
                  Mark all as read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                {
                  title: "New paper summary ready",
                  description: "Your uploaded paper has been processed",
                  time: "2 minutes ago",
                  icon: <FileText className="h-4 w-4" />,
                  unread: true,
                },
                {
                  title: "Collection shared with you",
                  description: "Jane Smith shared 'AI Research' with you",
                  time: "1 hour ago",
                  icon: <FolderOpen className="h-4 w-4" />,
                  unread: true,
                },
                {
                  title: "Weekly analytics report",
                  description: "Your research activity summary is available",
                  time: "1 day ago",
                  icon: <BarChart3 className="h-4 w-4" />,
                  unread: false,
                },
              ].map((notification, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start p-0">
                  <div className="flex w-full gap-3 p-2 cursor-pointer">
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full",
                        notification.unread ? "bg-primary/10" : "bg-muted",
                      )}
                    >
                      {notification.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        {notification.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground/60">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hidden md:flex">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

