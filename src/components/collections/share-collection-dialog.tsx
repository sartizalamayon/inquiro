"use client"

import { useState } from "react"
import { Users, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

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
  const [email, setEmail] = useState("")
  const [accessLevel, setAccessLevel] = useState("scan")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const { data: session } = useSession()
  const userEmail = session?.user?.email || ""

  const handleShare = async () => {
    if (!email) return

    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:8000/permissions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection_id: collectionId,
          user_email: email,
          access_level: accessLevel,
          granted_by: userEmail,
        }),
      })

      if (response.ok) {
        toast.success("Collection shared successfully")
        setEmail("")
        onOpenChange(false)
      } else {
        const error = await response.json()
        toast.error(`Error sharing collection: ${error.message}`)
      }
    } catch (e) {
      toast.error("An error occurred while sharing the collection")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyLink = () => {
    // In a real app, you would generate a shareable link
    navigator.clipboard.writeText(`http://localhost:3000/shared/${collectionId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Shareable link copied to clipboard")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share collection</DialogTitle>
          <DialogDescription>Share "{collectionName}" with other researchers</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" disabled={!email || isSubmitting} onClick={handleShare}>
              {isSubmitting ? "Sharing..." : "Share"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Permission level</Label>
            <RadioGroup value={accessLevel} onValueChange={setAccessLevel} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scan" id="scan" />
                <Label htmlFor="scan" className="font-normal cursor-pointer">
                  <span className="font-medium">Scan</span> - Can view the collection and papers
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="modify" id="modify" />
                <Label htmlFor="modify" className="font-normal cursor-pointer">
                  <span className="font-medium">Modify</span> - Can view, add tags, rename collection
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="control" id="control" />
                <Label htmlFor="control" className="font-normal cursor-pointer">
                  <span className="font-medium">Control</span> - Full access, can edit papers
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="w-full justify-between" onClick={copyLink}>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Copy shareable link</span>
              </div>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

