import React from "react";
import { Truck, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "express" | "scheduled";
  timeText?: string;
}

export default function DeliveryBadge({
  type = "express",
  timeText,
  className,
  ...props
}: DeliveryBadgeProps) {
  const isExpress = type === "express";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none shadow-xs border transition-all duration-300",
        isExpress
          ? "bg-brand-accent/10 border-brand-accent/20 text-brand-accent animate-pulse"
          : "bg-brand-primary/10 border-brand-primary/20 text-brand-primary",
        className
      )}
      {...props}
    >
      {isExpress ? (
        <>
          <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
          <span>{timeText || "Arrives in 30 min"}</span>
        </>
      ) : (
        <>
          <Calendar className="w-3.5 h-3.5" />
          <span>{timeText || "Scheduled delivery"}</span>
        </>
      )}
    </div>
  );
}
