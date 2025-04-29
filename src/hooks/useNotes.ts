"use client"

import { useQuery } from "@tanstack/react-query"

export function useNotes(paperId: string, userEmail?: string) {
    return useQuery({
        queryKey: ["notes", paperId, userEmail],
        queryFn: async () => {
            if (!paperId || !userEmail) {
                return []
            }
            
            try {
                const url = `http://localhost:8000/notes/paper/${paperId}?user_email=${encodeURIComponent(userEmail)}`
                const res = await fetch(url)
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch notes: ${res.status} ${res.statusText}`)
                }
                
                return res.json()
            } catch (error) {
                console.error('Error fetching notes:', error)
                throw error
            }
        },
        enabled: !!paperId && !!userEmail, // Only run the query if we have paperId and userEmail
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
        staleTime: 1000 * 60, // Consider data fresh for 1 minute
        refetchOnWindowFocus: false
    })
} 