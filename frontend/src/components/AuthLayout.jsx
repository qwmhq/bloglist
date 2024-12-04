import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="pt-16">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
