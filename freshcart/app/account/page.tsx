"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Settings, Receipt, Heart, MapPin, CreditCard, Shield, Save, Plus, Trash2, Camera, Trash } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/lib/store/user";
import { useToast } from "@/components/ui/Toast";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const { toast } = useToast();
  const {
    user,
    addresses,
    addAddress,
    removeAddress,
    paymentMethods,
    addPaymentCard,
    removePaymentCard,
    updateProfile
  } = useUserStore();

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [cardFormOpen, setCardFormOpen] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      toast("Name and email are required fields", "error");
      return;
    }
    updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });
    toast("Account profile details updated!", "success");
  };

  const handleAddressAdd = (data: any) => {
    addAddress(data);
    setAddressFormOpen(false);
    toast("Address added successfully!", "success");
  };

  const handleCardAdd = (data: any) => {
    if (data.paymentType === "mfs") {
      addPaymentCard({
        cardNumber: data.walletNumber,
        expiry: "MFS",
        cvv: "MFS",
        nameOnCard: data.accountName,
        brand: data.mfsProvider
      });
      toast("Mobile wallet added successfully!", "success");
    } else {
      const brand = data.cardNumber.startsWith("4")
        ? "Visa"
        : data.cardNumber.startsWith("5")
          ? "Mastercard"
          : data.cardNumber.startsWith("3")
            ? "Amex"
            : "Discover";

      addPaymentCard({
        cardNumber: `•••• •••• •••• ${data.cardNumber.replace(/\D/g, "").slice(-4)}`,
        expiry: data.expiry,
        cvv: "***",
        nameOnCard: data.nameOnCard,
        brand
      });
      toast("Payment card added successfully!", "success");
    }
    
    setCardFormOpen(false);
  };

  const menuItems = [
    { label: "Profile & Settings", href: "/account", icon: Settings, active: true },
    { label: "My Orders", href: "/account/orders", icon: Receipt },
    { label: "Favorites", href: "/account/favorites", icon: Heart },
  ];

  if (!user) return null;

  return (
    <PageWrapper className="py-8 select-none text-left">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <aside className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs lg:sticky lg:top-24">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-3 mb-4 select-none">
            Settings Menu
          </h3>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors",
                    item.active
                      ? "bg-brand-primary/5 text-brand-primary"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <Icon className="w-4 h-4 text-neutral-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Configurations Forms Grid */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Profile Section */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-display font-bold text-neutral-900 leading-tight">
                Profile Details
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Customize your name, contact numbers and credentials.
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
              {/* Avatar Upload mockup */}
              <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
                <div className="relative group">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div>
                  <strong className="text-sm font-bold text-neutral-800">John Doe</strong>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-none">Avatar upload limit: 2MB (JPEG, PNG)</p>
                </div>
              </div>

              {/* Grid: Name, Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 max-w-sm">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Phone Number</label>
                <input
                  type="text"
                  placeholder="(555) 000-0000"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-hidden focus:border-brand-primary focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-fit flex items-center justify-center gap-1.5 h-10 px-5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs select-none"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Addresses list */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-900 leading-tight">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage addresses to speed up checkout.
                </p>
              </div>
              {!addressFormOpen && (
                <button
                  onClick={() => setAddressFormOpen(true)}
                  className="flex items-center gap-1.5 h-9 px-3.5 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-white cursor-pointer select-none transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {addressFormOpen ? (
              <div className="border border-neutral-100 p-4 rounded-xl bg-neutral-50/50">
                <div className="flex items-center justify-between pb-3 border-b mb-3 select-none">
                  <span className="text-xs font-bold text-neutral-800">Add New Address</span>
                  <button onClick={() => setAddressFormOpen(false)} className="text-xs text-red-500 font-bold hover:underline cursor-pointer">
                    Cancel
                  </button>
                </div>
                <AddressForm onSubmit={handleAddressAdd} buttonText="Add Address" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 border rounded-xl bg-white flex justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-neutral-800 text-sm flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                        {addr.street}
                      </strong>
                      {addr.apartment && <p className="text-neutral-500 mt-0.5">{addr.apartment}</p>}
                      <p className="text-neutral-400 mt-1">{addr.city}, {addr.state} {addr.zip}</p>
                      {addr.isDefault && (
                        <span className="bg-brand-primary/10 text-brand-primary text-[8px] font-bold px-1.5 py-0.2 rounded uppercase mt-2 inline-block">Default</span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        removeAddress(addr.id);
                        toast("Address removed", "info");
                      }}
                      className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer self-start"
                      aria-label="Remove address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cards List */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-900 leading-tight">
                  Saved Credit Cards
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage credit card credentials.
                </p>
              </div>
              {!cardFormOpen && (
                <button
                  onClick={() => setCardFormOpen(true)}
                  className="flex items-center gap-1.5 h-9 px-3.5 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-white cursor-pointer select-none transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {cardFormOpen ? (
              <div className="border border-neutral-100 p-4 rounded-xl bg-neutral-50/50">
                <div className="flex items-center justify-between pb-3 border-b mb-3 select-none">
                  <span className="text-xs font-bold text-neutral-800">Add Credit Card</span>
                  <button onClick={() => setCardFormOpen(false)} className="text-xs text-red-500 font-bold hover:underline cursor-pointer">
                    Cancel
                  </button>
                </div>
                <PaymentForm onSubmit={handleCardAdd} buttonText="Add Credit Card" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((card) => (
                  <div key={card.id} className="p-4 border rounded-xl bg-white flex justify-between gap-3 text-xs select-none">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold border rounded px-1 bg-neutral-50 uppercase tracking-wider">
                          {card.brand}
                        </span>
                        {card.isDefault && (
                          <span className="bg-brand-primary/10 text-brand-primary text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">Default</span>
                        )}
                      </div>
                      <span className="font-mono text-neutral-800 text-sm tracking-widest block mt-2.5">
                        {card.cardNumber}
                      </span>
                      <div className="text-[10px] text-neutral-400 mt-2">
                        Expires: {card.expiry} · {card.nameOnCard}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        removePaymentCard(card.id);
                        toast("Payment card removed", "info");
                      }}
                      className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer self-start"
                      aria-label="Remove card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/20 border border-red-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3 select-none">
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4.5 h-4.5" />
              Security Danger Zone
            </h3>
            <p className="text-xs text-neutral-500 max-w-[50ch] leading-relaxed">
              Once you delete your account, all past grocery history, addresses, payment forms, and saved favorite items are permanently erased.
            </p>
            <button
              onClick={() => toast("Account deletion requested. Verification email sent.", "info")}
              className="w-fit h-9 px-4 border border-red-200 hover:border-red-300 text-red-700 bg-white hover:bg-red-50 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Delete Account
            </button>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
