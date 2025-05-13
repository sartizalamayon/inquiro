import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Collection } from '@/types/collection';

interface UseCollectionsProps {
  userEmail: string;
}

export function useCollections({ userEmail }: UseCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all collections
  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections?user_email=${userEmail}`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      
      const data = await response.json();
      setCollections(data);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to load collections');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Create a new collection
  const createCollection = useCallback(async (name: string, tags: string[] = []) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, tags, user_email: userEmail }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create collection');
      }
      
      const newCollection = await response.json();
      setCollections((prev) => [...prev, newCollection]);
      setError(null);
      toast.success('Collection created successfully');
      return newCollection;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to create collection');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Update a collection
  const updateCollection = useCallback(async (collectionId: string, data: {name?: string, tags?: string[]}) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, user_email: userEmail }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update collection');
      }
      
      const updatedCollection = await response.json();
      setCollections((prev) => 
        prev.map((c) => c._id === collectionId ? updatedCollection : c)
      );
      setError(null);
      toast.success('Collection updated successfully');
      return updatedCollection;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to update collection');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Delete a collection
  const deleteCollection = useCallback(async (collectionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}?user_email=${userEmail}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete collection');
      }
      
      setCollections((prev) => prev.filter((c) => c._id !== collectionId));
      setError(null);
      toast.success('Collection deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to delete collection');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Add a tag to a collection
  const addTagToCollection = useCallback(async (collectionId: string, tag: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}/tags/${tag}?user_email=${userEmail}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to add tag to collection');
        console.log(response)
      }
      
      const data = await response.json();
      
      // Update local state
      setCollections((prev) => 
        prev.map((c) => {
          if (c._id === collectionId && !c.tags.includes(tag)) {
            return { ...c, tags: [...c.tags, tag] };
          }
          return c;
        })
      );
      
      setError(null);
      toast.success('Tag added successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to add tag');
      console.log(error)
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Remove a tag from a collection
  const removeTagFromCollection = useCallback(async (collectionId: string, tag: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}/tags/${tag}?user_email=${userEmail}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove tag from collection');
      }
      
      const data = await response.json();
      
      // Update local state
      setCollections((prev) => 
        prev.map((c) => {
          if (c._id === collectionId) {
            return { ...c, tags: c.tags.filter((t) => t !== tag) };
          }
          return c;
        })
      );
      
      setError(null);
      toast.success('Tag removed successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to remove tag');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Add a paper to a collection
  const addPaperToCollection = useCallback(async (collectionId: string, paperId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}/papers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paper_id: paperId, user_email: userEmail }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add paper to collection');
      }
      
      const data = await response.json();
      
      // Update local state
      setCollections((prev) => 
        prev.map((c) => {
          if (c._id === collectionId && !c.papers.includes(paperId)) {
            return { ...c, papers: [...c.papers, paperId] };
          }
          return c;
        })
      );
      
      setError(null);
      toast.success('Paper added to collection');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to add paper to collection');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Remove a paper from a collection
  const removePaperFromCollection = useCallback(async (collectionId: string, paperId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}/papers/${paperId}?user_email=${userEmail}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove paper from collection');
      }
      
      const data = await response.json();
      
      // Update local state
      setCollections((prev) => 
        prev.map((c) => {
          if (c._id === collectionId) {
            return { ...c, papers: c.papers.filter((p) => p !== paperId) };
          }
          return c;
        })
      );
      
      setError(null);
      toast.success('Paper removed from collection');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error('Failed to remove paper from collection');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  return {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addTagToCollection,
    removeTagFromCollection,
    addPaperToCollection,
    removePaperFromCollection,
  };
} 