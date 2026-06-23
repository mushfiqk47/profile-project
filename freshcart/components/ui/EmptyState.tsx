import React from "react";
import { cn } from "@/lib/utils";

type EmptyStateVariant = "cart" | "search" | "favorites" | "orders" | "category";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: EmptyStateVariant;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  variant,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  
  // Custom SVG Illustrations
  const renderIllustration = () => {
    switch (variant) {
      case "cart":
        return (
          <svg
            className="w-32 h-32 text-neutral-300"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Bag Body */}
            <path d="M30 40h60v50a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10V40z" fill="var(--neutral-100)" />
            {/* Bag handles */}
            <path d="M45 40V30a15 15 0 0 1 30 0v10" />
            {/* Soft decorative leaf */}
            <path
              d="M60 55c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10z M60 55v20"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              fill="rgba(19, 56, 43, 0.1)"
            />
          </svg>
        );
      case "search":
        return (
          <svg
            className="w-32 h-32 text-neutral-300"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Magnifying Glass */}
            <circle cx="55" cy="55" r="25" fill="var(--neutral-100)" />
            <path d="M73 73l22 22" />
            {/* Disappointing question mark */}
            <path d="M55 47c3 0 5 2 5 5 0 3-2 4-4 6v2 M55 67h.01" stroke="var(--brand-accent)" strokeWidth="3" />
          </svg>
        );
      case "favorites":
        return (
          <svg
            className="w-32 h-32 text-neutral-300"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Dotted broken heart path */}
            <path
              d="M60 90S25 65 25 42.5c0-12.4 10.1-22.5 22.5-22.5 7.1 0 13.4 3.3 17.5 8.5 4.1-5.2 10.4-8.5 17.5-8.5 12.4 0 22.5 10.1 22.5 22.5C105 65 70 90 70 90"
              fill="rgba(224, 94, 43, 0.05)"
              strokeDasharray="4 4"
            />
            {/* Inner small solid heart outline */}
            <path
              d="M60 75S35 55 35 37.5C35 27.8 42.8 20 52.5 20c5.5 0 10.4 2.5 13.6 6.5 3.2-4 8.1-6.5 13.6-6.5 9.7 0 17.5 7.8 17.5 17.5C97 55 72 75 72 75"
              stroke="var(--brand-accent)"
              strokeWidth="2.5"
            />
          </svg>
        );
      case "orders":
        return (
          <svg
            className="w-32 h-32 text-neutral-300"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Box package */}
            <path d="M25 45L60 25L95 45L60 65L25 45Z" fill="var(--neutral-100)" />
            <path d="M25 45V85L60 105V65" />
            <path d="M95 45V85L60 105" />
            {/* Box tape */}
            <path d="M60 25V65" stroke="var(--brand-primary)" strokeWidth="2" />
            <path d="M25 45l35 20" stroke="var(--brand-primary)" strokeWidth="1.5" />
          </svg>
        );
      case "category":
        return (
          <svg
            className="w-32 h-32 text-neutral-300"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Wooden Crate outline */}
            <path d="M20 45h80v45H20z" fill="var(--neutral-100)" />
            {/* Horizontal planks */}
            <line x1="20" y1="60" x2="100" y2="60" />
            <line x1="20" y1="75" x2="100" y2="75" />
            {/* Diagonal brace lines */}
            <line x1="20" y1="45" x2="100" y2="90" stroke="var(--neutral-200)" strokeWidth="1.5" />
            {/* Organic Wheat sprig growing out of crate */}
            <path
              d="M60 45c0-10-8-15-8-25 0 0 6 5 8 10 2-5 8-10 8-10 0 10-8 15-8 25z"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              fill="rgba(19, 56, 43, 0.1)"
            />
            <path
              d="M56 22c-2-2-6-2-6-2 0 0 3 4 5 5M64 22c2-2 6-2 6-2 0 0-3 4-5 5"
              stroke="var(--brand-accent)"
              strokeWidth="1.5"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto select-none transition-all duration-500",
        className
      )}
      {...props}
    >
      <div className="mb-6 flex justify-center">{renderIllustration()}</div>
      <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{description}</p>
      {action && <div className="animate-fade-in">{action}</div>}
    </div>
  );
}
