import { useState, useEffect } from 'react';

interface Author {
  name: string;
  count: number;
}

export function useTopAuthors(limit: number = 15) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopAuthors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/papers/top-authors?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch top authors');
        }
        
        const data = await response.json();
        setAuthors(data.authors);
      } catch (err) {
        console.error('Error fetching top authors:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTopAuthors();
  }, [limit]);

  return { authors, loading, error };
} 