// src/app/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserOrders } from "@/actions/checkout-actions";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: string;
  movie: {
    title: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userOrders = await getUserOrders();
      setOrders(userOrders as any);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-gray-500">
            You haven't placed any orders yet.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <div className="text-xl font-bold">
                    ${Number(order.totalAmount).toFixed(2)}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Shipping Address
                </h3>
                <p className="text-gray-600">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>

              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b border-gray-100"
                  >
                    <div className="flex items-center">
                      {item.movie.imageUrl && (
                        <img
                          src={item.movie.imageUrl}
                          alt={item.movie.title}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {item.movie.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${Number(item.priceAtPurchase).toFixed(2)} each
                      </p>
                      <p className="font-bold">
                        $
                        {(Number(item.priceAtPurchase) * item.quantity).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
