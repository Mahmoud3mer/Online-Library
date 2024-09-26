import { useEffect, useState, useCallback } from "react";
import { fetchAllOrders } from "../../components/fetchOrder";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { CubeIcon } from "@heroicons/react/solid";

interface OrderItem {
  coverImage: string;
  quantity: number;
  title: string;
}

interface Order {
  userId: string;
  totalPrice: number;
  orderDate: string;
  orderId: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  name?: string; // Optional fields
  phone?: string;
  email?: string;
  items: OrderItem[];
}

const AllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchOrderId, setSearchOrderId] = useState(""); // New state for order ID search

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchAllOrders(1, 1000);
        setAllOrders(data.data);
        setTotalPages(Math.ceil(data.metaData.totalCount / limit));
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Error fetching orders");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [limit]);

  const filterOrders = useCallback(() => {
    let filtered = allOrders;

    if (activeTab === "Pending") {
      filtered = filtered.filter((order) => order.paymentStatus === "Pending");
    } else if (activeTab === "Completed") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === "Completed"
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.orderDate) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.orderDate) <= new Date(endDate)
      );
    }

    // Filter by user ID
    if (searchUserId) {
      filtered = filtered.filter((order) =>
        order.userId.includes(searchUserId)
      );
    }

    // Filter by order ID
    if (searchOrderId) {
      filtered = filtered.filter((order) =>
        order.orderId.includes(searchOrderId)
      );
    }

    return filtered;
  }, [allOrders, activeTab, startDate, endDate, searchUserId, searchOrderId]);

  useEffect(() => {
    const filteredOrders = filterOrders();
    const startIndex = (page - 1) * limit;
    setOrders(filteredOrders.slice(startIndex, startIndex + limit));
    setTotalPages(Math.ceil(filteredOrders.length / limit));
  }, [page, limit, filterOrders]); // Add filterOrders as a dependency

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalOrders = allOrders.length;
  const activeOrdersCount = allOrders.filter(
    (order) => order.paymentStatus === "Pending"
  ).length;
  const completedOrdersCount = allOrders.filter(
    (order) => order.paymentStatus === "Completed"
  ).length;

  const filteredOrdersCount = filterOrders().length; // Count of filtered orders

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Order History</h1>

      {/* Date Range Filter and Search Bars */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Order Date:
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md p-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md p-2"
              />
            </div>
          </div>
        </div>
        {/* Search Bar for User ID */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Search by User ID:
          </label>
          <input
            type="text"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="border rounded-md p-2"
            placeholder="Enter User ID"
          />
        </div>
        {/* New Search Bar for Order ID */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Search by Order ID:
          </label>
          <input
            type="text"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="border rounded-md p-2"
            placeholder="Enter Order ID"
          />
        </div>
      </div>

      {/* Display Found Orders Message */}
      {filteredOrdersCount > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Found <span className="font-bold text-xl">{filteredOrdersCount}</span>{" "}
          order(s).
        </div>
      )}

      {/* Boxes with Order Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Total Orders */}
        <div
          className={`p-4 border rounded-lg flex items-center cursor-pointer ${
            activeTab === "All Orders"
              ? "bg-blue-100 border-blue-500"
              : "border-gray-300"
          }`}
          onClick={() => {
            setActiveTab("All Orders");
            setStartDate("");
            setEndDate("");
            setSearchUserId("");
            setSearchOrderId(""); // Reset order ID search
          }}
        >
          <CubeIcon className="h-6 w-6 text-blue-600 mr-2" />
          <div>
            <p className="text-lg font-medium">{totalOrders}</p>
            <p className="text-sm">Total Orders</p>
          </div>
        </div>

        {/* Active Orders */}
        <div
          className={`p-4 border rounded-lg flex items-center cursor-pointer ${
            activeTab === "Pending"
              ? "bg-green-100 border-green-500"
              : "border-gray-300"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          <CubeIcon className="h-6 w-6 text-green-500 mr-2" />
          <div>
            <p className="text-lg font-medium">{activeOrdersCount}</p>
            <p className="text-sm">Active Orders</p>
          </div>
        </div>

        {/* Completed Orders */}
        <div
          className={`p-4 border rounded-lg flex items-center cursor-pointer ${
            activeTab === "Completed"
              ? "bg-yellow-100 border-yellow-500"
              : "border-gray-300"
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          <CubeIcon className="h-6 w-6 text-yellow-500 mr-2" />
          <div>
            <p className="text-lg font-medium">{completedOrdersCount}</p>
            <p className="text-sm">Completed Orders</p>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-lg"
          >
            {/* Order Details */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div>
                  Order ID:{" "}
                  <span className="font-semibold">#{order.orderId}</span>
                </div>
                <div className="text-gray-500">
                  Order Date:{" "}
                  <span className="font-semibold">
                    {new Date(order.orderDate).toLocaleString()}
                  </span>
                </div>

                <div className="text-gray-500">
                  Shipping Address:{" "}
                  <span className="font-semibold">{order.shippingAddress}</span>
                </div>

                {/* Payment Method and Status */}
                <div className="mt-2">
                  <div className="text-gray-500">
                    Payment Method:{" "}
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </div>
                  <div
                    className={`rounded-full ${
                      order.paymentStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.paymentStatus === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "text-gray-500"
                    }`}
                  >
                    Payment Status:{" "}
                    <span className="font-semibold">{order.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex flex-col items-end">
                <div className="text-gray-500">
                  <span className="font-semibold">{order.userId}</span> : User
                  ID
                </div>

                <div className="text-gray-500">
                  {order.name && (
                    <span className="font-semibold">{order.name}</span>
                  )}{" "}
                  : Name
                </div>
                <div className="text-gray-500">
                  {order.email && (
                    <span className="font-semibold">{order.email}</span>
                  )}{" "}
                  : Email
                </div>
                <div className="text-gray-500">
                  {order.phone && (
                    <span className="font-semibold">{order.phone}</span>
                  )}{" "}
                  : Phone
                </div>
                <div className="font-bold text-lg mt-1">
                  <span className="text-green-700 text-xl">
                    ${order.totalPrice.toFixed(2)}
                  </span>{" "}
                  : Total
                </div>
              </div>
            </div>

            {/* Horizontal Line */}
            <hr className="my-4 border-t border-gray-300 opacity-50" />

            {/* Items Row under Order Details */}
            <div className="mt-4">
              <div className="flex flex-wrap justify-center -mx-1">
                {order.items.map((item) => (
                  <div
                    key={item.title}
                    className="w-1/3 px-1 mb-2 flex items-center"
                  >
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg mr-2"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-gray-500">
                        (qty: {item.quantity})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllOrders;
