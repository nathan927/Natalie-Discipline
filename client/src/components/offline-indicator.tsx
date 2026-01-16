import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, Check } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-online-status";
import { hasPendingSyncOperations, getSyncQueue } from "@/lib/offline-storage";
import { syncPendingOperations, fetchAndCacheServerData } from "@/lib/sync-manager";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

export function OfflineIndicator() {
  const { isOnline, justReconnected } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number } | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkPending = () => {
      setPendingCount(getSyncQueue().length);
    };
    checkPending();
    const interval = setInterval(checkPending, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (justReconnected && hasPendingSyncOperations()) {
      handleSync();
    }
  }, [justReconnected]);

  const handleSync = async () => {
    if (isSyncing || !isOnline) return;
    
    setIsSyncing(true);
    try {
      const result = await syncPendingOperations();
      await fetchAndCacheServerData();
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      
      if (result.synced > 0) {
        setSyncResult({ synced: result.synced });
        setTimeout(() => setSyncResult(null), 3000);
      }
      setPendingCount(0);
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
          data-testid="indicator-offline"
        >
          <WifiOff className="w-4 h-4" />
          <span>離線模式 - 資料將喺上線後同步</span>
          {pendingCount > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {pendingCount} 待同步
            </span>
          )}
        </motion.div>
      )}

      {isOnline && pendingCount > 0 && !isSyncing && (
        <motion.button
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          onClick={handleSync}
          className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
          data-testid="button-sync-pending"
        >
          <RefreshCw className="w-4 h-4" />
          <span>點擊同步 {pendingCount} 個待處理項目</span>
        </motion.button>
      )}

      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
          data-testid="indicator-syncing"
        >
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>同步中...</span>
        </motion.div>
      )}

      {syncResult && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
          data-testid="indicator-sync-success"
        >
          <Check className="w-4 h-4" />
          <span>已同步 {syncResult.synced} 個項目</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
