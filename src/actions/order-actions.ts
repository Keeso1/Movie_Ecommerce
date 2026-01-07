"use server";

export type CheckoutInput = {
  items: {
    id: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  address: {
    fullName: string;
    street: string;
    city: string;
    country: string;
    zip: string;
  };
};

export async function createOrder(
  input: CheckoutInput
): Promise<{ orderId: string }> {
  // Example: server-side recalculation (recommended)
  const calculatedTotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (calculatedTotal !== input.total) {
    throw new Error("Total mismatch");
  }

  // TODO: Persist order to database
  const orderId = crypto.randomUUID();

  return { orderId };
}
