"use client"

import { useState, useEffect } from "react"
import { Users, Copy, Check, Trash2, Mail, Shield, Share2, UserPlus, Eye, Pencil, Key } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useCollectionPermissions, type UserSummary, type PermissionUpdate } from "@/hooks/useCollectionPermissions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ShareCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionId: string
  collectionName: string
}

export function ShareCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  collectionName,
}: ShareCollectionDialogProps) {
  const { data: session } = useSession()
  const currentUserEmail = session?.user?.email || ""

  // Local form state
  const [email, setEmail] = useState("")
  const [accessLevel, setAccessLevel] = useState<"scan" | "modify" | "control">("scan")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  // Shared users list
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Hook: fetch/update/remove
  const { getUsersAccess, updateUserPermission } = useCollectionPermissions(collectionId)

  async function removeUserAccess(email: string) {
    try {
      const response = await fetch(`http://localhost:8000/permissions/${collectionId}/${email}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        toast.error("Failed to revoke access")
        throw new Error("Failed to revoke access")
      }
      toast.success("Access revoked")
    } catch (error) {
      console.error("Error revoking access:", error)
      throw error
    }
  }

  // Load list on open
  useEffect(() => {
    if (!open) return
    setLoadingUsers(true)
    getUsersAccess()
      .then(setUsers)
      .catch((err) => toast.error(`Failed to load users: ${err}`))
      .finally(() => setLoadingUsers(false))
  }, [open, getUsersAccess])

  // Share new user
  const handleShare = async () => {
    if (!email) return

    if (email === currentUserEmail) {
      toast.error("You cannot share with yourself")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch(`http://localhost:8000/permissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection_id: collectionId,
          user_email: email,
          access_level: accessLevel,
          granted_by: currentUserEmail,
        }),
      })
      if (!res.ok) throw await res.json()
      toast.success("Collection shared")
      setEmail("")
      // refresh list
      const updated = await getUsersAccess()
      setUsers(updated)
    } catch (err: any) {
      toast.error(`Share failed: ${err.detail || err}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Change a user's permission
  const handleChangeAccess = async (user: UserSummary, newLevel: UserSummary["access_level"]) => {
    try {
      const payload: PermissionUpdate = {
        access_level: newLevel,
        granted_by: currentUserEmail,
      }
      await updateUserPermission(user.email, payload)
      toast.success(`Permission updated for ${user.name}`)
      const updated = await getUsersAccess()
      setUsers(updated)
    } catch (err: any) {
      toast.error(`Update failed: ${err.detail || err}`)
    }
  }

  // Remove a user
  const handleRemoveUser = async (user: UserSummary) => {
    try {
      await removeUserAccess(user.email)
      toast.success(`Access revoked for ${user.name}`)
      setUsers((u) => u.filter((x) => x.email !== user.email))
    } catch (err: any) {
      toast.error(`Revoke failed: ${err.detail || err}`)
    }
  }

  // Copy shareable link
  const copyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/shared/${collectionId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Shareable link copied")
  }

  // Get permission icon
  const getPermissionIcon = (level: string) => {
    switch (level) {
      case "scan":
        return <Eye className="h-4 w-4" />
      case "modify":
        return <Pencil className="h-4 w-4" />
      case "control":
        return <Key className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Collection
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Share "{collectionName}" with other researchers
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        {/* New share form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-input" className="text-sm font-medium">
              Invite via email
            </Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="email-input"
                  placeholder="colleague@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>
              <Button
                size="default"
                disabled={!email || isSubmitting}
                onClick={handleShare}
                className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
              >
                {isSubmitting ? (
                  "Sharing…"
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Permission level</Label>
            <RadioGroup
              value={accessLevel}
              onValueChange={(v) => setAccessLevel(v as any)}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { value: "scan", label: "Scan", icon: <Eye className="h-3 w-3" /> },
                { value: "modify", label: "Modify", icon: <Pencil className="h-3 w-3" /> },
                { value: "control", label: "Control", icon: <Key className="h-3 w-3" /> },
              ].map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-center space-x-2 rounded-md border border-zinc-200 dark:border-zinc-800 p-3 cursor-pointer transition-all",
                    accessLevel === option.value
                      ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  )}
                  onClick={() => setAccessLevel(option.value as any)}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  {option.icon}
                  <Label htmlFor={option.value} className="cursor-pointer font-medium">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Existing shared users */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              People with access
            </Label>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {users.length} {users.length === 1 ? "person" : "people"}
            </span>
          </div>

          {loadingUsers ? (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">Loading collaborators...</div>
          ) : users.length === 0 ? (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md">
              No users have access yet
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-auto pr-1">
              {users.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between space-x-3 p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Avatar className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm">{user.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Select
                      value={user.access_level}
                      onValueChange={(value) => handleChangeAccess(user, value as UserSummary["access_level"])}
                    >
                      <SelectTrigger className="h-8 w-24 bg-transparent border-zinc-200 dark:border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scan" className="flex items-center">
                          <div className="flex items-center">
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            Scan
                          </div>
                        </SelectItem>
                        <SelectItem value="modify">
                          <div className="flex items-center">
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Modify
                          </div>
                        </SelectItem>
                        <SelectItem value="control">
                          <div className="flex items-center">
                            <Key className="mr-2 h-3.5 w-3.5" />
                            Control
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveUser(user)}
                      title="Revoke access"
                      className="h-8 w-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <Trash2 className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       
      </DialogContent>
    </Dialog>
  )
}
