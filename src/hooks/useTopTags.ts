import { useState, useEffect } from 'react';

interface Tag {
  name: string;
  count: number;
}

export function useTopTags(limit: number = 15) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopTags = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/papers/top-tags?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch top tags');
        }
        
        const data = await response.json();
        setTags(data.tags);
      } catch (err) {
        console.error('Error fetching top tags:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTopTags();
  }, [limit]);

  return { tags, loading, error };
} 