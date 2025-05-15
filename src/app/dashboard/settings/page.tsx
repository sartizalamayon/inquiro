"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Lock, Clock, LogOut, Save, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout"

interface UserProfile {
  _id: string
  name: string
  email: string
  auth_provider: string
  created_at: string
  updated_at?: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("profile")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.email) return

      setLoading(true)
      try {
        const response = await fetch(`http://localhost:8000/users/${encodeURIComponent(session.user.email)}`)
        if (!response.ok) throw new Error("Failed to fetch user profile")

        const userData = await response.json()
        setUserProfile(userData)
        setName(userData.name || "")
        setEmail(userData.email || "")
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [session])

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !session?.user?.email) {
      toast.error("Name and email are required")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(
        `http://localhost:8000/users/${encodeURIComponent(session.user.email)}/${encodeURIComponent(name)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to update profile")
      }

      const updatedUser = await response.json()
      setUserProfile(updatedUser)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  // Handle password change
 

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSignOutAllDevices = async () => {
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container max-w-5xl py-10">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <p className="mt-4 text-zinc-500 dark:text-zinc-400">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container max-w-5xl">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account settings and preferences</p>
          </div>

          <Separator className="my-6" />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-0">
                  <TabsTrigger
                    value="profile"
                    className="justify-start px-3 py-2 h-9 font-normal data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="justify-start px-3 py-2 h-9 font-normal data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="md:w-3/4">
                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your account profile information</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleProfileUpdate}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            disabled={userProfile?.auth_provider !== "email"}
                          />
                            {userProfile?.auth_provider !== "email" && (
                                <p className="text-xs text-zinc-500 mt-1">
                                Name cannot be changed for {userProfile?.auth_provider} accounts.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            disabled={true}
                          />
                          {userProfile?.auth_provider !== "email" && (
                            <p className="text-xs text-zinc-500 mt-1">
                              Email cannot be changed.
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Account Information</Label>
                          <div className="rounded-md bg-zinc-50 dark:bg-zinc-900 p-4 text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-zinc-500" />
                              <span className="text-zinc-500">Member since:</span>
                              <span>{userProfile?.created_at ? formatDate(userProfile.created_at) : "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-zinc-500" />
                              <span className="text-zinc-500">Authentication:</span>
                              <span className="capitalize">{userProfile?.auth_provider || "Email"}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end mt-2">
                        <Button type="submit" disabled={userProfile?.auth_provider !== "email" || saving}>
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your password and security preferences</CardDescription>
                    </CardHeader>
                    
                      <CardContent>
                        <div className="rounded-md bg-zinc-50 dark:bg-zinc-900 p-4 text-sm">
                          <p>
                            Password management is not available Yet. Please check back later for this feature.
                          </p>
                        </div>
                      </CardContent>
               

                    <Separator className="my-4" />

                    <CardHeader>
                      <CardTitle>Session Management</CardTitle>
                      <CardDescription>Manage your active sessions and account access</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive" className="w-full sm:w-auto" onClick={handleSignOutAllDevices}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out of All Devices
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
