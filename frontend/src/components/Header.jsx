import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearCurrentUser } from "../reducers/userReducer";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.current);
  return (
    <header>
      <nav>
        <ul className="navbar">
          <li className="nav-item">
            <Link to="/">blogs</Link>
          </li>
          <li className="nav-item">
            <Link to="/users">users</Link>
          </li>
          <li className="nav-item">
            <Link to="/create">create</Link>
          </li>
        </ul>
      </nav>
      <div>
        <p>{user.name} logged in</p>
        <button onClick={() => dispatch(clearCurrentUser())}>log out</button>
      </div>
    </header>
  );
};

export default Header;
