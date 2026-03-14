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
    const skipVerificationPages = ["/", "/explore", "/login", "/verify-email", "/verify-account", "/404"];
    if (skipVerificationPages.some(page => location.startsWith(page))) {
      return;
    }

    // First check email verification
    if (isAuthenticated && user && !user.emailVerified && !loading) {
      setLocation("/verify-email");
      return;
    }

    // Then check ID verification (phone + KTP) - only required for certain actions
    // This will be checked at the point of claiming, not globally
  }, [user, isAuthenticated, loading, location, setLocation]);

  return <>{children}</>;
}

