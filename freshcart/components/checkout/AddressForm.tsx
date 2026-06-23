"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormData } from "@/lib/validations/address";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  initialValues?: Partial<AddressFormData>;
  buttonText?: string;
  className?: string;
}

export default function AddressForm({
  onSubmit,
  initialValues,
  buttonText = "Deliver to this address",
  className,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: initialValues?.street || "",
      apartment: initialValues?.apartment || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      zip: initialValues?.zip || "",
      instructions: initialValues?.instructions || "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4 text-left select-none", className)}
    >
      
      {/* Street Address */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="street" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
          Holding, Road & Block details
        </label>
        <input
          id="street"
          type="text"
          placeholder="e.g. House 45, Road 11, Sector 3…"
          autoComplete="address-line1"
          {...register("street")}
          className={cn(
            "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary",
            errors.street && "border-red-300 focus:ring-red-100 focus:border-red-400"
          )}
        />
        {errors.street && (
          <span className="text-[10px] text-red-600 font-semibold">{errors.street.message}</span>
        )}
      </div>

      {/* Apartment, Unit, Suite */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="apartment" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
          Flat, Floor, Area (Optional)
        </label>
        <input
          id="apartment"
          type="text"
          placeholder="e.g. Flat 4A, Gulshan-2…"
          autoComplete="address-line2"
          {...register("apartment")}
          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
        />
      </div>

      {/* Grid: City, State, Zip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
            City
          </label>
          <input
            id="city"
            type="text"
            placeholder="e.g. Dhaka…"
            autoComplete="address-level2"
            {...register("city")}
            className={cn(
              "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary",
              errors.city && "border-red-300 focus:ring-red-100 focus:border-red-400"
            )}
          />
          {errors.city && (
            <span className="text-[10px] text-red-600 font-semibold">{errors.city.message}</span>
          )}
        </div>

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
            District / Division
          </label>
          <input
            id="state"
            type="text"
            placeholder="e.g. Dhaka Division…"
            autoComplete="address-level1"
            spellCheck={false}
            maxLength={30}
            {...register("state")}
            className={cn(
              "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary",
              errors.state && "border-red-300 focus:ring-red-100 focus:border-red-400"
            )}
          />
          {errors.state && (
            <span className="text-[10px] text-red-600 font-semibold">{errors.state.message}</span>
          )}
        </div>

        {/* Zip Code */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="zip" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
            Postal Code
          </label>
          <input
            id="zip"
            type="text"
            placeholder="e.g. 1212…"
            autoComplete="postal-code"
            spellCheck={false}
            maxLength={10}
            {...register("zip")}
            className={cn(
              "w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary",
              errors.zip && "border-red-300 focus:ring-red-100 focus:border-red-400"
            )}
          />
          {errors.zip && (
            <span className="text-[10px] text-red-600 font-semibold">{errors.zip.message}</span>
          )}
        </div>

      </div>

      {/* Delivery Instructions */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="instructions" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
          Delivery Notes / Instructions (Optional)
        </label>
        <textarea
          id="instructions"
          rows={3}
          placeholder="e.g. Buzzer code #1234. Leave package by the yellow door…"
          {...register("instructions")}
          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary resize-none"
        />
      </div>

      {/* Action Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-xs select-none transition-colors mt-2 focus-ring"
      >
        <MapPin className="w-4 h-4" aria-hidden="true" />
        <span>{isSubmitting ? "Saving Address…" : buttonText}</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>

    </form>
  );
}
