import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";

export default function TopNavigation() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo size="sm" />

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

