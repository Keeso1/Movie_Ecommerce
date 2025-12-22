import prisma from "@/lib/prisma"

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { movie: true } },
      address: true,
    },
  })

  if (!order) return <p>Order not found</p>

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-green-600">
        Order Confirmed 
      </h1>

      <p>Order ID: {order.id}</p>

      <h2 className="font-semibold mt-4">Shipping Address</h2>
      <p>
        {order.address?.fullName}<br />
        {order.address?.street}<br />
        {order.address?.city}, {order.address?.country}{" "}
        {order.address?.zip}
      </p>

      <h2 className="font-semibold mt-4">Items</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.movie.title} × {item.quantity}
          </li>
        ))}
      </ul>

      <p className="font-bold mt-4">
        Total Paid: ${order.total.toFixed(2)}
      </p>
    </div>
  )
}
