import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreateReport from "./pages/CreateReport";
import ReportDetail from "./pages/ReportDetail";
import Login from "./pages/Login";
import AccountVerification from "./pages/AccountVerification";
import EmailVerification from "./pages/EmailVerification";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Donate from "./pages/Donate";
import Settings from "./pages/Settings";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import VerificationGuard from "./components/VerificationGuard";
import TopNavigation from "./components/TopNavigation";
import BottomNavigation from "./components/BottomNavigation";
import OfflineNotification from "./components/OfflineNotification";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/explore"} component={Explore} />
      <Route path={"/create"} component={CreateReport} />
      <Route path={"/report/:id"} component={ReportDetail} />
      <Route path={"/login"} component={Login} />
      <Route path={"/verify-email"} component={EmailVerification} />
      <Route path={"/verify-account"} component={AccountVerification} />
      <Route path={"/messages"} component={Messages} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/donate"} component={Donate} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/terms"} component={TermsOfService} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/super-admin"} component={SuperAdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <OfflineNotification />
          <VerificationGuard>
            <div className="flex flex-col min-h-screen">
              <TopNavigation />
              <main className="flex-1 pb-20">
                <Router />
              </main>
              <BottomNavigation />
            </div>
          </VerificationGuard>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


export default App;

