"use client";

import React, { useState, useEffect } from "react";
import { Zap, Calendar, Clock, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeliverySlotPickerProps {
  selectedSlot: { date: string; time: string } | null;
  onSlotSelect: (slot: { date: string; time: string } | null) => void;
  deliveryMethod: "Standard" | "Express" | "Scheduled";
  onMethodChange: (method: "Standard" | "Express" | "Scheduled") => void;
}

export default function DeliverySlotPicker({
  selectedSlot,
  onSlotSelect,
  deliveryMethod,
  onMethodChange,
}: DeliverySlotPickerProps) {
  const [dates, setDates] = useState<{ dayName: string; dateStr: string; formatted: string }[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState("");

  const timeSlots = [
    { time: "08:00 AM - 10:00 AM", status: "available" },
    { time: "10:00 AM - 12:00 PM", status: "full" },
    { time: "12:00 PM - 02:00 PM", status: "available" },
    { time: "02:00 PM - 04:00 PM", status: "available" },
    { time: "04:00 PM - 06:00 PM", status: "full" },
    { time: "06:00 PM - 08:00 PM", status: "available" },
  ];

  // Generate date chips dynamically starting from today
  useEffect(() => {
    const list = [];
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : weekdays[d.getDay()];
      const monthStr = months[d.getMonth()];
      const dayNum = d.getDate();
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const formatted = `${monthStr} ${dayNum}`;

      list.push({ dayName, dateStr, formatted });
    }
    setDates(list);
    setSelectedDateStr(list[0].dateStr);
  }, []);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    // Reset slot time selection when switching dates
    onSlotSelect(null);
  };

  const handleTimeSlotSelect = (time: string) => {
    const selectedDateObj = dates.find((d) => d.dateStr === selectedDateStr);
    if (!selectedDateObj) return;

    onSlotSelect({
      date: `${selectedDateObj.dayName} (${selectedDateObj.formatted})`,
      time,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      
      {/* Delivery Method Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Express Option */}
        <button
          onClick={() => {
            onMethodChange("Express");
            onSlotSelect(null);
          }}
          className={cn(
            "p-4 rounded-xl border text-left cursor-pointer transition-all focus-ring flex flex-col justify-between h-32 relative overflow-hidden",
            deliveryMethod === "Express"
              ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
              : "border-neutral-200 hover:border-neutral-300 bg-white"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-accent">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Express
            </div>
            {deliveryMethod === "Express" && (
              <span className="p-0.5 bg-brand-primary text-white rounded-full">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold text-neutral-800">Rocket Delivery</span>
            <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
              Arrives in ~30 minutes. Surcharge of ৳120 applies.
            </p>
          </div>
        </button>

        {/* Standard Option */}
        <button
          onClick={() => {
            onMethodChange("Standard");
            onSlotSelect(null);
          }}
          className={cn(
            "p-4 rounded-xl border text-left cursor-pointer transition-all focus-ring flex flex-col justify-between h-32 relative overflow-hidden",
            deliveryMethod === "Standard"
              ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
              : "border-neutral-200 hover:border-neutral-300 bg-white"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Standard</span>
            {deliveryMethod === "Standard" && (
              <span className="p-0.5 bg-brand-primary text-white rounded-full">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold text-neutral-800">Same-Day Delivery</span>
            <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
              Arrives in 2-4 hours. Flat rate ৳60, free over ৳1,500.
            </p>
          </div>
        </button>

        {/* Scheduled Option */}
        <button
          onClick={() => {
            onMethodChange("Scheduled");
          }}
          className={cn(
            "p-4 rounded-xl border text-left cursor-pointer transition-all focus-ring flex flex-col justify-between h-32 relative overflow-hidden",
            deliveryMethod === "Scheduled"
              ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
              : "border-neutral-200 hover:border-neutral-300 bg-white"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <Calendar className="w-3.5 h-3.5 text-brand-primary" />
              Schedule
            </div>
            {deliveryMethod === "Scheduled" && (
              <span className="p-0.5 bg-brand-primary text-white rounded-full">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold text-neutral-800">Time Window Slot</span>
            <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
              Pick a convenient slot up to 7 days in advance.
            </p>
          </div>
        </button>
      </div>

      {/* Scheduled Time Pickers */}
      {deliveryMethod === "Scheduled" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border border-neutral-200 bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden"
        >
          {/* Day Chips scroll container */}
          <div>
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Calendar className="w-4 h-4 text-brand-primary" />
              1. Choose Date
            </h4>
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
            >
              {dates.map((d) => (
                <button
                  key={d.dateStr}
                  onClick={() => handleDateSelect(d.dateStr)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[76px] px-2 py-2 rounded-lg border text-center cursor-pointer transition-all",
                    selectedDateStr === d.dateStr
                      ? "border-brand-primary bg-brand-primary/5 font-semibold text-brand-primary"
                      : "border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-neutral-50"
                  )}
                >
                  <span className="text-[10px] text-neutral-400 leading-none">{d.dayName}</span>
                  <span className="text-xs font-mono font-bold mt-1 leading-none">{d.formatted}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time slot grid */}
          <div>
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Clock className="w-4 h-4 text-brand-primary" />
              2. Choose Time Slot
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {timeSlots.map((slot) => {
                const isFull = slot.status === "full";
                const isSelected = selectedSlot?.time === slot.time;

                return (
                  <button
                    key={slot.time}
                    disabled={isFull}
                    onClick={() => handleTimeSlotSelect(slot.time)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all select-none",
                      isFull
                        ? "bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed"
                        : isSelected
                          ? "border-brand-primary bg-brand-primary/5 font-semibold text-brand-primary cursor-pointer"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white cursor-pointer"
                    )}
                  >
                    <span>{slot.time}</span>
                    {isFull ? (
                      <span className="text-[9px] uppercase font-bold text-red-400 bg-red-50 border border-red-100 rounded px-1.5 py-0.2">Full</span>
                    ) : isSelected ? (
                      <Check className="w-3.5 h-3.5 text-brand-primary" />
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-emerald-500 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.2">Available</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Show selection preview */}
          {selectedSlot && (
            <div className="mt-2 bg-neutral-100 text-neutral-800 p-3 rounded-lg text-xs font-semibold text-center border">
              Selected: <span className="text-brand-primary">{selectedSlot.date}</span> at <span className="text-brand-primary">{selectedSlot.time}</span>
            </div>
          )}

        </motion.div>
      )}
    </div>
  );
}
