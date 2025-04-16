"use client"

import { useQuery } from "@tanstack/react-query"

export function usePaper(paperId: string) {
    return useQuery({
        queryKey: ["paper", paperId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:8000/paper/${paperId}`)
            return res.json()
        }
    })
}
