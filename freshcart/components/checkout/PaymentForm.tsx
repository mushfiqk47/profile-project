"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentFormData } from "@/lib/validations/payment";
import { CreditCard, ShieldCheck, ArrowRight, Wallet, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  buttonText?: string;
  className?: string;
}

export default function PaymentForm({
  onSubmit,
  buttonText = "Use this payment method",
  className,
}: PaymentFormProps) {
  const [paymentTypeState, setPaymentTypeState] = useState<"card" | "mfs">("card");
  const [selectedMFS, setSelectedMFS] = useState<"bKash" | "Nagad" | "Rocket">("bKash");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: "card",
      cardNumber: "",
      expiry: "",
      cvv: "",
      nameOnCard: "",
      mfsProvider: "bKash",
      walletNumber: "",
      accountName: "",
      billingAddressSame: true,
    },
  });

  // Keep Zod sync with active tab state
  useEffect(() => {
    setValue("paymentType", paymentTypeState);
  }, [paymentTypeState, setValue]);

  // Keep Zod sync with active MFS provider
  useEffect(() => {
    setValue("mfsProvider", selectedMFS);
  }, [selectedMFS, setValue]);

  const [cardBrand, setCardBrand] = useState<"Visa" | "Mastercard" | "Amex" | "Discover" | "Unknown">("Unknown");
  const cardNumberValue = watch("cardNumber");

  // Format Card Number & Detect Brand
  useEffect(() => {
    if (!cardNumberValue) {
      setCardBrand("Unknown");
      return;
    }

    const cleanNumber = cardNumberValue.replace(/\D/g, "");
    
    // Auto-detect brand
    if (cleanNumber.startsWith("4")) {
      setCardBrand("Visa");
    } else if (/^5[1-5]/.test(cleanNumber) || /^22[2-9]/.test(cleanNumber)) {
      setCardBrand("Mastercard");
    } else if (/^3[47]/.test(cleanNumber)) {
      setCardBrand("Amex");
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      setCardBrand("Discover");
    } else {
      setCardBrand("Unknown");
    }

    // Auto-formatting (adding spaces every 4 characters)
    let formatted = cleanNumber;
    if (cleanNumber.length > 0) {
      if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37")) {
        // Amex layout: 4-6-5
        const match = cleanNumber.match(/^(\d{1,4})(\d{0,6})(\d{0,5})$/);
        if (match) {
          formatted = [match[1], match[2], match[3]].filter(Boolean).join(" ");
        }
      } else {
        // Standard layout: 4-4-4-4
        const chunks = cleanNumber.match(/.{1,4}/g);
        if (chunks) {
          formatted = chunks.join(" ");
        }
      }
    }

    if (formatted !== cardNumberValue) {
      setValue("cardNumber", formatted, { shouldValidate: true });
    }
  }, [cardNumberValue, setValue]);

  // Watch Expiry input to auto-format with slash
  const expiryValue = watch("expiry");
  useEffect(() => {
    if (!expiryValue) return;

    const clean = expiryValue.replace(/\D/g, "");
    let formatted = clean;

    if (clean.length > 2) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }

    if (formatted !== expiryValue) {
      setValue("expiry", formatted, { shouldValidate: true });
    }
  }, [expiryValue, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4 text-left select-none", className)}
    >
      {/* Payment Type Tab Switcher */}
      <div className="flex border-b border-neutral-200 mb-2 select-none">
        <button
          type="button"
          onClick={() => setPaymentTypeState("card")}
          className={cn(
            "flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer",
            paymentTypeState === "card"
              ? "border-brand-primary text-brand-primary font-bold"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          )}
        >
          Credit / Debit Card
        </button>
        <button
          type="button"
          onClick={() => setPaymentTypeState("mfs")}
          className={cn(
            "flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer",
            paymentTypeState === "mfs"
              ? "border-brand-primary text-brand-primary font-bold"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          )}
        >
          Mobile Banking (bKash/Nagad)
        </button>
      </div>

      {paymentTypeState === "card" ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Name on Card */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nameOnCard" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              Name on Card
            </label>
            <input
              id="nameOnCard"
              type="text"
              placeholder="e.g. Mushfiq Rahman…"
              autoComplete="cc-name"
              {...register("nameOnCard")}
              className={cn(
                "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary",
                errors.nameOnCard && "border-red-300 focus:ring-red-100 focus:border-red-400"
              )}
            />
            {errors.nameOnCard && (
              <span className="text-[10px] text-red-600 font-semibold">{errors.nameOnCard.message}</span>
            )}
          </div>

          {/* Card Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cardNumber" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              Card Number
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                type="text"
                placeholder="0000 0000 0000 0000…"
                autoComplete="cc-number"
                spellCheck={false}
                maxLength={19}
                {...register("cardNumber")}
                className={cn(
                  "w-full pl-3 pr-16 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary font-mono",
                  errors.cardNumber && "border-red-300 focus:ring-red-100 focus:border-red-400"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-bold text-[10px] uppercase text-neutral-400 bg-white border px-2 py-0.5 rounded-sm select-none pointer-events-none">
                {cardBrand !== "Unknown" ? cardBrand : "Card"}
              </div>
            </div>
            {errors.cardNumber && (
              <span className="text-[10px] text-red-600 font-semibold">{errors.cardNumber.message}</span>
            )}
          </div>

          {/* Grid: Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expiration Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="expiry" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                Expiration
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM/YY…"
                autoComplete="cc-exp"
                spellCheck={false}
                maxLength={5}
                {...register("expiry")}
                className={cn(
                  "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary font-mono",
                  errors.expiry && "border-red-300 focus:ring-red-100 focus:border-red-400"
                )}
              />
              {errors.expiry && (
                <span className="text-[10px] text-red-600 font-semibold">{errors.expiry.message}</span>
              )}
            </div>

            {/* CVV */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cvv" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                CVV Code
              </label>
              <input
                id="cvv"
                type="password"
                placeholder="•••…"
                autoComplete="cc-csc"
                spellCheck={false}
                maxLength={4}
                {...register("cvv")}
                className={cn(
                  "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary font-mono",
                  errors.cvv && "border-red-300 focus:ring-red-100 focus:border-red-400"
                )}
              />
              {errors.cvv && (
                <span className="text-[10px] text-red-600 font-semibold">{errors.cvv.message}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* MFS Provider Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              Select Mobile Banking Partner
            </span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "bKash", color: "bg-pink-600 border-pink-600 text-white" },
                { id: "Nagad", color: "bg-orange-500 border-orange-500 text-white" },
                { id: "Rocket", color: "bg-purple-700 border-purple-700 text-white" },
              ].map((prov) => {
                const isSelected = selectedMFS === prov.id;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setSelectedMFS(prov.id as any)}
                    className={cn(
                      "p-3 rounded-lg border text-xs font-bold cursor-pointer text-center select-none transition-all flex items-center justify-center gap-1.5 h-12",
                      isSelected
                        ? prov.color
                        : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {prov.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Mobile Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="walletNumber" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              MFS Wallet Mobile Number (11 digits)
            </label>
            <input
              id="walletNumber"
              type="text"
              maxLength={11}
              placeholder="e.g. 01712345678…"
              {...register("walletNumber")}
              className={cn(
                "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary font-mono",
                errors.walletNumber && "border-red-300 focus:ring-red-100 focus:border-red-400"
              )}
            />
            {errors.walletNumber && (
              <span className="text-[10px] text-red-600 font-semibold">{errors.walletNumber.message}</span>
            )}
          </div>

          {/* Account Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="accountName" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              Wallet Account Holder Name
            </label>
            <input
              id="accountName"
              type="text"
              placeholder="e.g. Mushfiq Rahman…"
              {...register("accountName")}
              className={cn(
                "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary",
                errors.accountName && "border-red-300 focus:ring-red-100 focus:border-red-400"
              )}
            />
            {errors.accountName && (
              <span className="text-[10px] text-red-600 font-semibold">{errors.accountName.message}</span>
            )}
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="flex items-center gap-2 p-3 bg-neutral-100 border border-neutral-200 rounded-xl mt-1 select-none">
        <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        <span className="text-[10px] text-neutral-600 font-medium leading-normal">
          Secured connection. FreshCart BD does not store MFS PINs or complete credentials.
        </span>
      </div>

      {/* Action Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-xs select-none transition-colors mt-2 focus-ring"
      >
        {paymentTypeState === "card" ? (
          <CreditCard className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Wallet className="w-4 h-4" aria-hidden="true" />
        )}
        <span>{isSubmitting ? "Saving…" : buttonText}</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </form>
  );
}
