"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { LogIn, Sparkles, AlertCircle } from "lucide-react";
import { useUserStore } from "@/lib/store/user";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = (data: LoginFormData) => {
    // Standard mock login
    login("John Doe", data.email);
    toast("Logged in successfully! Welcome back.", "success");
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
              Sign In
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Access your saved favorites, address book, and order logs.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast("Reset link sent if email is registered", "info")}
                  className="text-xs text-brand-primary hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>
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

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded-md accent-brand-primary border-neutral-300 focus:ring-brand-primary"
                />
                Remember me on this browser
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-1.5 h-11 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-xs transition-colors mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
            </button>

          </form>

          {/* Social Logins */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <span className="relative bg-white px-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-neutral-700">
              <button
                onClick={() => {
                  login("John Doe", "john.doe@google.com");
                  toast("Logged in with Google account!", "success");
                  router.push("/shop");
                }}
                className="flex items-center justify-center gap-1.5 h-10 border border-neutral-200 hover:border-neutral-300 rounded-lg bg-neutral-50 hover:bg-white cursor-pointer select-none transition-all"
              >
                <span>Google</span>
              </button>
              <button
                onClick={() => {
                  login("John Doe", "john.doe@apple.com");
                  toast("Logged in with Apple ID!", "success");
                  router.push("/shop");
                }}
                className="flex items-center justify-center gap-1.5 h-10 border border-neutral-200 hover:border-neutral-300 rounded-lg bg-neutral-50 hover:bg-white cursor-pointer select-none transition-all"
              >
                <span>Apple</span>
              </button>
            </div>
          </div>

          {/* Redirect to Signup */}
          <div className="text-xs text-neutral-500 font-medium text-center border-t pt-4">
            New to FreshCart?{" "}
            <Link href="/signup" className="text-brand-primary font-bold hover:underline">
              Create an Account →
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
            <h2 className="text-3xl font-display font-extrabold leading-tight">Freshness hand-picked, safely delivered.</h2>
            <p className="text-xs text-neutral-200 mt-2 leading-relaxed font-medium">
              We carefully inspect every organic crop, sourdough loaf, and cuts of meat to match our high neighborhood standard.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
