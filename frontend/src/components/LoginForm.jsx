import { useState } from "react";
import loginService from "../services/login.js";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducers/userReducer.js";
import { showBriefNotification } from "../reducers/notificationReducer.js";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.login(username, password);
      dispatch(setCurrentUser(response));
      setUsername("");
      setPassword("");
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
    <div>
      <h2>log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          username:{" "}
          <input
            data-testid="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password:{" "}
          <input
            data-testid="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default LoginForm;
