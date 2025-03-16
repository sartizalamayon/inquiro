"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X, FileText, BarChart3, Search } from "lucide-react"
import { ModeToggle } from "@/components/mood-toggle"
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string | null>(null)
  const [scrolled, setScrolled] = React.useState(false)

  const pathname = usePathname();
  // if current path is /signin or /signup

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Update active section based on scroll position
      const sections = ["features", "workflow", "about"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      } else if (window.scrollY < 100) {
        setActiveSection(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 py-2"
            : "bg-transparent py-4",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Brain className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400">
                    Inquiro
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
                    Research Assistant
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {
              pathname !== "/signin" && pathname !== "/signup" && (
                <div className="hidden md:flex items-center space-x-4">
              <div className="bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-full p-1">
                <nav className="flex space-x-1">
                  <NavItem
                    href="#features"
                    isActive={activeSection === "features"}
                    onClick={() => setActiveSection("features")}
                  >
                    Features
                  </NavItem>
                  <NavItem
                    href="#workflow"
                    isActive={activeSection === "workflow"}
                    onClick={() => setActiveSection("workflow")}
                  >
                    How It Works
                  </NavItem>
                  <NavItem href="#about" isActive={activeSection === "about"} onClick={() => setActiveSection("about")}>
                    About
                  </NavItem>
                </nav>
              </div>

              <div className="flex items-center space-x-3 pl-3 border-l border-zinc-200 dark:border-zinc-700">
                <ModeToggle />
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="relative overflow-hidden group">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-zinc-400 to-zinc-600 dark:from-zinc-700 dark:to-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative">Sign Up</span>
                  </Button>
                </Link>
              </div>
            </div>
              )
            }

            {/* Mobile menu button */}
            {pathname !== "/signin" && pathname !== "/signup" && (<div className="flex md:hidden items-center space-x-2">
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
                <span className="sr-only">Toggle menu</span>
                {!isOpen ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
            </div>)}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md pt-16 md:hidden">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
              <div className="space-y-1 px-2">
                <MobileNavItem
                  href="#features"
                  onClick={() => {
                    setIsOpen(false)
                    setActiveSection("features")
                  }}
                  isActive={activeSection === "features"}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  Features
                </MobileNavItem>
                <MobileNavItem
                  href="#workflow"
                  onClick={() => {
                    setIsOpen(false)
                    setActiveSection("workflow")
                  }}
                  isActive={activeSection === "workflow"}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  How It Works
                </MobileNavItem>
                <MobileNavItem
                  href="#about"
                  onClick={() => {
                    setIsOpen(false)
                    setActiveSection("about")
                  }}
                  isActive={activeSection === "about"}
                >
                  <Search className="w-5 h-5 mr-3" />
                  About
                </MobileNavItem>
              </div>
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col space-y-3">
                  <Link href="/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-start">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface NavItemProps {
  href: string
  isActive?: boolean
  children: React.ReactNode
  onClick?: () => void
}

function NavItem({ href, isActive, children, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center",
        isActive
          ? "text-zinc-900 dark:text-zinc-100"
          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
      )}
    >
      {children}
      {isActive && <span className="absolute inset-0 rounded-full bg-white dark:bg-zinc-800 -z-10 shadow-sm"></span>}
    </Link>
  )
}

interface MobileNavItemProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
  isActive?: boolean
}

function MobileNavItem({ href, children, onClick, isActive }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800",
      )}
    >
      {children}
    </Link>
  )
}

