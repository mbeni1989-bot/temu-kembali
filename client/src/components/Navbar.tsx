import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { User, LogOut, FileText, Home as HomeIcon } from "lucide-react";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setLocation("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <Logo size="sm" />
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            size="sm"
            className="hidden md:flex"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            {t("nav.home")}
          </Button>
          <Button
            onClick={() => setLocation("/explore")}
            variant="ghost"
            size="sm"
          >
            {t("nav.explore")}
          </Button>
          
          <LanguageSwitcher />

          {isAuthenticated ? (
            <>
              <Button
                onClick={() => setLocation("/create")}
                variant="default"
                size="sm"
              >
                {t("nav.create")}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user?.name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setLocation("/my-reports")}>
                    <FileText className="w-4 h-4 mr-2" />
                    My Reports
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <a href={getLoginUrl()}>
              <Button variant="default" size="sm">
                {t("nav.login")}
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

