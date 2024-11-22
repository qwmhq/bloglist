import PropTypes from "prop-types";
import { useState } from "react";

const Blog = ({ blog, updateFn, deleteFn, showDeleteBtn }) => {
  const [view, setView] = useState(false);
  const toggleView = () => {
    setView(!view);
  };

  const likeBlog = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    updateFn(blog.id, updatedBlog);
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
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {showDeleteBtn && (
            <div>
              <button onClick={() => deleteFn(blog)}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Blog.proptypes = {
  blog: PropTypes.object.isRequired,
  updateFn: PropTypes.func.isRequired,
  deleteFn: PropTypes.func.isRequired,
  showDeleteBtn: PropTypes.bool.isRequired,
};

export default Blog;
