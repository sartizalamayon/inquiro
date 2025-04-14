"use client"
import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}