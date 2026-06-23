"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore, ToastItem } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  return {
    toast: (message: string, type?: "success" | "error" | "info") => addToast(message, type),
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    info: (message: string) => addToast(message, "info"),
  };
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 fill-red-50" />,
    info: <Info className="w-5 h-5 text-blue-600 fill-blue-50" />
  };

  const bgClasses = {
    success: "bg-white border-emerald-100 shadow-[0_10px_20px_rgba(16,185,129,0.08)]",
    error: "bg-white border-red-100 shadow-[0_10px_20px_rgba(239,68,68,0.08)]",
    info: "bg-white border-blue-100 shadow-[0_10px_20px_rgba(59,130,246,0.08)]"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      layout
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-card text-neutral-900 shadow-md",
        bgClasses[toast.type]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 text-sm font-medium leading-normal text-neutral-800">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors p-0.5 rounded-full hover:bg-neutral-100 cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
