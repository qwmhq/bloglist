import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { initializeUsers } from "../reducers/userReducer";

const User = () => {
  const dispatch = useDispatch();

  const id = useParams().id;
  const user = useSelector((state) => {
    const allUsers = state.users.all;
    return allUsers ? allUsers.find((u) => u.id === id) : null;
  });

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="mt-2 p-4 sm:max-w-lg sm:m-auto">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <h3 className="mt-2 text-lg font-semibold">added blogs</h3>
      <ul className="px-1">
        {user.blogs.map((b) => (
          <li className="mt-1" key={b.id}>
            <Link
              className="hover:text-sky-600 focus:outline-none focus:text-sky-600"
              to={`/blogs/${b.id}`}
            >
              <span className="inline-block w-3 h-3 rounded-full bg-current"></span>
              <span className="ml-2">
              {b.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
