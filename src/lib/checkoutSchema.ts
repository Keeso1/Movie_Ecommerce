
// src/lib/checkoutSchema.ts
import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .transform((val) => val.replace(/\s/g, "")),
  cardHolder: z.string().min(1, "Card holder name is required"),
  expiryMonth: z
    .string()
    .min(2, "Month is required")
    .max(2, "Month must be 2 digits"),
  expiryYear: z
    .string()
    .min(2, "Year is required")
    .max(2, "Year must be 2 digits"),
  cvv: z.string().min(3, "CVV is required").max(3, "CVV must be 3 digits"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type CheckoutFormData = AddressFormData & PaymentFormData;
