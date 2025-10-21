import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  addToQueue,
  getQueuedReports,
  removeFromQueue,
  updateRetryCount,
  getQueueSize,
  type QueuedReport,
} from "@/lib/offlineQueue";

export function useOfflineQueue() {
  const [queueSize, setQueueSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const utils = trpc.useUtils();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online! Syncing pending reports...");
      processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update queue size
  const updateQueueSize = useCallback(async () => {
    const size = await getQueueSize();
    setQueueSize(size);
  }, []);

  // Process queued reports
  const processQueue = useCallback(async () => {
    if (isProcessing || !isOnline) return;

    setIsProcessing(true);

    try {
      const queuedReports = await getQueuedReports();

      if (queuedReports.length === 0) {
        setIsProcessing(false);
        return;
      }

      console.log(`[Offline Queue] Processing ${queuedReports.length} queued reports`);

      for (const queuedReport of queuedReports) {
        try {
          // Try to submit the report
          await utils.client.reports.create.mutate(queuedReport.data);

          // Success - remove from queue
          await removeFromQueue(queuedReport.id);
          toast.success("Report synced successfully!");

          await updateQueueSize();
        } catch (error: any) {
          console.error("[Offline Queue] Failed to sync report:", error);

          // Update retry count
          await updateRetryCount(queuedReport.id);

          // If too many retries, show error
          if (queuedReport.retryCount >= 3) {
            toast.error("Failed to sync report after multiple attempts");
          }
        }
      }
    } catch (error) {
      console.error("[Offline Queue] Error processing queue:", error);
    } finally {
      setIsProcessing(false);
      await updateQueueSize();
    }
  }, [isProcessing, isOnline, utils]);

  // Add report to queue
  const queueReport = useCallback(async (reportData: any) => {
    try {
      const queueId = await addToQueue(reportData);
      await updateQueueSize();
      
      toast.info("Report saved offline. Will sync when online.", {
        description: "Your report is saved and will be submitted automatically when you're back online.",
      });

      return queueId;
    } catch (error) {
      console.error("[Offline Queue] Failed to queue report:", error);
      throw error;
    }
  }, [updateQueueSize]);

  // Initialize queue size
  useEffect(() => {
    updateQueueSize();
  }, [updateQueueSize]);

  // Auto-process queue when online
  useEffect(() => {
    if (isOnline && queueSize > 0) {
      processQueue();
    }
  }, [isOnline, queueSize, processQueue]);

  return {
    queueSize,
    isProcessing,
    isOnline,
    queueReport,
    processQueue,
  };
}

