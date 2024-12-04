import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearCurrentUser } from "../reducers/userReducer";
import { useState } from "react";

const AccountDropDown = ({ user, logoutFn }) => {
  const [open, setOpen] = useState(false);

  const handleEscape = (e) => {
    if (e.key === "Esc" || e.key === "Escape") {
      setOpen(false);
    }
  };
  document.addEventListener("keydown", handleEscape);

  return (
    <div className="hidden relative sm:block">
      <button
        onClick={() => setOpen(false)}
        className={`${open || "hidden"} fixed inset-0 h-full w-full bg-black opacity-50 cursor-default`}
      ></button>
      <button
        onClick={() => setOpen(!open)}
        className="relative z-10 w-8 h-8 bg-gray-200 rounded-full font-bold text-sky-600 flex items-center justify-center"
      >
        {user.name[0].toUpperCase()}
      </button>
      <div
        className={`${open || "hidden"} w-max mt-2 py-2 absolute right-0 rounded-lg bg-white text-gray-900 shadow-xl`}
      >
        <div className="px-2 flex items-center">
          <div className="w-8 h-8 bg-sky-600 rounded-full font-bold text-white shrink-0 flex items-center justify-center">
            {user.name[0].toUpperCase()}
          </div>
          <span className="ml-2 shrink-0">{user.name}</span>
        </div>
        <div className="mt-2 flex flex-col">
          <button
            className="px-2 font-medium hover:bg-indigo-500"
            onClick={logoutFn}
          >
            log out
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.users.current);

  const navLinks = [
    { to: "/", text: "blogs" },
    { to: "/users", text: "users" },
  ];

  const logoutFn = () => {
    dispatch(clearCurrentUser());
  };

  return (
    <header className="px-4 bg-sky-600 text-gray-200 sm:flex sm:justify-between sm:items-center">
      <div className="flex justify-between items-center gap-2 py-4">
        <div className="text-xl font-black">BlogApp</div>
        <div>
          <button
            type="button"
            className="hover:text-white focus:text-white focus:outline-none sm:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <nav className={`${open || "hidden"} font-semibold sm:block`}>
        <div className="py-2 flex flex-col gap-1 sm:flex-row sm:items-center ">
          {navLinks.map((l, i) => (
            <Link
              key={i}
              className="px-4 rounded-lg hover:bg-sky-200 hover:text-gray-800 sm:px-2 "
              to={l.to}
            >
              {l.text}
            </Link>
          ))}
          <AccountDropDown user={user} logoutFn={logoutFn} />
        </div>
        <div className="px-4 py-3 border-t border-gray-300 sm:hidden">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full font-bold text-sky-600 flex items-center justify-center">
              {user.name[0].toUpperCase()}
            </div>
            <span className="ml-2">{user.name}</span>
          </div>
          <div className="">
            <button
              className="mt-2 font-medium hover:text-white"
              onClick={logoutFn}
            >
              log out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
