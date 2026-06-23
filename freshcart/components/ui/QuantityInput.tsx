"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function QuantityInput({
  value,
  onChange,
  min = 0,
  max = 99,
  className,
  size = "md",
}: QuantityInputProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between bg-neutral-100 rounded-full border border-neutral-200 overflow-hidden shadow-xs select-none",
        isSm ? "h-8 px-1 py-0.5 gap-1.5" : isLg ? "h-12 px-3 py-1 gap-3" : "h-10 px-2 py-1 gap-2",
        className
      )}
    >
      <motion.button
        type="button"
        aria-label="Decrease quantity"
        onClick={handleDecrement}
        disabled={value <= min}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-700 disabled:text-neutral-400 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed",
          isSm ? "w-6 h-6" : isLg ? "w-8 h-8" : "w-7 h-7"
        )}
      >
        <Minus className={cn("stroke-[2.5]", isSm ? "w-3 h-3" : isLg ? "w-5 h-5" : "w-4 h-4")} />
      </motion.button>

      <span
        className={cn(
          "font-mono font-bold text-center text-neutral-900 min-w-[20px]",
          isSm ? "text-xs" : isLg ? "text-base" : "text-sm"
        )}
      >
        {value}
      </span>

      <motion.button
        type="button"
        aria-label="Increase quantity"
        onClick={handleIncrement}
        disabled={value >= max}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-700 disabled:text-neutral-400 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed",
          isSm ? "w-6 h-6" : isLg ? "w-8 h-8" : "w-7 h-7"
        )}
      >
        <Plus className={cn("stroke-[2.5]", isSm ? "w-3 h-3" : isLg ? "w-5 h-5" : "w-4 h-4")} />
      </motion.button>
    </div>
  );
}
