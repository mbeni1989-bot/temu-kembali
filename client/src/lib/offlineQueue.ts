import localforage from "localforage";

// Configure localforage for offline storage
const offlineQueue = localforage.createInstance({
  name: "temu-kembali",
  storeName: "offline_reports",
});

export interface QueuedReport {
  id: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

/**
 * Add a report to offline queue
 */
export async function addToQueue(reportData: any): Promise<string> {
  const queueId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const queuedReport: QueuedReport = {
    id: queueId,
    data: reportData,
    timestamp: Date.now(),
    retryCount: 0,
  };

  await offlineQueue.setItem(queueId, queuedReport);
  console.log("[Offline Queue] Report added to queue:", queueId);
  
  return queueId;
}

/**
 * Get all queued reports
 */
export async function getQueuedReports(): Promise<QueuedReport[]> {
  const reports: QueuedReport[] = [];
  
  await offlineQueue.iterate<QueuedReport, void>((value) => {
    reports.push(value);
  });
  
  return reports.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Remove a report from queue
 */
export async function removeFromQueue(queueId: string): Promise<void> {
  await offlineQueue.removeItem(queueId);
  console.log("[Offline Queue] Report removed from queue:", queueId);
}

/**
 * Update retry count for a queued report
 */
export async function updateRetryCount(queueId: string): Promise<void> {
  const report = await offlineQueue.getItem<QueuedReport>(queueId);
  
  if (report) {
    report.retryCount += 1;
    await offlineQueue.setItem(queueId, report);
  }
}

/**
 * Get queue size
 */
export async function getQueueSize(): Promise<number> {
  return await offlineQueue.length();
}

/**
 * Clear all queued reports
 */
export async function clearQueue(): Promise<void> {
  await offlineQueue.clear();
  console.log("[Offline Queue] Queue cleared");
}

