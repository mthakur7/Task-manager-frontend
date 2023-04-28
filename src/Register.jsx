import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Register = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    gender: "",
  });

  function fun(e) {
    let name = e.target.name;
    let value = e.target.value;

    setInput((preValue) => {
      return { ...preValue, [name]: value };
    });
  }

  const sub = async (e) => {
    e.preventDefault();
 
  
    const { name, email, password, confirmpassword, gender } = input;
    const response = await fetch("/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirmpassword: confirmpassword,
        gender: gender,
      }),
    });
    const data = response.json();

    if (response.status === 422 || !data) {
      window.alert("Invalid registration!!");
    } else {
      window.alert("User Registered Successfully!");
      navigate("/login");
    }
  };
  return (
    <div className="register">
      <h1>Register</h1>

      <form action="/register" method="POST">
        <input
          type="text"
          name="name"
          placeholder="name"
          value={input.name}
          onChange={fun}
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          value={input.email}
          onChange={fun}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={input.password}
          onChange={fun}
        />
        <input
          type="password"
          name="confirmpassword"
          placeholder="confirmpassword"
          value={input.confirmpassword}
          onChange={fun}
        />
        <p>
          Male:
          <input type="radio" name="gender" value="male" onChange={fun} />
          Female:
          <input type="radio" name="gender" value="female" onChange={fun} />
        </p>
        <button type="submit" onClick={sub}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
