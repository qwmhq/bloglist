import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  commentOnBlog,
  initializeBlogs,
  likeBlog,
  removeBlog,
} from "../reducers/blogReducer";
import { showBriefNotification } from "../reducers/notificationReducer";
import { useField } from "../hooks";

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

  const [comment, resetComment] = useField("text");

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

  const addComment = async (event) => {
    event.preventDefault();
    try {
      await dispatch(commentOnBlog(blog, comment.value));
      dispatch(
        showBriefNotification({
          message: "comment added!",
          isError: false,
        }),
      );
      resetComment();
    } catch (error) {
      dispatch(
        showBriefNotification({
          message: error.response.data.error,
          isError: true,
        }),
      );
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
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input {...comment} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((c) => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlogView;
