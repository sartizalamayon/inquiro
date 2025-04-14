"use client"
import type React from "react"
import "@/app/globals.css"
import { Toaster } from "sonner"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const inter = Inter({ subsets: ["latin"] })

const queryClient = new QueryClient();

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
            <QueryClientProvider client={queryClient}>
            <main>{children}</main>
            </QueryClientProvider>
            
            
          </ThemeProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}

