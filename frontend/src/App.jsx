import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeCurrentUser } from "./reducers/userReducer";
import { Routes, Route } from "react-router-dom";

import BlogList from "./components/BlogList";
import BlogView from "./components/BlogView";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import User from "./components/User";
import Users from "./components/Users";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    dispatch(initializeCurrentUser());
  }, []);

  return (
    <div>
      <Notification />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<BlogList />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
