import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import { showBriefNotification } from "../reducers/notificationReducer";

const Blog = ({ blog, handleLike, handleDelete, showDeleteBtn }) => {
  const [view, setView] = useState(false);
  const toggleView = () => {
    setView(!view);
  };

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleView}>{view ? "hide" : "view"}</button>
      </div>
      {view && (
        <div>
          <div>{blog.url}</div>
          <div>
            <div>likes {blog.likes}</div>
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {showDeleteBtn && (
            <div>
              <button onClick={handleDelete}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BlogList = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.users.current);

  const like = async (updatedBlog) => {
    try {
      await dispatch(likeBlog(updatedBlog));
      dispatch(
        showBriefNotification({
          message: `liked '${updatedBlog.title}'`,
          isError: false,
        }),
      );
    } catch (error) {
      console.log("update error:", error);
      dispatch(
        showBriefNotification({
          message: `couldn't like '${updatedBlog.title}'`,
          isError: true,
        }),
      );
    }
  };

  const remove = async (blog) => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      try {
        await dispatch(removeBlog(blog));
        dispatch(
          showBriefNotification({
            message: "deleted blog successfully",
            isError: false,
          }),
        );
      } catch (error) {
        dispatch(
          showBriefNotification({
            message: error.response.data.error,
            isError: true,
          }),
        );
      }
    }
  };

  return (
    <>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => like(blog)}
          handleDelete={() => remove(blog)}
          showDeleteBtn={user.id === blog.user.id}
        />
      ))}
    </>
  );
};

export default BlogList;
