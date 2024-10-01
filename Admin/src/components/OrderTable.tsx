import { MdDeleteForever } from "react-icons/md";
import { MdOutlineEditOff } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

type OrderTableProps = {
  orderId: string;
  email?: string;
  paymentStatus: string;
  paymentMethod: string;
  userId: string;
  viewDetails?: () => void;
  editOrder?: () => void;
  deleteOrder?: () => void;
};

const OrderTable: React.FC<OrderTableProps> = ({
  orderId,
  email,
  paymentStatus,
  paymentMethod,
  userId,
  viewDetails,
  editOrder,
  deleteOrder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    if (deleteOrder) {
      deleteOrder();
    }
    console.log("Confirmed");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log("Cancelled");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-10 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center mr-6">
          <p className="text-sm text-black dark:text-white truncate overflow-hidden">
            {orderId}
          </p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex mr-4">
          <p className="text-sm text-black dark:text-white truncate overflow-hidden">
            {email}
          </p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="text-sm text-black dark:text-white truncate overflow-hidden">
            {paymentMethod}
          </p>
        </div>
        <div className="col-span-2 flex items-center">
          <span
            className={`inline-flex items-center rounded-full px-1 py-0.5 text-xs text-white font-semibold ${
              paymentStatus === "Pending"
                ? "bg-warning border border-warning-dark"
                : paymentStatus === "Completed"
                ? "bg-success border border-success-dark"
                : "bg-gray border border-graydark"
            }`}
          >
            {paymentStatus}
          </span>
        </div>

        <div className="col-span-2 flex items-center">
          <p className="text-sm text-black dark:text-white truncate overflow-hidden">
            {userId}
          </p>
        </div>
        <div className="col-span-1 flex items-center justify-between">
          <span
            className="hover:cursor-pointer hover:bg-sky-600"
            onClick={viewDetails}
          >
            <FaEye size={20} className="hover:!text-blue-500" />
          </span>
          <span
            className="hover:cursor-pointer hover:bg-sky-600"
            onClick={editOrder}
          >
            <MdOutlineEditOff size={20} />
          </span>
          <span
            className="hover:cursor-pointer hover:bg-sky-600"
            onClick={() => setIsModalOpen(true)}
          >
            <MdDeleteForever size={20} />
          </span>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this order?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default OrderTable;
