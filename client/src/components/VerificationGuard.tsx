import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

interface VerificationGuardProps {
  children: React.ReactNode;
}

export default function VerificationGuard({ children }: VerificationGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Skip verification check for certain pages
    const skipVerificationPages = ["/", "/explore", "/login", "/verify-account", "/404"];
    if (skipVerificationPages.some(page => location.startsWith(page))) {
      return;
    }

    // If user is authenticated but not verified, redirect to verification page
    if (isAuthenticated && user && !user.isVerified && !loading) {
      setLocation("/verify-account");
    }
  }, [user, isAuthenticated, loading, location, setLocation]);

  return <>{children}</>;
}

