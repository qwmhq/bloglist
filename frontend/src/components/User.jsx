import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
