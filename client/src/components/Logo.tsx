import { Search, Package } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg", container: "w-8 h-8" },
    md: { icon: "w-8 h-8", text: "text-2xl", container: "w-12 h-12" },
    lg: { icon: "w-12 h-12", text: "text-4xl", container: "w-16 h-16" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon with gradient background */}
      <div
        className={`${currentSize.container} rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg relative overflow-hidden group`}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {/* Combined icon: Search + Package */}
        <div className="relative z-10 flex items-center justify-center">
          <Package className={`${currentSize.icon} text-white absolute opacity-40`} />
          <Search className={`${currentSize.icon} text-white relative`} />
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold ${currentSize.text} bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent`}>
            Temu Kembali
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">Find & Reunite</span>
        </div>
      )}
    </div>
  );
}

