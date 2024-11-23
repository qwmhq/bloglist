import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Notification from "./Notification";
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
    <>
      <Header />
      <Notification />
      <h2>blogs</h2>
      <Outlet />
    </>
  );
};

export default Layout;
