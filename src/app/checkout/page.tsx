"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type PaymentMethod = "credit-card" | "paypal" | "apple-pay";

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "address" | "payment" | "confirmation"
  >("address");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Greece",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit-card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAddress = (): boolean => {
    return Object.values(address).every((field) => field.trim() !== "");
  };

  const validatePayment = (): boolean => {
    if (paymentMethod === "credit-card") {
      return (
        cardDetails.cardNumber.replace(/\s/g, "").length === 16 &&
        cardDetails.expiry.length === 5 &&
        cardDetails.cvv.length === 3 &&
        cardDetails.nameOnCard.trim() !== ""
      );
    }
    return true;
  };

  const simulatePayment = async (): Promise<boolean> => {
    // Fake payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate 90% success rate
    return Math.random() > 0.1;
  };

  const generateOrderId = (): string => {
    return (
      "ORD-" +
      Date.now().toString().slice(-8) +
      Math.random().toString(36).substr(2, 4).toUpperCase()
    );
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep("payment");
    } else {
      alert("Please fill in all address fields");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePayment()) {
      alert("Please provide valid payment details");
      return;
    }

    setIsLoading(true);

    try {
      const paymentSuccess = await simulatePayment();

      if (paymentSuccess) {
        const newOrderId = generateOrderId();
        setOrderId(newOrderId);

        // In a real app, you would save to database here
        const orderData = {
          orderId: newOrderId,
          address,
          paymentMethod,
          cardDetails:
            paymentMethod === "credit-card"
              ? {
                  ...cardDetails,
                  cardNumber:
                    "**** **** **** " + cardDetails.cardNumber.slice(-4),
                }
              : null,
          items: [], // Add your cart items here
          total: 0, // Add your total here
          timestamp: new Date().toISOString(),
        };

        console.log("Order created:", orderData);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setCurrentStep("confirmation");
      } else {
        alert(
          "Payment failed. Please try again or use a different payment method."
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment processing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/order/${orderId}`);
    }
  };

  // Render Address Step
  if (currentStep === "address") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shipping Address</h1>
          <p className="text-gray-600">Step 1 of 3</p>
        </div>

        <form
          onSubmit={handleAddressSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Movie St"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Athens"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Athens"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={address.zipCode}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="United States"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Render Payment Step
  if (currentStep === "payment") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Method</h1>
          <p className="text-gray-600">Step 2 of 3</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Select Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {(["credit-card", "paypal", "apple-pay"] as PaymentMethod[]).map(
                (method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      paymentMethod === method
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium capitalize">
                      {method === "credit-card"
                        ? "Credit Card"
                        : method === "paypal"
                        ? "PayPal"
                        : "Apple Pay"}
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {paymentMethod === "credit-card" && (
            <form onSubmit={handlePaymentSubmit} className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Card Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={cardDetails.nameOnCard}
                    onChange={handleCardChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep("address")}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Complete Order"}
                </button>
              </div>
            </form>
          )}

          {paymentMethod !== "credit-card" && (
            <div>
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  {paymentMethod === "paypal"
                    ? "You will be redirected to PayPal to complete your payment."
                    : "You will be redirected to Apple Pay to complete your payment."}
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep("address")}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Processing..."
                    : `Pay with ${
                        paymentMethod === "paypal" ? "PayPal" : "Apple Pay"
                      }`}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> This is a simulation. No real payments will
              be processed. Use any test data for card details (e.g., 4242 4242
              4242 4242 for card number).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render Confirmation Step
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase</p>

          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg mb-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-bold text-lg">{orderId}</p>
          </div>
        </div>

        <div className="mb-8 max-w-md mx-auto text-left">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping to:</span>
              <span className="font-medium">
                {address.street}, {address.city}, {address.state}{" "}
                {address.zipCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment method:</span>
              <span className="font-medium capitalize">
                {paymentMethod === "credit-card"
                  ? "Credit Card"
                  : paymentMethod === "paypal"
                  ? "PayPal"
                  : "Apple Pay"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order date:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Estimated delivery:</span>
              <span className="font-medium">
                {new Date(
                  Date.now() + 5 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinueShopping}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>

          <button
            onClick={handleViewOrder}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Order Details
          </button>
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your email address. You can
            track your order using the Order ID above.
          </p>
        </div>
      </div>
    </div>
  );
}
