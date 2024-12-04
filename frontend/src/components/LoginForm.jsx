import { useState } from "react";
import loginService from "../services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducers/userReducer.js";
import { showBriefNotification } from "../reducers/notificationReducer.js";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const user = useSelector((state) => state.users.current);
  if (user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.login(username, password);
      dispatch(setCurrentUser(response));
      setUsername("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      dispatch(
        showBriefNotification({
          message: error.response.data.error,
          isError: true,
        }),
      );
    }
  };

  return (
    <div className="py-6 px-6 mx-auto rounded-lg sm:max-w-80 sm:shadow-sm sm:border sm:border-gray-300">
      <h2 className="font-bold text-2xl text-sky-600">login to BlogApp</h2>
      <form onSubmit={onSubmit}>
        <div className="mt-4 flex flex-col">
          <input
            className="p-2 rounded bg-white border border-gray-700 focus:outline-sky-500"
            data-testid="username"
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="mt-4 p-2 rounded bg-white border border-gray-700 focus:outline-sky-500"
            name="password"
            data-testid="password"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="mt-6 p-2 bg-sky-500 text-lg text-white font-semibold rounded hover:bg-sky-400 focus:outline-sky-800"
          >
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
