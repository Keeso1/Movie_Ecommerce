"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/checkout-actions";
import { AddressFormData, PaymentFormData } from "@/lib/checkoutSchema";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<"address" | "payment" | "confirmation">("address");
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState<AddressFormData>({
    street: "",
    postalCode: "",
    city: "",
    country: "Greece",
  });

  const [payment, setPayment] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Wait until cart is loaded from cookies
  useEffect(() => {
    setIsCartLoaded(true);
  }, [cart]);

  // Compute totals
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const tax = cartTotal * 0.25;
  const total = cartTotal + shipping + tax;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      setPayment(prev => ({ ...prev, [name]: formatted }));
    } else {
      setPayment(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!address.street || !address.city || !address.postalCode) {
      setError("Please fill in all address fields");
      return;
    }
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!isCartLoaded || cart.length === 0) {
        setError("Your cart is empty. Please add items before checking out.");
        setIsLoading(false);
        return;
      }

      const cardNumber = payment.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cardNumber)) throw new Error("Invalid card number");
      if (!payment.cardHolder.trim()) throw new Error("Card holder name required");
      if (!payment.expiryMonth || !payment.expiryYear) throw new Error("Expiry date required");
      if (!payment.cvv || payment.cvv.length !== 3) throw new Error("Invalid CVV");

      // Pass total to register correctly in pgAdmin4
      const result = await createOrder(address, payment, cart);

      if (result.success) {
        setOrderId(result.orderId!);
        setCurrentStep("confirmation");
        clearCart();
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "An error occurred during payment");
    } finally {
      setIsLoading(false);
    }
  }; // <--- Corrected: The extra brace below this was removed

  const handleContinueShopping = () => router.push("/");
  const handleViewOrder = () => orderId && router.push(`/orders?order=${orderId}`);

  // --- Render Steps ---
  if (currentStep === "address") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Shipping Address</h1>
        <p className="text-gray-600 mb-6">Step 1 of 3</p>
        {error && <p className="text-red-700 mb-4">{error}</p>}
        <form onSubmit={handleAddressSubmit} className="bg-white p-6 rounded-lg shadow-md grid gap-4">
          {["street", "city", "postalCode", "country"].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
              <input type="text" name={field} value={(address as any)[field]} onChange={handleAddressChange} className="w-full p-3 border rounded-lg" required />
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Continue to Payment</button>
        </form>
      </div>
    );
  }

  if (currentStep === "payment") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Payment Method</h1>
        <p className="text-gray-600 mb-6">Step 2 of 3</p>
        {error && <p className="text-red-700 mb-4">{error}</p>}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between"><span>Subtotal:</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping:</span><span>${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (25%):</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t font-bold text-lg"><span>Total:</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="grid gap-4">
            {["cardNumber", "cardHolder", "expiryMonth", "expiryYear", "cvv"].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={(payment as any)[field]}
                  onChange={handlePaymentChange}
                  className="w-full p-3 border rounded-lg"
                  maxLength={field === "cvv" ? 3 : field.includes("Year") ? 2 : 19}
                  placeholder={field === "cardNumber" ? "1234 5678 9012 3456" : ""}
                  required
                />
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <button type="button" onClick={() => setCurrentStep("address")} className="px-6 py-3 border rounded-lg">Back</button>
              <button type="submit" disabled={isLoading || !isCartLoaded || cart.length === 0} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                {isLoading ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Confirmation Step
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase</p>
        <p className="font-mono font-bold text-lg mb-6">{orderId}</p>
        <div className="flex gap-4 justify-center">
          <button onClick={handleContinueShopping} className="px-6 py-3 border rounded-lg">Continue Shopping</button>
          <button onClick={handleViewOrder} className="px-6 py-3 bg-blue-600 text-white rounded-lg">View Order Details</button>
        </div>
      </div>
    </div>
  );
}
