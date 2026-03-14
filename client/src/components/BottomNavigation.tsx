import { useLocation } from "wouter";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Get unread message count
  const { data: unreadCount = 0 } = trpc.chat.getUnreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Search, label: "Jelajahi Laporan" },
    { path: "/create", icon: PlusCircle, label: "Buat Laporan", requireAuth: true },
    { path: "/messages", icon: MessageCircle, label: "Pesan", requireAuth: true },
    { path: "/profile", icon: User, label: "Profile", requireAuth: true },
  ];

  const handleNavClick = (path: string, requireAuth?: boolean) => {
    if (requireAuth && !isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setLocation(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/20 backdrop-blur-lg border-t border-border/50 z-50 safe-area-bottom rounded-t-[24px] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path, item.requireAuth)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 mb-1 ${isActive ? "fill-primary/20" : ""}`} />
                {item.label === "Pesan" && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
