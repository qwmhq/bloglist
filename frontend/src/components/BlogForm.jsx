import { useState } from "react";
import { useDispatch } from "react-redux";
import { showBriefNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";
import { hideBlogForm } from "../reducers/blogFormReducer";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await dispatch(createBlog({ title, author, url }));
      dispatch(
        showBriefNotification({
          message: `a new blog "${createdBlog.title}" by ${createdBlog.author} has been added`,
          isError: false,
        }),
      );
      setTitle("");
      setAuthor("");
      setUrl("");
      dispatch(hideBlogForm());
    } catch (error) {
      dispatch(
        showBriefNotification({
          message: error.response.data.error,
          isError: true,
        }),
      );
    }
  };

  return (
    <div className="p-6 rounded bg-white">
      <h3 className="text-2xl font-semibold">create a new blog</h3>
      <form onSubmit={onSubmit}>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="title">
              title
            </label>
            <input
              className="w-full rounded-lg border-gray-500 focus:outline-none focus:border focus:border-sky-200"
              id="title"
              data-testid="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="author">
              author
            </label>
            <input
              className="w-full rounded-lg border-gray-500 focus:outline-none focus:border focus:border-sky-200"
              id="author"
              data-testid="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="url">
              url
            </label>
            <input
              className="w-full rounded-lg border-gray-500 focus:outline-none focus:border focus:border-sky-200"
              data-testid="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <button
          className="w-full mt-4 px-2 py-1 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-400"
          type="submit"
        >
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
