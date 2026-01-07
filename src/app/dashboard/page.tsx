import { getAllOrders } from "@/actions/order-actions";
import Link from "next/link";
import Image from "next/image";

// Simple function to get all orders (you'll need to create this)
async function getAllOrdersForDashboard() {
  // For now, we'll use a mock function - update with your actual data fetching
  try {
    // This should be replaced with your actual order fetching logic
    const orders = await getAllOrders(); // You'll need to create this function
    
    // If you don't have a function yet, return mock data
    return orders || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const orders = await getAllOrdersForDashboard();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order History Dashboard</h1>
        <p className="text-gray-600 mt-2">
          View all orders in the system. 
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-2xl font-bold mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl font-bold mt-1">
            ${orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Movies Sold</h3>
          <p className="text-2xl font-bold mt-1">
            {orders.reduce((sum: number, order: any) => 
              sum + (order.items?.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 1), 0) || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Avg. Order</h3>
          <p className="text-2xl font-bold mt-1">
            ${orders.length > 0 ? (orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0) / orders.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">All Orders</h2>
          <p className="text-gray-600 text-sm mt-1">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">There are no orders in the system yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user?.email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {order.items?.slice(0, 2).map((item: any) => item.movie?.title).join(', ')}
                        {order.items?.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${(order.totalAmount || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders Preview */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.slice(0, 6).map((order: any) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items?.slice(0, 2).map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-16 flex-shrink-0">
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.movie?.title}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ${(item.priceAtPurchase || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-semibold">${(order.totalAmount || 0).toFixed(2)}</span>
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link
          href="/admin/movies/people"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Movie Management
        </Link>
        <Link
          href="/admin/movies/people"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          People Management
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}