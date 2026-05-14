import { useEffect, useState, useCallback } from "react";

type GraphData = {
  graph: Record<string, string[]>;
  circular: string[][];
  standalone: string[];
};

export function useGraph() {
  const [data, setData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true); 

      const res = await fetch("http://localhost:3210/graph");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      setData(json);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch graph:", err);
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  }, []);

  const refetchGraph = useCallback(async () => {
    try {
      setLoading(true); 

      const res = await fetch("http://localhost:3210/reload");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      setData(json);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch graph:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  return {
    data,
    error,
    loading, 
    refetch: refetchGraph
  };
}