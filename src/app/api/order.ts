// pages/api/orders.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Adjust the import based on your project structure
import { Prisma } from "@prisma/client"; // You need to type your data correctly

type OrderRequestBody = {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: "credit-card" | "paypal" | "apple-pay";
  cardDetails: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
  } | null;
  items: Array<{ id: string; quantity: number; price: number }>;
  total: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { address, paymentMethod, cardDetails, items, total }: OrderRequestBody =
        req.body;

      // Save the shipping address to the database
      const shippingAddress = await prisma.address.create({
        data: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.zipCode,
          country: address.country,
        },
      });

      // Create the order
      const order = await prisma.order.create({
        data: {
          status: "PAID",
          shippingAddressId: shippingAddress.id,
          items: {
            create: items.map((item) => ({
              movie: { connect: { id: item.id } },
              priceAtPurchase: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      return res.status(200).json({ orderId: order.id });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
