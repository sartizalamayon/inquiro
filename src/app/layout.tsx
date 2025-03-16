"use client"

import type React from "react"

import "@/app/globals.css"
import { Toaster } from "sonner" // Changed import path from "@/components/ui/sonner" to "sonner"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

// Note: metadata can't be used with 'use client' directive
// If you need metadata, consider moving it to a separate file or using a different approach

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Inquiro - AI-Powered Research Assistant</title>
        <meta name="description" content="Summarize, search, and collaborate on research papers with ease." />
      </head>
      <body className={`antialiased ${inter.className}`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            storageKey="app-theme"
          >
            <main>{children}</main>
            
          </ThemeProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}

