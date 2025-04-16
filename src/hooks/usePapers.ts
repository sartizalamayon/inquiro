"use client";

import { useQuery } from "@tanstack/react-query";

export function usePapers(userEmail: string, searchValue: string) {
  return useQuery({
    queryKey: ["papers", userEmail, searchValue],
    enabled: !!userEmail, // Only run if we have an email
    queryFn: async () => {
      if (!userEmail) {
        return []; // if no email, return empty
      }

      const params = new URLSearchParams({ email: userEmail });
      if (searchValue) {
        params.append("search", searchValue);
      }

      const res = await fetch(`http://localhost:8000/paper?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch papers");
      }

      return res.json(); // typed as 'any'
    },
  });
}
