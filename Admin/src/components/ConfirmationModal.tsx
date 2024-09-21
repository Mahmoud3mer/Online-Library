import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="modal modal-open">
        <div className="modal-box dark:bg-black">
          <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
          <p className="mb-4">{message}</p>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className="btn btn-error"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
