import { useEffect } from "react";
import { setCurrentUser, getCurrentUser } from "@/lib/offline-storage";

// 本地用戶類型（簡化版）
export interface LocalUser {
  id: string;
  firstName: string;
}

const LOCAL_USER_ID = "local_user";

export function useAuth() {
  // 初始化時設置本地用戶
  useEffect(() => {
    if (!getCurrentUser()) {
      setCurrentUser(LOCAL_USER_ID);
    }
  }, []);

  // 始終返回已認證的本地用戶
  const user: LocalUser = {
    id: LOCAL_USER_ID,
    firstName: "小朋友",
  };

  return {
    user,
    isLoading: false,
    isAuthenticated: true,
  };
}
