import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const cmpFn = (a, b) => {
  if (a.likes > b.likes) {
    return -1;
  } else if (a.likes < b.likes) {
    return 1;
  } else {
    return 0;
  }
};

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort(cmpFn);
    },
    appendBlog(state, action) {
      return [...state, action.payload].sort(cmpFn);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state
        .map((x) => (x.id === updatedBlog.id ? updatedBlog : x))
        .sort(cmpFn);
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((x) => x.id !== id);
    },
  },
});

const { setBlogs, appendBlog, updateBlog, deleteBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = ({ title, author, url }) => {
  return async (dispatch) => {
    const createdBlog = await blogService.create({ title, author, url });
    dispatch(appendBlog(createdBlog));
    return createdBlog;
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    await blogService.update(updatedBlog.id, updatedBlog);
    dispatch(updateBlog(updatedBlog));
  };
};

export const commentOnBlog = (blog, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(blog.id, comment);
    dispatch(updateBlog(updatedBlog));
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id);
    dispatch(deleteBlog(blog.id));
  };
};

export default blogSlice.reducer;
