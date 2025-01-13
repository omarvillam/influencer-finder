import {ReactNode} from "react";
import {XMark} from "../../../public/icons/XMark";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="bg-black border border-solid border-gray shadow-xl rounded-lg w-full max-h-[95vh] overflow-y-auto m-2 sm:m-0 sm:w-[700px] md:w-[1000px] p-6 relative "
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray transition-3"
        >
          <XMark />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal
