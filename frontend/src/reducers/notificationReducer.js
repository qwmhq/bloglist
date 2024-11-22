import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  isError: false,
  timeoutId: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return initialState;
    },
    setTimeoutId(state, action) {
      return { ...state, timeoutId: action.payload };
    },
    clearTimeoutId(state, action) {
      clearTimeout(state.timeoutId);
      return { ...state, timeoutId: null };
    },
  },
});

export const showBriefNotification = (notification) => {
  return (dispatch) => {
    const timeoutId = setTimeout(
      () => dispatch(notificationSlice.actions.clearNotification()),
      5000,
    );
    dispatch(notificationSlice.actions.clearTimeoutId());
    dispatch(
      notificationSlice.actions.setNotification({ ...notification, timeoutId }),
    );
  };
};

export default notificationSlice.reducer;
