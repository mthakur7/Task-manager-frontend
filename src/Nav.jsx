import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "./App";

const Nav = () => {
  const { state, dispatch } = useContext(UserContext);
  return (
    <div className="navbar">
      <ul>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          {" "}
          <li>Home</li>{" "}
        </NavLink>
        {state === false || state === null ? (
          <NavLink to="/login" style={{ textDecoration: "none" }}>
            {" "}
            <li>Login</li>
          </NavLink>
        ) : (
          <NavLink to="/logout" style={{ textDecoration: "none" }}>
            {" "}
            <li>Logout</li>
          </NavLink>
        )}
        <NavLink to="/register" style={{ textDecoration: "none" }}>
          {" "}
          <li>Register</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Nav;
