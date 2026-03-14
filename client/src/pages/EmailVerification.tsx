import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function EmailVerification() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  // Simulate sending verification code
  const handleSendCode = () => {
    if (!user?.email) {
      toast.error("Email not found");
      return;
    }
    
    // In production, send actual email with verification code
    toast.success(`Verification code sent to ${user.email}`);
    setCodeSent(true);
  };

  // Simulate verifying code
  const handleVerify = () => {
    if (!verificationCode) {
      toast.error("Please enter verification code");
      return;
    }

    // In production, verify the code with backend
    // For demo, accept any 6-digit code
    if (verificationCode.length === 6) {
      toast.success("Email verified successfully!");
      // Update user emailVerified status
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    } else {
      toast.error("Invalid verification code");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We need to verify your email address to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Display */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Verification code will be sent to: <strong>{user.email}</strong>
            </AlertDescription>
          </Alert>

          {!codeSent ? (
            /* Send Code Step */
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Click the button below to receive a verification code via email
              </p>
              <Button onClick={handleSendCode} className="w-full" size="lg">
                <Mail className="w-4 h-4 mr-2" />
                Send Verification Code
              </Button>
            </div>
          ) : (
            /* Verify Code Step */
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="mt-1.5 text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Check your email inbox and spam folder
                </p>
              </div>

              <Button onClick={handleVerify} className="w-full" size="lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Email
              </Button>

              <Button
                variant="ghost"
                onClick={handleSendCode}
                className="w-full"
                size="sm"
              >
                Resend Code
              </Button>
            </div>
          )}

          {/* Skip Option (for demo only) */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setLocation("/")}
              className="text-sm text-muted-foreground"
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

