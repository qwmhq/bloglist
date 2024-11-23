import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeCurrentUser } from "./reducers/userReducer";
import { Routes, Route } from "react-router-dom";

import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import BlogView from "./components/BlogView";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import User from "./components/User";
import Users from "./components/Users";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    dispatch(initializeCurrentUser());
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BlogList />} />
        <Route path="/create" element={<BlogForm />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Route>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default App;
