"use client"

import { useState, useCallback } from "react"
import type { Collection } from "@/types/collection"

interface UseSharedCollectionsProps {
  userEmail: string
}

export function useSharedCollections({ userEmail }: UseSharedCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [accessLevels, setAccessLevels] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch shared collections for the user
  const fetchSharedCollections = useCallback(async () => {
    if (!userEmail) return

    setLoading(true)
    setError(null)

    try {
      // Fetch permissions for the user
      const permissionsResponse = await fetch(`http://localhost:8000/permissions/users/${userEmail}`)

      if (!permissionsResponse.ok) {
        throw new Error("Failed to fetch permissions")
      }

      const permissions = await permissionsResponse.json()

      if (permissions.length === 0) {
        setCollections([])
        setLoading(false)
        return
      }

      // Create a map of collection IDs to access levels
      const accessLevelMap: Record<string, string> = {}
      permissions.forEach((permission: any) => {
        accessLevelMap[permission.collection_id] = permission.access_level
      })

      setAccessLevels(accessLevelMap)

      // Fetch collection details for each shared collection
      const collectionPromises = permissions.map((permission: any) =>
        fetch(`http://localhost:8000/collections/${permission.collection_id}`).then((res) =>
          res.ok ? res.json() : null,
        ),
      )

      const collectionResults = await Promise.all(collectionPromises)
      const validCollections = collectionResults.filter(Boolean) as Collection[]

      setCollections(validCollections)
    } catch (err) {
      console.error("Error fetching shared collections:", err)
      setError("Failed to load shared collections")
    } finally {
      setLoading(false)
    }
  }, [userEmail])

  // Remove access to a shared collection
  const removeAccess = useCallback(
    async (collectionId: string) => {
      if (!userEmail) return

      try {
        const response = await fetch(`http://localhost:8000/permissions/${collectionId}/${userEmail}`, {
          method: "DELETE",
        })

        if (response.ok) {
          // Remove the collection from the list
          setCollections((prev) => prev.filter((c) => c._id !== collectionId))

          // Remove the access level from the map
          const newAccessLevels = { ...accessLevels }
          delete newAccessLevels[collectionId]
          setAccessLevels(newAccessLevels)

          return true
        }

        return false
      } catch (err) {
        console.error("Error removing access:", err)
        return false
      }
    },
    [userEmail, accessLevels],
  )

  // Check access level for a specific paper
  const checkPaperAccess = useCallback(
    async (paperId: string) => {
      if (!userEmail) return "none"

      try {
        const response = await fetch(`http://localhost:8000/permissions/paper/${paperId}/${userEmail}`)

        if (response.ok) {
          const accessLevel = await response.json()
          return accessLevel
        }

        return "none"
      } catch (err) {
        console.error("Error checking paper access:", err)
        return "none"
      }
    },
    [userEmail],
  )

  return {
    collections,
    accessLevels,
    loading,
    error,
    fetchSharedCollections,
    removeAccess,
    checkPaperAccess,
  }
}
