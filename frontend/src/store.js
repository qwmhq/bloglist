import { configureStore } from "@reduxjs/toolkit";
import blogFormReducer from "./reducers/blogFormReducer";
import blogReducer from "./reducers/blogReducer";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    users: userReducer,
    blogForm: blogFormReducer,
  },
});

export default store;
