import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "spotify" | "apple" | "youtube" | "instagram" | "facebook" | "disabled";
  className?: string;
}

const variantStyles = {
  default: "bg-gradient-primary border-border",
  spotify: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
  apple: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
  youtube: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
  instagram: "bg-gradient-to-br from-pink-50 to-purple-100 border-pink-200",
  facebook: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
  disabled: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 opacity-95",
};

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
}: KPICardProps) {
  const isDisabled = variant === "disabled";

  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant], className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className={cn("text-sm font-medium", isDisabled ? "text-slate-600" : "text-muted-foreground")}>{title}</h3>
          {icon && <span className={cn(isDisabled ? "text-slate-500" : "text-muted-foreground")}>{icon}</span>}
        </div>
      </CardHeader>

      <CardContent>
        <div className={cn("text-2xl font-bold", isDisabled ? "text-slate-700" : "text-foreground")}>{value}</div>

        {(subtitle || trend) && (
          <div className="mt-1 flex items-center justify-between">
            {subtitle && <p className={cn("text-xs", isDisabled ? "text-slate-500" : "text-muted-foreground")}>{subtitle}</p>}

            {trend && (
              <div className={cn("flex items-center gap-1 text-xs", trend.isPositive ? "text-green-600" : "text-red-600")}>
                <span>{trend.isPositive ? "▲" : "▼"}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
