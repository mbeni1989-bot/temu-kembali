import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Heart,
  Shield,
  CreditCard,
  Lock,
  CheckCircle,
  Globe,
  DollarSign,
  Info,
} from "lucide-react";

export default function Donate() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const presetAmounts = [5, 10, 25, 50, 100];
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "paypal", name: "PayPal", icon: DollarSign },
    { id: "crypto", name: "Cryptocurrency", icon: Globe },
  ];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to donate");
      setLocation("/login");
      return;
    }

    const donationAmount = amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);

    if (!donationAmount || donationAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setProcessing(true);

    // Simulate payment processing (in production, integrate with Stripe/PayPal/etc)
    setTimeout(() => {
      toast.success(`Thank you for your ${currency} ${donationAmount} donation! 🙏`);
      setProcessing(false);
      setAmount("");
      setCustomAmount("");
    }, 2000);
  };

  const selectedCurrency = currencies.find((c) => c.code === currency);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-primary/10 border-b">
        <div className="container py-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Support Temu Kembali</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us keep this service free for everyone. Your donation helps reunite lost items and people with their owners.
          </p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">Secure Escrow</h3>
              <p className="text-sm text-muted-foreground">
                Funds held securely until delivery
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">Encrypted</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security for all transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold mb-1">Global Payment</h3>
              <p className="text-sm text-muted-foreground">
                Accept payments worldwide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Form */}
        <form onSubmit={handleDonate}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Choose Donation Amount</CardTitle>
              <CardDescription>
                Select a preset amount or enter your own
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Currency Selection */}
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preset Amounts */}
              <div>
                <Label>Select Amount</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        amount === preset.toString()
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-bold text-lg">
                        {selectedCurrency?.symbol}
                        {preset}
                      </p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount("custom")}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      amount === "custom"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-bold text-lg">Custom</p>
                  </button>
                </div>
              </div>

              {/* Custom Amount */}
              {amount === "custom" && (
                <div>
                  <Label htmlFor="customAmount">Custom Amount</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {selectedCurrency?.symbol}
                    </span>
                    <Input
                      id="customAmount"
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          {method.name}
                        </Label>
                        {method.id === "card" && (
                          <Badge variant="outline">Recommended</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Escrow Info */}
          <Alert className="mb-6">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Escrow Protection:</strong> Your donation will be held securely in escrow and released to Temu Kembali after verification. This ensures transparency and security for all transactions.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={processing || !amount || (amount === "custom" && !customAmount)}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {processing ? (
              "Processing..."
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Donate {amount && amount !== "custom" && `${selectedCurrency?.symbol}${amount}`}
                {amount === "custom" && customAmount && `${selectedCurrency?.symbol}${customAmount}`}
              </>
            )}
          </Button>
        </form>

        {/* Impact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Keep the platform free</p>
                <p className="text-sm text-muted-foreground">
                  100% of donations go towards server costs and development
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Help reunite families</p>
                <p className="text-sm text-muted-foreground">
                  Support features that help find missing persons
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Build a caring community</p>
                <p className="text-sm text-muted-foreground">
                  Enable more people to help each other find lost items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

