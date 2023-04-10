import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    }
    if (localStorage.getItem("metamask") == null) {
      toast.error("Metamask Address is required.", toastOptions);
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Validation Pass");
      navigate("/admin/dashborad");
    } else {
      console.log("Validation fail");
    }
  };
  return (
    <>
      <div className="contain_form">
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            {/* <img className="brand-i-logo" src={Logo} alt="logo" /> */}
            <h1>VAULTIO ADMIN</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
