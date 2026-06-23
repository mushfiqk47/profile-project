import React from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function PageWrapper({ children, className, ...props }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
