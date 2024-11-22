import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const localStorageUserKey = "loggedBloglistUser";

const initialState = {
  current: null,
  all: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrent(state, action) {
      return { ...state, current: action.payload };
    },
    clearCurrent(state, action) {
      return { ...state, current: null };
    },
  },
});

const { setCurrent, clearCurrent } = userSlice.actions;

export const initializeCurrentUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem(localStorageUserKey);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch(setCurrent(user));
    }
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

export default userSlice.reducer;
