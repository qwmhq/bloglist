import { useSelector } from "react-redux";

const Notification = () => {
  const { message, isError } = useSelector((state) => state.notification);

  if (message === null) {
    return null;
  }

  return (
    <div
      className={`z-20 fixed right-4 bottom-8 max-w-64 sm:max-w-96 p-4 rounded-lg shadow border-2 bg-gray-50 text-xl font-medium ${isError ? "text-red-600" : "text-green-600"}`}
    >
      {message}
    </div>
  );
};

export default Notification;
