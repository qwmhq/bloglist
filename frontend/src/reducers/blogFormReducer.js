import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
};

const blogFormSlice = createSlice({
  name: "blogFormModal",
  initialState,
  reducers: {
    hideBlogForm(state, action) {
      return {...state, visible: false};
    },
    showBlogForm(state, action) {
      return {...state, visible: true};
    },
  },
});

export const {hideBlogForm, showBlogForm} = blogFormSlice.actions;

export default blogFormSlice.reducer;
