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
import VerificationGuard from "./components/VerificationGuard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/explore"} component={Explore} />
      <Route path={"/create"} component={CreateReport} />
      <Route path={"/report/:id"} component={ReportDetail} />
      <Route path={"/login"} component={Login} />
      <Route path={"/verify-account"} component={AccountVerification} />
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
          <VerificationGuard>
            <Router />
          </VerificationGuard>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


export default App;

