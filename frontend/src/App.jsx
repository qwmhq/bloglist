import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import {
  clearCurrentUser,
  initializeCurrentUser,
} from "./reducers/userReducer";

import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";


const App = () => {
  const dispatch = useDispatch();

  const noteFormRef = useRef(null);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const user = useSelector((state) => state.users.current);
  useEffect(() => {
    dispatch(initializeCurrentUser());
  }, []);

  const onLogout = () => {
    dispatch(clearCurrentUser());
  };

  return (
    <div>
      <Notification />
      {user === null ? (
        <LoginForm />
      ) : (
        <div>
          <h2>blogs</h2>
          <div>
            {user.name} logged in
            <button onClick={onLogout}>log out</button>
          </div>
          <Togglable buttonLabel="create new" ref={noteFormRef}>
            <BlogForm />
          </Togglable>
          <BlogList />
        </div>
      )}
    </div>
  );
};

export default App;
