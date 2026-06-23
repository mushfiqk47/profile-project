import { z } from "zod";

export const paymentSchema = z.object({
  paymentType: z.enum(["card", "mfs"]),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
  nameOnCard: z.string().optional(),
  mfsProvider: z.string().optional(),
  walletNumber: z.string().optional(),
  accountName: z.string().optional(),
  billingAddressSame: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.paymentType === "card") {
    const cleanNum = (data.cardNumber || "").replace(/\s/g, "");
    if (!data.cardNumber || cleanNum.length < 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card number must be 15 to 16 digits",
        path: ["cardNumber"]
      });
    }
    if (!data.expiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.expiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiration date must be in MM/YY format",
        path: ["expiry"]
      });
    }
    if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVV must be 3 or 4 digits",
        path: ["cvv"]
      });
    }
    if (!data.nameOnCard || data.nameOnCard.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cardholder name is required",
        path: ["nameOnCard"]
      });
    }
  } else if (data.paymentType === "mfs") {
    if (!data.mfsProvider || !["bKash", "Nagad", "Rocket"].includes(data.mfsProvider)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a valid MFS provider",
        path: ["mfsProvider"]
      });
    }
    if (!data.walletNumber || !/^01[3-9]\d{8}$/.test(data.walletNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Wallet number must be a valid 11-digit mobile number (e.g., 01712345678)",
        path: ["walletNumber"]
      });
    }
    if (!data.accountName || data.accountName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account holder name is required",
        path: ["accountName"]
      });
    }
  }
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
