const Modal = ({visible, onClose, children }) => {

  const handleClose = (e) => {
    if (e.target.id === "wrapper") {
      onClose();
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center" id="wrapper" onClick={handleClose}>
      <div className="w-4/5 flex flex-col sm:max-w-96">
        <button
          type="button"
          className="self-end text-gray-300 hover:text-white focus:text-white focus:outline-none"
          onClick={() => onClose()}
        >
          <svg className="h-6 w-6 self-end fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
            />
          </svg>
        </button>
        <div className="bg-white rounded-lg">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
