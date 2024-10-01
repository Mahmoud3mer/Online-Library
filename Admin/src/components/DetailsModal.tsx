import React from "react";
import { Order } from "../interfaces/OrderInterface";

interface DetailsModalProps {
  onClose: () => void;
  isOpen: boolean;
  order: Order | null;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  onClose,
  isOpen,
  order,
}) => {
  if (!order) return null; // Handle the case where order is null

  return (
    <dialog
      className={`modal ${
        isOpen ? "modal-open" : ""
      } transition-transform duration-300 ease-in-out backdrop-blur-md  z-999999`}
      onClick={onClose}
    >
      <div
        className="modal-box max-w-203 rounded-lg shadow-lg bg-white dark:bg-graydark p-6 transition-all duration-300 transform scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-center">Order Details</h2>
        <div className="mt-4">
          <div>
            <strong>Order ID:</strong> {order.orderId}
          </div>
          <div>
            <strong>Shipping Address:</strong> {order.shippingAddress}
          </div>
          {order.name && (
            <div>
              <strong>Name:</strong> {order.name}
            </div>
          )}
          {order.phone && (
            <div>
              <strong>Phone:</strong> {order.phone}
            </div>
          )}
          <div className="mt-2">
            <strong>Total Price:</strong>{" "}
            <span className="text-meta-3 font-bold text-xl">
              {order.totalPrice.toFixed(2)}
            </span>{" "}
            <small className="text-meta-3 font-bold ">EGP</small>
          </div>
        </div>
        <div className="mt-4">
          <strong>Items:</strong>
          <div className="flex flex-wrap justify-center mt-2">
            {order.items.map((item) => (
              <div
                key={item.title}
                className="w-full sm:w-1/3 md:w-1/4 p-2 flex flex-col items-center mb-4 transition-transform duration-300 transform hover:scale-105"
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg shadow-md mb-2"
                />
                <div className="text-center">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-gray-500">(qty: {item.quantity})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-action flex justify-center mt-4">
          <button
            className="btn btn-primary bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 transition duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DetailsModal;
