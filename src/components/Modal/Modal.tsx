import React, {
  FC,
  useState,
  useEffect,
  MouseEvent,
  KeyboardEvent,
} from "react";
import ReactModal from "react-modal";

const customStyles = {
  overlay: {
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
}
export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  useEffect(() => {
    setModalIsOpen(isOpen);
  }, [isOpen]);

  const handleCloseModal = (event: MouseEvent | KeyboardEvent) => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {children}
    </ReactModal>
  );
};
