"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, ShieldCheck, Check, Edit, Plus, ChevronRight, ShoppingBag } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import DeliverySlotPicker from "@/components/checkout/DeliverySlotPicker";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import { useCartStore } from "@/lib/store/cart";
import { useUserStore } from "@/lib/store/user";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, generateId, cn } from "@/lib/utils";
import { Address, PaymentCard, Order } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Zustand Stores
  const {
    items,
    clearCart,
    deliveryMethod,
    setDeliveryMethod,
    scheduledSlot,
    setScheduledSlot,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTaxAmount,
    getTotal,
    tipAmount
  } = useCartStore();

  const {
    user,
    addresses,
    addAddress,
    activeAddressId,
    setActiveAddress,
    paymentMethods,
    addPaymentCard,
    activeCardId,
    setActiveCard,
    addOrder
  } = useUserStore();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Local state
  const [currentStep, setCurrentStep] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  const activeAddress = addresses.find((addr) => addr.id === activeAddressId);
  const activeCard = paymentMethods.find((card) => card.id === activeCardId);

  // Address Submit Handler
  const handleAddressSubmit = (data: any) => {
    addAddress(data);
    setShowNewAddressForm(false);
    toast("New delivery address saved!", "success");
  };

  // Card Submit Handler
  const handleCardSubmit = (data: any) => {
    if (data.paymentType === "mfs") {
      addPaymentCard({
        cardNumber: data.walletNumber,
        expiry: "MFS",
        cvv: "MFS",
        nameOnCard: data.accountName,
        brand: data.mfsProvider
      });
      toast("New mobile wallet added!", "success");
    } else {
      // Determine card brand from input or helper
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
      toast("New payment card added!", "success");
    }
    
    setShowNewCardForm(false);
  };

  // Step Navigations
  const handleStep1Proceed = () => {
    if (!activeAddressId) {
      toast("Please select or add a delivery address", "error");
      return;
    }
    if (deliveryMethod === "Scheduled" && !scheduledSlot) {
      toast("Please pick a scheduled delivery time window", "error");
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Proceed = () => {
    if (!activeCardId) {
      toast("Please select or add a payment method", "error");
      return;
    }
    setCurrentStep(3);
  };

  // Order Placement
  const handlePlaceOrder = () => {
    if (!activeAddress || !activeCard) return;

    const orderId = `FC-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 3).toUpperCase()}`;
    
    const paymentMethodText = activeCard.brand === "Cash"
      ? "Cash on Delivery"
      : ["bKash", "Nagad", "Rocket"].includes(activeCard.brand)
        ? `${activeCard.brand} Wallet (${activeCard.cardNumber})`
        : `${activeCard.brand} Card (ending in ${activeCard.cardNumber.slice(-4)})`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      status: "Pending",
      deliveryMethod,
      deliveryAddress: `${activeAddress.street}, ${activeAddress.apartment ? activeAddress.apartment + ", " : ""}${activeAddress.city}, ${activeAddress.state} ${activeAddress.zip}`,
      paymentMethod: paymentMethodText,
      subtotal: getSubtotal(),
      discount: getDiscountAmount(),
      deliveryFee: getDeliveryFee(),
      tax: getTaxAmount(),
      tip: tipAmount,
      total: getTotal(),
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        weight: item.product.weight,
        image: item.product.image
      }))
    };

    // Save order, clear cart, redirect
    addOrder(newOrder);
    clearCart();
    toast("Order placed successfully!", "success");
    router.push(`/order/confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return null; // Redirect handles it
  }

  return (
    <PageWrapper className="py-8 select-none text-left">
      <div className="flex flex-col gap-6">
        
        {/* Step Indicator Header */}
        <div className="border-b border-neutral-200 pb-3 mb-2">
          <h1 className="text-3xl font-display font-extrabold text-neutral-900 leading-tight">
            Checkout
          </h1>
          <CheckoutStepper currentStep={currentStep} />
        </div>

        {/* 2-Column Split: Form sections / Order summary sticky card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Interactive Forms */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* STEP 1: DELIVERY */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                {/* Saved addresses selector */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-brand-primary" />
                    1. Delivery Address
                  </h3>

                  {!showNewAddressForm ? (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {addresses.map((addr) => {
                          const isSelected = activeAddressId === addr.id;
                          return (
                            <button
                              key={addr.id}
                              onClick={() => setActiveAddress(addr.id)}
                              className={cn(
                                "p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-36 relative select-none",
                                isSelected
                                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                  : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600"
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                                  {addr.street.split(" ")[1]} Road
                                </span>
                                {isSelected && (
                                  <span className="p-0.5 bg-brand-primary text-white rounded-full">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 text-xs">
                                <strong className="text-neutral-800 text-sm">{addr.street}</strong>
                                {addr.apartment && <p className="text-neutral-500">{addr.apartment}</p>}
                                <p className="text-neutral-400 mt-1">{addr.city}, {addr.state} {addr.zip}</p>
                              </div>
                            </button>
                          );
                        })}

                        {/* Add address card button */}
                        <button
                          onClick={() => setShowNewAddressForm(true)}
                          className="p-4 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center text-center h-36 text-neutral-500 font-semibold gap-2 transition-all"
                        >
                          <Plus className="w-6 h-6 text-neutral-400" />
                          <span className="text-xs">Add New Address</span>
                        </button>
                      </div>

                      {/* Delivery Instructions notes display */}
                      {activeAddress?.instructions && (
                        <div className="mt-2 text-[11px] text-neutral-500 bg-neutral-50 border p-3 rounded-lg leading-relaxed">
                          <strong>Courier Instructions:</strong> "{activeAddress.instructions}"
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Embedded Address Creation Form */
                    <div className="border border-neutral-100 bg-neutral-50/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b">
                        <span className="text-xs font-bold text-neutral-800">Add New Delivery Address</span>
                        <button
                          onClick={() => setShowNewAddressForm(false)}
                          className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <AddressForm onSubmit={handleAddressSubmit} />
                    </div>
                  )}
                </div>

                {/* Delivery Timepicker */}
                {!showNewAddressForm && (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ClockIcon className="w-4.5 h-4.5 text-brand-primary" />
                      2. Delivery Window
                    </h3>
                    <DeliverySlotPicker
                      selectedSlot={scheduledSlot}
                      onSlotSelect={setScheduledSlot}
                      deliveryMethod={deliveryMethod}
                      onMethodChange={setDeliveryMethod}
                    />
                  </div>
                )}

                {/* Next CTA Step */}
                {!showNewAddressForm && (
                  <button
                    onClick={handleStep1Proceed}
                    className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4.5 h-4.5 text-brand-primary" />
                      3. Payment Credentials
                    </h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-brand-primary hover:underline font-bold cursor-pointer"
                    >
                      Back to Delivery
                    </button>
                  </div>

                  {!showNewCardForm ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {paymentMethods.map((card) => {
                          const isSelected = activeCardId === card.id;
                          return (
                            <button
                              key={card.id}
                              onClick={() => setActiveCard(card.id)}
                              className={cn(
                                "p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-36 relative select-none",
                                isSelected
                                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                  : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600"
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider border rounded px-1.5 py-0.5 bg-neutral-100 text-neutral-600">
                                  {card.brand}
                                </span>
                                {isSelected && (
                                  <span className="p-0.5 bg-brand-primary text-white rounded-full">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <div className="mt-2">
                                <span className="font-mono text-neutral-800 text-base tracking-widest block">
                                  {card.cardNumber}
                                </span>
                                <div className="flex justify-between items-center text-[10px] text-neutral-400 mt-2">
                                  <span>Expires: {card.expiry}</span>
                                  <span className="font-semibold text-neutral-700">{card.nameOnCard}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}

                        {/* Add card button */}
                        <button
                          onClick={() => setShowNewCardForm(true)}
                          className="p-4 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center text-center h-36 text-neutral-500 font-semibold gap-2 transition-all"
                        >
                          <Plus className="w-6 h-6 text-neutral-400" />
                          <span className="text-xs">Add New Card</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Embedded payment card creation form */
                    <div className="border border-neutral-100 bg-neutral-50/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b">
                        <span className="text-xs font-bold text-neutral-800">Add New Credit Card</span>
                        <button
                          onClick={() => setShowNewCardForm(false)}
                          className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <PaymentForm onSubmit={handleCardSubmit} />
                    </div>
                  )}
                </div>

                {/* Proceed to Review */}
                {!showNewCardForm && (
                  <button
                    onClick={handleStep2Proceed}
                    className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Proceed to Review & Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                
                {/* Delivery and payment review blocks */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-6">
                  
                  {/* Delivery Detail Block */}
                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-neutral-100">
                    <div className="flex items-start gap-3 text-xs">
                      <MapPin className="w-5 h-5 text-brand-accent mt-0.5" />
                      <div>
                        <strong className="text-neutral-800 text-sm uppercase font-display block">Delivery Details</strong>
                        <p className="text-neutral-600 font-semibold mt-1">
                          {activeAddress?.street}, {activeAddress?.apartment && `${activeAddress.apartment}, `}{activeAddress?.city}, {activeAddress?.state} {activeAddress?.zip}
                        </p>
                        <p className="text-brand-primary font-bold mt-1.5">
                          Window: {deliveryMethod === "Express"
                            ? "🚀 Express Dispatch (~30 mins)"
                            : deliveryMethod === "Standard"
                              ? "Same-Day Courier Delivery (2-4 hours)"
                              : `Scheduled slot: ${scheduledSlot?.date} at ${scheduledSlot?.time}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1 text-xs text-brand-primary hover:underline font-semibold cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Payment Detail Block */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 text-xs">
                      <CreditCard className="w-5 h-5 text-brand-accent mt-0.5" />
                      <div>
                        <strong className="text-neutral-800 text-sm uppercase font-display block">Payment Details</strong>
                        <p className="text-neutral-600 font-semibold mt-1">
                          {activeCard?.brand === "Cash"
                            ? "Cash on Delivery"
                            : ["bKash", "Nagad", "Rocket"].includes(activeCard?.brand || "")
                              ? `${activeCard?.brand} Wallet (${activeCard?.cardNumber})`
                              : `${activeCard?.brand} Card ending in ${activeCard?.cardNumber.slice(-4)}`}
                        </p>
                        {activeCard?.brand !== "Cash" && (
                          <p className="text-neutral-400 mt-0.5">Holder: {activeCard?.nameOnCard}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1 text-xs text-brand-primary hover:underline font-semibold cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border p-4 rounded-2xl flex items-start gap-3 text-xs shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-800 font-bold block">100% Freshness Guarantee</strong>
                      <p className="text-neutral-400 leading-normal mt-0.5">
                        Our couriers carefully inspect each item. If you aren't completely happy with your produce, we'll replace it instantly.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border p-4 rounded-2xl flex items-start gap-3 text-xs shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-800 font-bold block">Safe Delivery Guarantee</strong>
                      <p className="text-neutral-400 leading-normal mt-0.5">
                        Secure contact-free drop-off, photo verification receipt, and insurance protection included on every basket.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md select-none transition-colors text-center"
                >
                  Place Order · {formatPrice(getTotal())}
                </button>

              </div>
            )}

          </div>

          {/* Right Column: Order summary sidebar */}
          <div className="flex flex-col gap-6">
            <OrderSummaryCard showItemsDefault={true} />
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

// Inline custom clock icon to avoid imports mismatch
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
