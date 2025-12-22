import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

export const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  cardHolder: z.string().min(1, "Card holder name is required"),
  expiryMonth: z.string()
    .min(2, "Month must be 2 digits")
    .max(2, "Month must be 2 digits")
    .regex(/^(0[1-9]|1[0-2])$/, "Month must be 01-12"),
  expiryYear: z.string()
    .min(2, "Year must be 2 digits")
    .max(2, "Year must be 2 digits")
    .regex(/^\d{2}$/, "Year must be 2 digits"),
  cvv: z.string()
    .min(3, "CVV must be 3 digits")
    .max(3, "CVV must be 3 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type CheckoutFormData = AddressFormData & PaymentFormData;
