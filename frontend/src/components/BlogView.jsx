import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    <div className="mt-2 p-4 sm:max-w-lg sm:m-auto">
      <h2 className="text-xl font-semibold">{blog.title}</h2>
      <a
        className="underline text-sm text-gray-500 hover:text-sky-600 focus:outline-none focus:text-sky-600"
        href={`//${blog.url}`}
      >
        {blog.url}
      </a>
      <div className="mt-2 flex gap-4 text-gray-600">
        <div className="mt-1 text-sm">
          added by{" "}
          <span className="font-semibold">
            <Link
              className="hover:text-sky-600 focus:outline-none focus:text-sky-600"
              to={`/users/${blog.user.id}`}
            >
              {blog.user.name}
            </Link>
          </span>
        </div>
        <button
          className="flex items-center gap-1 hover:text-sky-600 focus:outline-none focus:text-sky-600"
          onClick={() => like(blog)}
        >
          <svg
            className="w-4 h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            {
              //<!--! Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
            }
            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
          </svg>
          <span className="text-sm">{blog.likes}</span>
        </button>
        {user.id === blog.user.id && (
          <button
            className="hover:text-sky-600 focus:outline-none focus:text-sky-600"
            onClick={() => remove(blog)}
          >
            <svg
              className="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              {
                //<!--! Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
              }
              <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
            </svg>
          </button>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold">comments</h3>
        <form onSubmit={addComment}>
          <div className="flex justify-between items-center">
            <input className="w-full rounded-lg" {...comment} />
            <button
              className="ml-1 px-2 py-3 rounded-lg bg-sky-600 text-white text-xs font-semibold"
              type="submit"
            >
              comment
            </button>
          </div>
        </form>
        <ul className="mt-3 px-1">
          {blog.comments.map((c) => (
            <li key={c.id}>&quot;{c.content}&quot;</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogView;
