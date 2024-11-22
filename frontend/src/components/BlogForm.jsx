import { useState } from "react";
import { useDispatch } from "react-redux";
import { showBriefNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";

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
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div>
          title:
          <input
            data-testid="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
