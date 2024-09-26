import React from 'react';

interface AlertModalProps {
  onClose: () => void;
  isOpen: boolean;
  title?: string; // Optional title prop
  message?: string; // Optional message prop
}

const AlertModal: React.FC<AlertModalProps> = ({
  onClose,
  isOpen,
  title = 'Success!',
  message = 'Action completed successfully!',
}) => {
  return (
    <dialog
      className={`modal ${isOpen ? 'modal-open' : ''} transition-transform duration-300 ease-in-out backdrop-blur-md`}
      onClick={onClose}
    >
      <div
        className="modal-box rounded-lg shadow-lg bg-white dark:bg-graydark p-6 transition-all duration-300 transform scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg text-center text-green-600 dark:text-green-400">{title}</h3>
        <p className="py-4 text-center text-gray-700 dark:text-gray-300">{message}</p>
        <div className="modal-action flex justify-center">
          <button className="btn btn-primary bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 transition duration-200 dark:bg-green-600 dark:hover:bg-green-700" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AlertModal;
