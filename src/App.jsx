import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import BlogForm from './components/BlogForm';

const localStorageUserKey = 'loggedBloglistUser';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null, isError: false });

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageUserKey);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
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
    showNotification({
      message: `a new blog "${response.title}" by ${response.author} has been added`,
      isError: false
    });
  };

  const onFailure = (message) => showNotification({ message, isError: true });

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
            <BlogForm onSuccess={onBlogFormSuccess} onFailure={onFailure} />
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
      }
    </div>
  );
};

export default App;
