import React from "react";

interface ModalProps {
  id: string;
  title: string;
  content: React.ReactNode;
  onCloseText?: string;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ id, title, content, onCloseText = "Close", onClose }) => (
  <div id={id} className="modal">
    <div className="modal-header">
      <h2>{title}</h2>
      {onClose && (
        <button onClick={onClose} className="modal-close-btn">
          {onCloseText}
        </button>
      )}
    </div>
    <div className="modal-content">{content}</div>
  </div>
);

export default Modal;