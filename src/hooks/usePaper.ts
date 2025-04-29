"use client"

import { useQuery } from "@tanstack/react-query"

export function usePaper(paperId: string) {
    return useQuery({
        queryKey: ["paper", paperId],
        queryFn: async () => {
            try {
                const res = await fetch(`http://localhost:8000/paper/${paperId}`)
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch paper: ${res.status} ${res.statusText}`)
                }
                
                return res.json()
            } catch (error) {
                console.error('Error fetching paper:', error)
                throw error
            }
        },
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        refetchOnWindowFocus: false // Don't refetch on window focus to reduce unnecessary requests
    })
}
