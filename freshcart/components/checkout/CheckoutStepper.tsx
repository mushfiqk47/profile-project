"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CheckoutStepperProps {
  currentStep: number; // 1: Delivery, 2: Payment, 3: Review
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { number: 1, label: "Delivery" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Review & Order" }
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-6 select-none">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 z-0" />

        {/* Progress bar line */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%"
          }}
          transition={{ duration: 0.3 }}
          className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0"
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center z-10 relative">
              {/* Step circle marker */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "var(--brand-primary)"
                    : isActive
                      ? "#FFFFFF"
                      : "var(--neutral-100)",
                  borderColor: isCompleted || isActive ? "var(--brand-primary)" : "var(--neutral-300)"
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-xs",
                  isCompleted
                    ? "text-white"
                    : isActive
                      ? "text-brand-primary border-brand-primary bg-white"
                      : "text-neutral-500 border-neutral-300"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{step.number}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <span
                className={cn(
                  "text-[10px] uppercase font-bold tracking-wider mt-2 transition-colors",
                  isCompleted || isActive ? "text-brand-primary" : "text-neutral-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
