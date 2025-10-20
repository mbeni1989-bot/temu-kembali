import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface DonorBadgeProps {
  amount: number;
  currency: string;
  userName: string;
  userAvatar?: string;
  date: Date;
}

export default function DonorBadge({ amount, currency, userName, userAvatar, date }: DonorBadgeProps) {
  const [open, setOpen] = useState(true);

  const badgeRef = useState<HTMLDivElement | null>(null);

  const formatAmount = () => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "IDR" ? "Rp" : "¥";
    
    // Format with K for thousands, M for millions
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(0)}K`;
    }
    return `${symbol}${amount}`;
  };

  const handleDownload = async () => {
    // In production, use html2canvas or similar library
    toast.success("Badge downloaded! (Demo mode)");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Temu Kembali Donor Badge",
      text: `I just donated ${formatAmount()} to Temu Kembali! Join me in supporting this amazing platform that helps reunite people with their lost items and loved ones. 💙`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text + " " + shareData.url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Thank You! 🎉</DialogTitle>
          <DialogDescription className="text-center">
            Your donation makes a difference
          </DialogDescription>
        </DialogHeader>

        {/* Badge Card */}
        <Card className="p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-2 border-pink-200">
          <div className="text-center space-y-4">
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto bg-gradient-to-br from-pink-500 to-purple-600">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white fill-white" />
                </div>
              )}
            </div>

            {/* Badge Title */}
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Proud Supporter
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Temu Kembali</p>
            </div>

            {/* Donor Info */}
            <div className="space-y-3">
              <p className="text-xl font-bold">{userName}</p>
              <div className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-xl border-2 border-pink-300 shadow-md min-w-[140px]">
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {formatAmount()}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {date.toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>

            {/* Quote */}
            <div className="pt-4 border-t border-pink-200">
              <p className="text-sm italic text-muted-foreground">
                "Together we reunite what was lost"
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Share your badge on social media to inspire others!
        </p>
      </DialogContent>
    </Dialog>
  );
}

