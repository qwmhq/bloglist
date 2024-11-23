import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { initializeBlogs, likeBlog, removeBlog } from "../reducers/blogReducer";
import { showBriefNotification } from "../reducers/notificationReducer";

const BlogView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const id = useParams().id;
  const blog = useSelector((state) => {
    const blogs = state.blogs;
    return blogs ? blogs.find((b) => b.id === id) : null;
  });

  const user = useSelector((state) => state.users.current);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const like = async (blog) => {
    try {
      await dispatch(likeBlog(blog));
      dispatch(
        showBriefNotification({
          message: `liked '${blog.title}'`,
          isError: false,
        }),
      );
    } catch (error) {
      console.log("update error:", error);
      dispatch(
        showBriefNotification({
          message: `couldn't like '${blog.title}'`,
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
        navigate("/");
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

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={() => like(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {user.id === blog.user.id && (
        <button onClick={() => remove(blog)}>remove</button>
      )}
    </div>
  );
};

export default BlogView;
