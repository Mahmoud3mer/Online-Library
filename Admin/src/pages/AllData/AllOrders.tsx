import { useEffect, useState, useCallback, useRef } from "react";
import { fetchAllOrders } from "../../components/fetchOrder";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { CubeIcon } from "@heroicons/react/solid";
import { apiUrl } from "../../utils/apiUrl";
import Swal from "sweetalert2";
import { io, Socket } from "socket.io-client";
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
  const [searchOrderId, setSearchOrderId] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState({
    shippingAddress: "",
    paymentStatus: "",
    name: "",
    phone: "",
    email: "",
    totalPrice: "",
  });

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

    if (searchUserId) {
      filtered = filtered.filter((order) =>
        order.userId.includes(searchUserId)
      );
    }

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
  }, [page, limit, filterOrders]);

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

  const filteredOrdersCount = filterOrders().length;

  const element = document.getElementById("edit-form");
  const editOrder = (order: Order) => {
    element?.scrollIntoView({ behavior: "smooth" });
    setEditingOrder(order);
  };

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(`${apiUrl}`);

    return () => {
      socketRef.current?.disconnect(); // Ensure to disconnect on cleanup
    };
  }, []);

  const updateOrder = async () => {
    if (!editingOrder) return;
    if (!validate()) return;
    try {
      const response = await axios.patch(
        `${apiUrl}/orders/${editingOrder.orderId}`,
        editingOrder
      );
      const updatedOrder = response.data.updatedOrder;

      socketRef.current?.emit("paymentStatusChanged", updatedOrder);
      console.log("Order status changed emitted:", updatedOrder);
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        )
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        )
      );
      setEditingOrder(null);
      Swal.fire("Success", "Order updated successfully!", "success");
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to update order", "error");
    }
  };
  const deleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`${apiUrl}/orders/${orderId}`);
      setAllOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );

      // Show success message using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Order Deleted!",
        text: "Order deleted successfully.",
        showConfirmButton: true,
        timer: 2000,
      });
    } catch (err) {
      console.log(err);
      // Show error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error deleting order.",
        showConfirmButton: true,
        timer: 2000,
      });
    }
  };
  const validate = () => {
    const newErrors = {
      shippingAddress: "",
      paymentStatus: "",
      name: "",
      phone: "",
      email: "",
      totalPrice: "",
    };
    let isValid = true;

    if (editingOrder?.shippingAddress === "") {
      newErrors.shippingAddress = "Shipping address is required.";
      isValid = false;
    }
    if (editingOrder?.name === "") {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (editingOrder?.phone && !/^01\d{9}$/.test(editingOrder.phone)) {
      newErrors.phone = "Enter a correct phone number";
      isValid = false;
    }
    if (editingOrder?.email && !/\S+@\S+\.\S+/.test(editingOrder.email)) {
      newErrors.email = "Email is invalid.";
      isValid = false;
    }
    if ((editingOrder?.totalPrice ?? 0) <= 0) {
      newErrors.totalPrice = "Total price must be greater than zero.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {editingOrder && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4" id="edit-form">
          <h2 className="text-xl font-semibold mb-4">
            Edit Order #{editingOrder.orderId}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipping Address */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Shipping Address
              </label>
              <input
                type="text"
                value={editingOrder.shippingAddress}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    shippingAddress: e.target.value,
                  })
                }
                className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.shippingAddress
                    ? "border-meta-1 text-danger"
                    : "focus:ring-primary"
                }`}
              />
              {errors.shippingAddress && (
                <p className="text-meta-border-meta-1 text-danger text-sm">
                  {errors.shippingAddress}
                </p>
              )}
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Status
              </label>
              <select
                value={editingOrder.paymentStatus}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    paymentStatus: e.target.value,
                  })
                }
                className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.paymentStatus
                    ? "border-meta-1 text-danger"
                    : "focus:ring-primary"
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.paymentStatus && (
                <p className="text-meta-border-meta-1 text-danger text-sm">
                  {errors.paymentStatus}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={editingOrder.name || ""}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    name: e.target.value,
                  })
                }
                className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.name
                    ? "border-meta-1 text-danger"
                    : "focus:ring-primary"
                }`}
              />
              {errors.name && (
                <p className="text-meta-border-meta-1 text-danger text-sm">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={editingOrder.phone || ""}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    phone: e.target.value,
                  })
                }
                className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.phone
                    ? "border-meta-1 text-danger"
                    : "focus:ring-primary"
                }`}
              />
              {errors.phone && (
                <p className="text-meta-border-meta-1 text-danger text-sm">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={editingOrder.email || ""}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    email: e.target.value,
                  })
                }
                className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.email
                    ? "border-meta-1 text-danger"
                    : "focus:ring-primary"
                }`}
              />
              {errors.email && (
                <p className="text-meta-border-meta-1 text-danger text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Total Price */}
            {/* Total Price */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Price
              </label>
              <input
                type="number"
                value={(editingOrder.totalPrice || 0).toFixed(2)} // Use a default value of 0
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    totalPrice: parseFloat(e.target.value) || 0, // Ensure it's a number
                  })
                }
                className={`border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.totalPrice
                    ? "border-meta-1 text-danger"
                    : "focus:ring-primary"
                }`}
              />
              {errors.totalPrice && (
                <p className="text-meta-border-meta-1 text-danger text-sm">
                  {errors.totalPrice}
                </p>
              )}
            </div>
          </div>

          <button
            className="btn glass w-full bg-warning hover:bg-meta-11 hover:text-white transition duration-200 mt-3"
            onClick={updateOrder}
          >
            Update Order
          </button>
        </div>
      )}

      <h1 className="text-title-xl font-semibold mb-6">Order History</h1>

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

      {filteredOrdersCount > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Found <span className="font-bold text-xl">{filteredOrdersCount}</span>{" "}
          order(s).
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 border rounded-lg flex items-center cursor-pointer ${
            activeTab === "All Orders"
              ? "bg-primary border-gray-4 text-white"
              : "border-gray-300"
          }`}
          onClick={() => {
            setActiveTab("All Orders");
            setStartDate("");
            setEndDate("");
            setSearchUserId("");
            setSearchOrderId("");
          }}
        >
          <CubeIcon
            className={`${
              activeTab === "All Orders"
                ? "h-6 w-6 text-white  mr-2"
                : "h-6 w-6 text-primary mr-2"
            }`}
          />
          <div>
            <p className="text-lg font-medium">{totalOrders}</p>
            <p className="text-sm">Total Orders</p>
          </div>
        </div>

        <div
          className={`p-4 border rounded-lg flex items-center cursor-pointer ${
            activeTab === "Pending"
              ? "bg-warning border-warning text-white"
              : "border-gray-300"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          <CubeIcon
            className={`${
              activeTab === "Pending"
                ? "h-6 w-6 text-white mr-2"
                : "h-6 w-6 text-warning mr-2"
            }`}
          />
          <div>
            <p className="text-lg font-medium">{activeOrdersCount}</p>
            <p className="text-sm">Active Orders</p>
          </div>
        </div>

        <div
          className={`p-4 border rounded-lg flex items-center cursor-pointer ${
            activeTab === "Completed"
              ? "bg-success border-success text-white"
              : "border-gray-300"
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          <CubeIcon
            className={`${
              activeTab === "Completed"
                ? "h-6 w-6 text-white mr-2"
                : "h-6 w-6 text-success mr-2"
            }`}
          />
          <div>
            <p className="text-lg font-medium">{completedOrdersCount}</p>
            <p className="text-sm">Completed Orders</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="space-y-4">
          {filteredOrdersCount === 0 ? (
            <div className="flex items-start justify-center h-screen">
              <div className="text-center bg-gray-200 p-6 rounded-lg shadow-lg">
                <h2 className="text-title-xl font-semibold text-gray-800 mb-4">
                  No Orders Found
                </h2>
                <p className="text-gray-600">
                  Please check back later or try a different search.
                </p>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white p-3 max-w-4xl rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-meta-9 hover:shadow-lg"
              >
                <div className="flex justify-between items-start flex-col sm:flex-row">
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
                      <span className="font-semibold">
                        {order.shippingAddress}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-gray-500">
                        Payment Method:{" "}
                        <span className="font-semibold">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="mt-1">
                        Payment Status:
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-white font-semibold ${
                            order.paymentStatus === "Pending"
                              ? "bg-warning border border-warning-dark"
                              : order.paymentStatus === "Completed"
                              ? "bg-success border border-success-dark"
                              : "bg-gray border border-graydark"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end mt-4 sm:mt-0">
                    <div className="text-gray-500">
                      <span className="font-semibold">{order.userId}</span> :
                      User ID
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
                      <span className="text-success text-xl">
                        ${order.totalPrice.toFixed(2)}
                      </span>{" "}
                      : Total
                    </div>
                  </div>
                </div>

                <hr className="my-4 border-t border-gray-300 opacity-50" />

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

                {/* Delete & Update Buttons */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => deleteOrder(order.orderId)}
                    className="bg-meta-88 btn glass hover:bg-meta-808 hover:text-white"
                  >
                    Delete Order
                  </button>

                  <button
                    className="btn glass ml-2 bg-meta-99 hover:bg-meta-909 hover:text-white"
                    onClick={() => editOrder(order)}
                  >
                    Update Order
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AllOrders;
