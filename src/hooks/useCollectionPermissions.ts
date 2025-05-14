import { useCallback } from "react"

// Base URL for your FastAPI server
const BASE_URL = "http://localhost:8000"

/**
 * Summary of a user who has access.
 */
export interface UserSummary {
  name: string
  email: string
  access_level: "scan" | "modify" | "control"
}

/**
 * Payload for updating a user's permission.
 */
export interface PermissionUpdate {
  access_level: "scan" | "modify" | "control"
  granted_by: string
}

/**
 * Full permission document returned by the API.
 */
export interface PermissionDoc {
  id: string
  collection_id: string
  user_email: string
  access_level: "scan" | "modify" | "control"
  granted_by: string
  granted_at: string  // ISO timestamp
}

/**
 * Hook to manage permissions for a specific collection and user.
 *
 * @param collectionId - ID of the collection
 * @param userEmail    - (Optional) Email of the current user (for audit on updates)
 */
export function useCollectionPermissions(
  collectionId: string,
) {
  /**
   * Fetch all users who have any permission on this collection.
   */
  const getUsersAccess = useCallback(async (): Promise<UserSummary[]> => {
    const res = await fetch(
      `${BASE_URL}/permissions/${collectionId}/users`,
      { method: "GET" }
    )
    if (!res.ok) throw new Error(`Error fetching users: ${res.statusText}`)
    return res.json()
  }, [collectionId])

  /**
   * Update a specific user's permission on the collection.
   *
   * @param email - Email of the user to update
   * @param data  - New access level and granted_by info
   */
  const updateUserPermission = useCallback(
    async (
      email: string,
      data: PermissionUpdate
    ): Promise<PermissionDoc> => {
      const res = await fetch(
        `${BASE_URL}/permissions/${collectionId}/${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || "Failed to update permission")
      }
      return res.json()
    },
    [collectionId]
  )

  /**
   * Remove a user's access to the collection.
   *
   * @param email - Email of the user to remove
   */
  return { getUsersAccess, updateUserPermission }
}
