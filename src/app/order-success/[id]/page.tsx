import prisma from "@/lib/prisma"

export default async function OrderSuccessPage({
  params,
}: {
  params: { id?: string }
}) {
  // ✅ Guard against missing param
  if (!params?.id) {
    return <p>Invalid order ID</p>
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: { movie: true },
      },
      shippingAddress: true,
    },
  })

  if (!order) return <p>Order not found</p>

  const total = order.items.reduce((sum, item) => {
    const price = item.movie?.price ?? 0
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-green-600">
        Order Confirmed
      </h1>

      <p>Order ID: {order.id}</p>

      <h2 className="font-semibold mt-4">Shipping Address</h2>
      <p>
        {order.shippingAddress?.street}<br />
        {order.shippingAddress?.city},{" "}
        {order.shippingAddress?.country}{" "}
        {order.shippingAddress?.postalCode}
      </p>

      <h2 className="font-semibold mt-4">Items</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.movie?.title ?? "Unknown movie"} × {item.quantity}
          </li>
        ))}
      </ul>

      <p className="font-bold mt-4">
        Total Paid: ${total.toFixed(2)}
      </p>
    </div>
  )
}
