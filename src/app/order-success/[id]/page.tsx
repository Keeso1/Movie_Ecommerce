'use server'

import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface OrderSuccessPageProps {
  params: { id: string }
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  // ✅ Guard against missing or empty param
  const orderId = params?.id?.trim()
  if (!orderId) {
    return <p>Invalid order ID</p>
  }

  // ✅ Support numeric or string IDs
  const where = /^\d+$/.test(orderId)
    ? { id: parseInt(orderId, 10) }
    : { id: orderId } as Prisma.OrderWhereUniqueInput

  // ✅ Fetch order from Prisma
  const order = await prisma.order.findUnique({
    where,
    include: {
      items: { include: { movie: true } },
      shippingAddress: true,
    },
  })

  if (!order) return <p>Order not found</p>

  // ✅ Calculate total safely
  const total = order.items?.reduce(
    (sum, item) => sum + (item.movie?.price ?? 0) * item.quantity,
    0
  ) ?? 0

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-green-600">Order Confirmed</h1>

      <p>Order ID: {order.id}</p>

      <h2 className="font-semibold mt-4">Shipping Address</h2>
      <p>
        {order.shippingAddress?.fullName}<br />
        {order.shippingAddress?.street}<br />
        {order.shippingAddress?.city}, {order.shippingAddress?.country}{" "}
        {order.shippingAddress?.postalCode}
      </p>

      <h2 className="font-semibold mt-4">Items</h2>
      <ul>
        {order.items?.map((item) => (
          <li key={item.id}>
            {item.movie?.title ?? 'Unknown movie'} × {item.quantity}
          </li>
        ))}
      </ul>

      <p className="font-bold mt-4">Total Paid: ${total.toFixed(2)}</p>
    </div>
  )
}
