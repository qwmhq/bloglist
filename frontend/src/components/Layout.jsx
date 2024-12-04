import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.users.current);
  const userInitialized = useSelector((state) => state.users.initialized);

  const location = useLocation();

  if (!userInitialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="text-gray-900">
      <Header />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
