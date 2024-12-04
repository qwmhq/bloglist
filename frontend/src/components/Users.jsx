import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUsers } from "../reducers/userReducer";
import { Link } from "react-router-dom";

const Users = () => {
  const users = useSelector((state) => state.users.all);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  if (!users) {
    return null;
  }

  return (
    <div className="mt-2 p-4 sm:max-w-lg sm:m-auto">
      <h2 className="text-xl font-bold">Users</h2>
      <table className="w-full mt-2">
        <thead className="border-b-2 border-gray-200">
          <tr className="font-semibold">
            <th className="text-left">User</th>
            <th className="text-left">Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link className="font-medium hover:text-sky-600 focus:outline-none focus:text-sky-600" to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td className="text-left">{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
