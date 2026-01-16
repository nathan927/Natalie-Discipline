import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";
import { setCurrentUser, clearCurrentUser, clearSyncQueue, clearIdMap } from "@/lib/offline-storage";

async function fetchUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      console.error("Failed to fetch user:", response.status, response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (user?.id) {
      setCurrentUser(user.id);
    }
  }, [user]);

  const logout = useCallback(async () => {
    clearCurrentUser();
    clearSyncQueue();
    clearIdMap();
    
    queryClient.setQueryData(["/api/auth/user"], null);
    queryClient.clear();
    
    window.location.href = "/api/logout";
  }, [queryClient]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refetch,
  };
}
