import { useState, useEffect } from "react"

const BASE_URL = "http://localhost:8000"

// All possible access levels, plus "none"
export type AccessLevel = "scan" | "modify" | "control" | "none"

export function useUserAccessForCollection(
  collectionId: string,
  userEmail: string
): AccessLevel {
  const [access, setAccess] = useState<AccessLevel>("none")

  useEffect(() => {
    if (!collectionId || !userEmail) return

    fetch(
      `${BASE_URL}/permissions/${collectionId}/access/${encodeURIComponent(
        userEmail
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((level: AccessLevel) => {
        setAccess(level)
      })
      .catch(() => {
        setAccess("none")
      })
  }, [collectionId, userEmail])

  return access
}
