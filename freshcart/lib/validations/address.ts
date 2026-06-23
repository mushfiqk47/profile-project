import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(5, "Holding/Road details must be at least 5 characters"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "District/Division must be at least 2 characters"),
  zip: z.string().regex(/^\d{4}$/, "Postal code must be 4 digits (e.g. 1212)"),
  instructions: z.string().optional()
});

export type AddressFormData = z.infer<typeof addressSchema>;
