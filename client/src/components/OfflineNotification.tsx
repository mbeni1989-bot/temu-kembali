import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineNotification() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Hide notification after a delay when back online
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      setShowNotification(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isOnline ? "translate-y-0 opacity-100" : "translate-y-0 opacity-100"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg backdrop-blur-lg border-2 ${
          isOnline
            ? "bg-green-500/90 border-green-400 text-white"
            : "bg-orange-500/90 border-orange-400 text-white"
        }`}
      >
        {isOnline ? (
          <>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <p className="font-medium">Kembali online</p>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <div>
              <p className="font-medium">Tidak ada koneksi internet</p>
              <p className="text-xs opacity-90">Beberapa fitur mungkin tidak tersedia</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

