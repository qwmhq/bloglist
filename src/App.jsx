import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const localStorageUserKey = 'loggedBloglistUser';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null, isError: false });

  const noteFormRef = useRef(null);

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => {
      if (a.likes > b.likes) {
        return -1;
      } else if (a.likes < b.likes) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  useEffect(() => {
    blogService.getAll().then(blogs => {
      sortBlogs(blogs);
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageUserKey);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const showNotification = ({ message, isError }) => {
    setNotification({ message, isError });
    setTimeout(
      () => setNotification({ message: null, isError: false }),
      5000
    );
  };

  const onLoginSucces = (response) => {
    setUser(response);
    blogService.setToken(response.token);
    window.localStorage.setItem(localStorageUserKey, JSON.stringify(response));
  };
  const onLogout = () => {
    window.localStorage.removeItem(localStorageUserKey);
    setUser(null);
    blogService.clearToken();
  };

  const onBlogFormSuccess = (response) => {
    setBlogs(blogs.concat(response));
    noteFormRef.current.toggleVisibility();
    showNotification({
      message: `a new blog "${response.title}" by ${response.author} has been added`
    });
  };

  const onFailure = (message) => showNotification({ message, isError: true });

  const updateBlog = async (id, updatedBlog) => {
    try {
      await blogService.update(id, updatedBlog);
      setBlogs(sortBlogs(blogs.map(b => b.id === id ? updatedBlog : b)));
    } catch (error) {
      showNotification({
        message: error.response.data.error,
        isError: true
      });
    }
  };

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter(b => b.id !== blog.id));
        showNotification({
          message: 'deleted blog successfully',
          isError: false
        });
      } catch (error) {
        showNotification({
          message: error.response.data.error,
          isError: true
        });
      }
    }
  };

  return (
    <div>
      <Notification message={notification.message} isError={notification.isError} />
      {
        user === null
          ? <LoginForm onSuccess={onLoginSucces} onFailure={onFailure} />
          : <div>
            <h2>blogs</h2>
            <div>
              {user.name} logged in
              <button onClick={onLogout}>log out</button>
            </div>
            <Togglable buttonLabel='create new' ref={noteFormRef}>
              <BlogForm onSuccess={onBlogFormSuccess} onFailure={onFailure} />
            </Togglable>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} updateFn={updateBlog} deleteFn={deleteBlog} showDeleteBtn={user.username === blog.user.username} />
            )}
          </div>
      }
    </div>
  );
};

export default App;
