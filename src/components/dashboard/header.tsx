"use client"
import React from "react"
import { FileText, FolderOpen, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"


import { ModeToggle } from "@/components/mood-toggle"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserImage from "../user/userImage"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {

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


        {/* Actions */}
        <div className="flex w-full items-center justify-end gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hidden md:flex">
                <UserImage/>
          </Button>
        </div>
      </div>
    </header>
  )
}

