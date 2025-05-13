"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UseCollectionPermissionsProps {
  collectionId: string
  isSharedCollection?: boolean
}

export function useCollectionPermissions({ collectionId, isSharedCollection = false }: UseCollectionPermissionsProps) {
  const [accessLevel, setAccessLevel] = useState<string>("none")
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const { data: session } = useSession()
  const userEmail = session?.user?.email || ""

  useEffect(() => {
    const checkPermissions = async () => {
      if (!collectionId || !userEmail) {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        // First check if user is the owner by fetching the collection
        const collectionResponse = await fetch(`http://localhost:8000/collections/${collectionId}`)

        if (collectionResponse.ok) {
          const collection = await collectionResponse.json()
          const isCollectionOwner = collection.user_email === userEmail
          setIsOwner(isCollectionOwner)

          // If user is owner, they have full control
          if (isCollectionOwner) {
            setAccessLevel("control")
            setLoading(false)
            return
          }
        }

        // If not owner and it's a shared collection, check permissions
        if (isSharedCollection) {
          // Get permissions for this collection
          const permissionsResponse = await fetch(`http://localhost:8000/permissions/collections/${collectionId}`)

          if (permissionsResponse.ok) {
            const permissions = await permissionsResponse.json()
            const userPermission = permissions.find((p: any) => p.user_email === userEmail)

            if (userPermission) {
              setAccessLevel(userPermission.access_level)
            } else {
              setAccessLevel("none")
            }
          }
        }
      } catch (error) {
        console.error("Error checking permissions:", error)
        setAccessLevel("none")
      } finally {
        setLoading(false)
      }
    }

    checkPermissions()
  }, [collectionId, userEmail, isSharedCollection])

  return {
    accessLevel,
    isOwner,
    loading,
    canView: accessLevel !== "none",
    canModify: ["modify", "control"].includes(accessLevel) || isOwner,
    canControl: accessLevel === "control" || isOwner,
    canShare: isOwner, // Only owners can share
    canDelete: isOwner, // Only owners can delete
  }
}
