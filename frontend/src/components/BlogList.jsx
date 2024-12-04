import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import BlogForm from "./BlogForm";
import { hideBlogForm, showBlogForm } from "../reducers/blogFormReducer";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  const blogFormVisible = useSelector((state) => state.blogForm.visible);
  const dispatch = useDispatch();

  return (
    <div className="mt-2 flex flex-col gap-2 sm:max-w-lg sm:m-auto">
      <button
        className="px-2 py-1 rounded-lg bg-sky-600 text-white self-start"
        onClick={() => dispatch(showBlogForm())}
      >
        create
      </button>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="border-2 border-gray-500 rounded-lg bg-white p-2"
        >
          <Link to={`/blogs/${blog.id}`}>
            <h3 className="text-lg font-semibold">{blog.title}</h3>
            <div className="text-sm">{blog.author}</div>
          </Link>
        </div>
      ))}
      <Modal visible={blogFormVisible} onClose={() => dispatch(hideBlogForm())}>
        <BlogForm></BlogForm>
      </Modal>
    </div>
  );
};

export default BlogList;
