import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <>
      {blogs.map((blog) => (
        <div key={blog.id} className="blog">
          <div>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogList;
