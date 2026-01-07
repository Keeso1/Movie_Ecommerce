import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ArrowLeft,
  Truck,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type OrderItemWithMovie = {
  id: string;
  quantity: number;
  priceAtPurchase: number | string;
  movie: {
    title: string;
    // Add other movie fields if needed
  };
};

export default async function OrdersPage() {
  const session = await authClient.getSession();

  if (!session?.data?.user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-24 w-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Please Sign In
        </h1>
        <p className="text-gray-600 mb-8">
          You need to be signed in to view your orders.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          movie: true,
        },
      },
      shippingAddress: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-24 w-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-8">
          You have not placed any orders yet.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Movies
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            View your order history and track shipments
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shopping
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const orderTotal = order.items.reduce(
            (total, item) =>
              total + Number(item.priceAtPurchase) * item.quantity,
            0
          );
          const shipping = orderTotal >= 50 ? 0 : 5.99;
          const tax = orderTotal * 0.25;
          const total = orderTotal + shipping + tax;

          return (
            <Card
              key={order.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getOrderStatusColor(
                          order.status
                        )}`}
                      >
                        {getOrderStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item(s)
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-3">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item: OrderItemWithMovie) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                        >
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">🎬</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.movie.title}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × $
                              {Number(item.priceAtPurchase).toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            $
                            {(
                              Number(item.priceAtPurchase) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Shipping Address
                      </h3>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Summary
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${orderTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>
                            {shipping === 0
                              ? "FREE"
                              : `$${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-1 border-t">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/checkout?order=${order.id}`}>
                        View Order Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Showing {orders.length} most recent orders
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Orders are stored in your account and can be viewed anytime.
        </p>
      </div>
    </div>
  );
}
