import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Thread } from "@/types";

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    try {
      setError(null);
      const res = await apiFetch("/api/threads");
      const data = await res.json();
      setThreads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch threads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const createThread = async (): Promise<Thread> => {
    const res = await apiFetch("/api/threads", {
      method: "POST",
      body: JSON.stringify({ title: "New Thread" }),
    });
    const thread = await res.json();
    setThreads((prev) => [thread, ...prev]);
    return thread;
  };

  const deleteThread = async (id: string) => {
    await apiFetch(`/api/threads/${id}`, { method: "DELETE" });
    setThreads((prev) => prev.filter((t) => t.id !== id));
  };

  return { threads, loading, error, createThread, deleteThread, refetchThreads: fetchThreads };
}
