import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import userService from "../services/users";

const localStorageUserKey = "loggedBloglistUser";

const initialState = {
  initialized: false,
  current: null,
  all: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    initializeCurrent(state, action) {
      return { ...state, initialized: true, current: action.payload };
    },
    setCurrent(state, action) {
      return { ...state, current: action.payload };
    },
    clearCurrent(state, action) {
      return { ...state, current: null };
    },
    setUsers(state, action) {
      return { ...state, all: action.payload };
    },
  },
});

const { initializeCurrent, setCurrent, clearCurrent, setUsers } =
  userSlice.actions;

export const initializeCurrentUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem(localStorageUserKey);
    const user = loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
    user && blogService.setToken(user.token);
    dispatch(initializeCurrent(user));
  };
};

export const setCurrentUser = (user) => {
  return async (dispatch) => {
    blogService.setToken(user.token);
    window.localStorage.setItem(localStorageUserKey, JSON.stringify(user));
    dispatch(setCurrent(user));
  };
};

export const clearCurrentUser = (user) => {
  return (dispatch) => {
    window.localStorage.removeItem(localStorageUserKey);
    dispatch(clearCurrent());
    blogService.clearToken();
  };
};

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch(setUsers(users));
  };
};

export default userSlice.reducer;
