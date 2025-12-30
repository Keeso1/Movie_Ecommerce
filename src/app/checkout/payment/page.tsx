"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  if (!orderId) {
    return <div>No order found.</div>;
  }

  const handlePayment = async () => {
    console.log("Proceeding to payment for order:", orderId);
  };

  return (
    <div>
      <h1>Order Placed Successfully</h1>
      <p>Order ID: {orderId}</p>

      <button onClick={handlePayment}>Välkommen Åter !</button>
    </div>
  );
}
