import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./App";
import "./index.css";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  function fun(e) {
    setInput((preValue) => {
      let name = e.target.name;
      let value = e.target.value;
      return { ...preValue, [name]: value };
    });
  }

  const sub = async (e) => {
    e.preventDefault();
   

    const { email, password } = input;
    const response = await fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await response.json();

    if (response.status === 400 || !data) {
      window.alert("Invalid Login Credentials!!");
    } else {
      dispatch({ type: "USER", payload: true });
      window.alert("Logged in Successfully!");
      navigate("/");
    }
    
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form action="/login" method="POST">
        <input
          type="email"
          placeholder="email"
          name="email"
          onChange={fun}
          value={input.email}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={fun}
          value={input.password}
        />
        <button type="submit" onClick={sub}>
          Submit{" "}
        </button>
      </form>
    </div>
  );
};

export default Login;
