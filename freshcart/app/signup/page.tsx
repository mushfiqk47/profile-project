"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/validations/auth";
import { UserPlus, Sparkles, ArrowRight, ArrowLeft, CheckCircle, ShieldAlert } from "lucide-react";
import { useUserStore } from "@/lib/store/user";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useUserStore();

  const [step, setStep] = useState(1);
  const [coverageState, setCoverageState] = useState<"unchecked" | "covered" | "waitlist">("unchecked");

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      zip: ""
    }
  });

  const handleNextStep = async () => {
    let fieldsToValidate: ("email" | "password" | "confirmPassword" | "firstName" | "lastName" | "phone" | "zip")[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["email", "password", "confirmPassword"];
    } else if (step === 2) {
      fieldsToValidate = ["firstName", "lastName", "phone"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleZipCheck = async () => {
    const isValid = await trigger("zip");
    if (!isValid) return;

    const zipVal = getValues("zip");
    // Mock coverage check (SF zip codes starting with 941 are covered)
    if (zipVal.startsWith("941") || zipVal.startsWith("940")) {
      setCoverageState("covered");
      toast("Great news! FreshCart covers your delivery zone.", "success");
    } else {
      setCoverageState("waitlist");
      toast("We are coming to your area soon! Added to waitlist.", "info");
    }
  };

  const onSubmit = (data: SignupFormData) => {
    const fullName = `${data.firstName} ${data.lastName}`;
    signup(fullName, data.email, data.phone);
    toast("Welcome to FreshCart! Account created.", "success");
    router.push("/shop");
  };

  return (
    <div className="min-h-[85vh] w-full grid grid-cols-1 md:grid-cols-2 select-none text-left">
      
      {/* Left Column: Form credentials */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-white">
        <div className="max-w-md w-full mx-auto flex flex-col gap-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-brand-primary mb-3">
              <Sparkles className="w-5 h-5 fill-brand-accent text-brand-accent animate-pulse" />
              FreshCart
            </div>
            <h1 className="text-3xl font-display font-extrabold text-neutral-900 leading-tight">
              Sign Up
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Create an account to start shopping farm-fresh neighborhood curations.
            </p>
          </div>

          {/* Progress dots bar */}
          <div className="flex items-center gap-2 select-none">
            {[1, 2, 3].map((dotNum) => (
              <div
                key={dotNum}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  dotNum === step ? "w-6 bg-brand-primary" : "w-2 bg-neutral-200"
                )}
              />
            ))}
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider ml-auto">
              Step {step} of 3
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* STEP 1: CREDENTIALS */}
            {step === 1 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. john@doe.com"
                    {...register("email")}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-600 font-semibold">{errors.email.message}</span>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Create Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    {...register("password")}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                  />
                  {errors.password && (
                    <span className="text-[10px] text-red-600 font-semibold">{errors.password.message}</span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirmPassword" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    {...register("confirmPassword")}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                  />
                  {errors.confirmPassword && (
                    <span className="text-[10px] text-red-600 font-semibold">{errors.confirmPassword.message}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full flex items-center justify-center gap-1.5 h-11 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors mt-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: PROFILE DETAILS */}
            {step === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Name Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="e.g. John"
                      {...register("firstName")}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                    />
                    {errors.firstName && (
                      <span className="text-[10px] text-red-600 font-semibold">{errors.firstName.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="e.g. Doe"
                      {...register("lastName")}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                    />
                    {errors.lastName && (
                      <span className="text-[10px] text-red-600 font-semibold">{errors.lastName.message}</span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Phone (Optional)
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="e.g. (555) 000-0000"
                    {...register("phone")}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                  />
                </div>

                {/* Step Navigation */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 h-11 border border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-neutral-50 hover:bg-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 h-11 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                  >
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ZIP COVERAGE */}
            {step === 3 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                
                {/* Zip Input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="zip" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Delivery ZIP Zone
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="zip"
                      type="text"
                      placeholder="e.g. 94102"
                      maxLength={5}
                      {...register("zip")}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleZipCheck}
                      className="h-10 px-4 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {errors.zip && (
                    <span className="text-[10px] text-red-600 font-semibold">{errors.zip.message}</span>
                  )}
                </div>

                {/* Coverage Status Result panels */}
                {coverageState === "covered" && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3 text-xs leading-relaxed select-none animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Zone Active!</strong>
                      FreshCart provides 30-min express courier drops to your door in this neighborhood code.
                    </div>
                  </div>
                )}

                {coverageState === "waitlist" && (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-3 text-xs leading-relaxed select-none animate-fade-in">
                    <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Waitlist Registered</strong>
                      We don't deliver in this ZIP code yet, but we've placed your account on our waitlist. You can still set up your account.
                    </div>
                  </div>
                )}

                {/* Form Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 h-11 border border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-neutral-50 hover:bg-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || coverageState === "unchecked"}
                    className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-xs transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Signup</span>
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Redirect to Login */}
          <div className="text-xs text-neutral-500 font-medium text-center border-t pt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-primary font-bold hover:underline">
              Sign In here →
            </Link>
          </div>

        </div>
      </div>

      {/* Right Column: Visual Panel */}
      <div
        className="hidden md:block bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-brand-primary/20 backdrop-blur-xs flex items-end p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-display font-extrabold leading-tight">Hand-picked fresh local organic produce.</h2>
            <p className="text-xs text-neutral-200 mt-2 leading-relaxed font-medium">
              We carefully inspect every organic crop, sourdough loaf, and cuts of meat to match our high neighborhood standard.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
