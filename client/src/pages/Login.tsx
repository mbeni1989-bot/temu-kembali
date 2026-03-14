import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { trpc } from "@/lib/trpc";
import {
  Shield,
  Users,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      // Invalidate auth cache to refresh user state without page reload
      await utils.auth.me.invalidate();
      setLocation("/");
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      // Error handled in onError
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding & Features */}
      <div className="flex-1 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-8 lg:p-16 flex flex-col justify-center">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Logo */}
          <div className="text-center lg:text-left">
            <Logo size="lg" className="justify-center lg:justify-start" />
            <p className="text-muted-foreground mt-4 text-lg">
              {t("app.tagline")}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and protected with industry-standard security
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Global Community</h3>
                <p className="text-muted-foreground">
                  Join thousands of people helping each other find what's lost
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Smart Matching</h3>
                <p className="text-muted-foreground">
                  AI-powered system automatically matches lost and found reports
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Free Forever</h3>
                <p className="text-muted-foreground">
                  No hidden fees, no premium features - completely free for everyone
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">5K+</div>
              <div className="text-sm text-muted-foreground">Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">85%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 p-8 lg:p-16 flex items-center justify-center bg-background">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl">Welcome Back!</CardTitle>
            <CardDescription className="text-base">
              Sign in to continue helping others and finding what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Create and manage lost & found reports</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Claim items and verify your identity</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Chat securely with other users</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Get notifications for matching reports</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Browse Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation("/explore")}
              className="w-full"
            >
              Browse Reports as Guest
            </Button>

            {/* Privacy Notice */}
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy. 
              We protect your data with industry-standard encryption.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
