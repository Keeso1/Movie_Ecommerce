import { getOrderById } from "@/actions/order-actions";
import Link from "next/link";
import Image from "next/image";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Use your existing getOrderById function
  const order = await getOrderById(id);

  if (!order) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-gray-600 mt-2">Order #{order.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Order Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-2xl font-bold">${(order.total || order.totalAmount || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="relative w-20 h-28 shrink-0">
                    {item.movie?.imageUrl ? (
                      <Image
                        src={item.movie.imageUrl}
                        alt={item.movie.title}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.movie?.title || 'Unknown Movie'}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Movie ID: {item.movie?.id}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${((item.quantity || 1) * (item.price || item.priceAtPurchase || 0)).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>Price: ${(item.price || item.priceAtPurchase || 0).toFixed(2)} each</p>
                    </div>
                    {item.movie?.id && (
                      <Link
                        href={`/movies/${item.movie.id}`}
                        className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Movie Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in this order.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>
                ${order.items?.reduce((sum: number, item: any) => 
                  sum + ((item.quantity || 1) * (item.price || item.priceAtPurchase || 0)), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${(order.total || order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* User Information (if available) */}
        {order.user && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Customer Details</h3>
                <p className="text-gray-600">
                  {order.user.name || 'Unknown Name'}<br />
                  {order.user.email || 'No email'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Order Information</h3>
                <p className="text-gray-600">
                  Order ID: {order.id}<br />
                  Created: {new Date(order.createdAt).toLocaleDateString()}<br />
                  Status: {order.status || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Print Order Details
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to All Orders
        </Link>
      </div>
    </div>
  );
}