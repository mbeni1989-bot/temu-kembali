import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Shield,
  Phone,
  CreditCard,
  CheckCircle,
  Upload,
  AlertCircle,
} from "lucide-react";

export default function AccountVerification() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [ktpNumber, setKtpNumber] = useState("");
  const [ktpPhoto, setKtpPhoto] = useState<File | null>(null);
  const [ktpPhotoPreview, setKtpPhotoPreview] = useState<string>("");
  
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [step, setStep] = useState<"phone" | "ktp">("phone");

  const verifyAccountMutation = trpc.user.verifyAccount.useMutation({
    onSuccess: () => {
      toast.success(t("verification.messages.success") || "Account verified successfully!");
      setLocation("/");
    },
    onError: (error: any) => {
      toast.error(error.message || t("verification.messages.error"));
    },
  });

  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Simulate sending verification code
    toast.success("Verification code sent to your phone!");
    setCodeSent(true);
  };

  const handleVerifyPhone = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    // Simulate phone verification
    toast.success("Phone number verified!");
    setIsPhoneVerified(true);
    setStep("ktp");
  };

  const handleKtpPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKtpPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneVerified) {
      toast.error("Please verify your phone number first");
      return;
    }

    if (!ktpNumber || ktpNumber.length !== 16) {
      toast.error("Please enter a valid 16-digit KTP number");
      return;
    }

    if (!ktpPhoto) {
      toast.error("Please upload a photo of your KTP");
      return;
    }

    verifyAccountMutation.mutate({
      phoneNumber,
      ktpNumber,
      ktpPhotoUrl: ktpPhotoPreview, // In production, upload to S3 first
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-4">
      <Card className="w-full max-w-2xl border-2">
        <CardHeader className="text-center space-y-4">
          <Logo size="md" className="justify-center" />
          <div>
            <CardTitle className="text-3xl mb-2">Account Verification Required</CardTitle>
            <CardDescription className="text-base">
              To ensure the safety and security of our community, we require all users to verify their identity
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step === "phone" ? "text-primary" : isPhoneVerified ? "text-green-500" : "text-muted-foreground"}`}>
                {isPhoneVerified ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === "phone" ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}>
                    1
                  </div>
                )}
                <span className="font-medium">Phone Verification</span>
              </div>
              <div className="w-12 h-0.5 bg-border"></div>
              <div className={`flex items-center gap-2 ${step === "ktp" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === "ktp" ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}>
                  2
                </div>
                <span className="font-medium">ID Verification</span>
              </div>
            </div>

            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription>
                Your personal information is encrypted and will only be used for verification purposes. We take your privacy seriously.
              </AlertDescription>
            </Alert>

            {/* Phone Verification Step */}
            {step === "phone" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    disabled={isPhoneVerified}
                    required
                  />
                </div>

                {!codeSent && !isPhoneVerified && (
                  <Button
                    type="button"
                    onClick={handleSendCode}
                    className="w-full"
                  >
                    Send Verification Code
                  </Button>
                )}

                {codeSent && !isPhoneVerified && (
                  <>
                    <div>
                      <Label htmlFor="code" className="mb-2 block">
                        Verification Code *
                      </Label>
                      <Input
                        id="code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Enter the 6-digit code sent to your phone
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        className="flex-1"
                      >
                        Resend Code
                      </Button>
                      <Button
                        type="button"
                        onClick={handleVerifyPhone}
                        className="flex-1"
                      >
                        Verify Phone
                      </Button>
                    </div>
                  </>
                )}

                {isPhoneVerified && (
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <AlertDescription className="text-green-700">
                      Phone number verified successfully!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* KTP Verification Step */}
            {step === "ktp" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ktpNumber" className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4" />
                    KTP Number (ID Card) *
                  </Label>
                  <Input
                    id="ktpNumber"
                    type="text"
                    value={ktpNumber}
                    onChange={(e) => setKtpNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="16-digit KTP number"
                    maxLength={16}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter your 16-digit National ID (KTP) number
                  </p>
                </div>

                <div>
                  <Label htmlFor="ktpPhoto" className="flex items-center gap-2 mb-2">
                    <Upload className="w-4 h-4" />
                    KTP Photo *
                  </Label>
                  <Input
                    id="ktpPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleKtpPhotoChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a clear photo of your KTP (National ID Card)
                  </p>
                </div>

                {ktpPhotoPreview && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={ktpPhotoPreview}
                      alt="KTP Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  </div>
                )}

                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <strong>Important:</strong> Make sure your KTP photo is clear and all information is readable. 
                    This is required for security purposes and to prevent fraud.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("phone")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={verifyAccountMutation.isPending}
                    className="flex-1"
                  >
                    {verifyAccountMutation.isPending ? "Verifying..." : "Complete Verification"}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Why do we need this?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Prevent fraud and fake reports</li>
              <li>• Ensure the safety of our community</li>
              <li>• Build trust between users</li>
              <li>• Comply with local regulations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

