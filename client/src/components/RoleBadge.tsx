import { Badge } from "@/components/ui/badge";
import { Shield, Crown, Star, User } from "lucide-react";

interface RoleBadgeProps {
  role: string;
  size?: "sm" | "md" | "lg";
}

export function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    switch (role.toLowerCase()) {
      case "super_admin":
        return {
          label: "Super Admin",
          icon: Crown,
          className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0",
        };
      case "admin":
        return {
          label: "Admin",
          icon: Shield,
          className: "bg-gradient-to-r from-red-600 to-orange-600 text-white border-0",
        };
      case "moderator":
        return {
          label: "Moderator",
          icon: Star,
          className: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0",
        };
      case "user":
      default:
        return {
          label: "User",
          icon: User,
          className: "bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0",
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-3",
    lg: "text-base py-1.5 px-4",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} flex items-center gap-1.5 font-semibold`}>
      <Icon className={iconSizes[size]} />
      {config.label}
    </Badge>
  );
}
