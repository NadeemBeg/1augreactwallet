import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
// import { auth } from "../firebase/firebase";
import { auth, generateUserDocument } from "../firebase/firebase";
import "./pages_css/metamask.css";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [displayName, setDisplayName] = useState("");
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem('chat-app-current-user')) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
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
      var metamask = localStorage.getItem("metamask");
      metamask = metamask.toLowerCase()
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
        device_token: localStorage.getItem("device_token"),
        metamask,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        // const loginData = auth.signInWithEmailAndPassword(data.user.email, password)
        // .then((loginUSer)=>{
        // })
        // .catch(error => {
        //   // setError("Error signing in with password and email!");
        //   console.error("Error signing in with password and email", error);
        // });


        var a = auth.signInWithEmailAndPassword(data.user.email, password)
        // .catch((error) => {
        //   // setError("Error signing in with password and email!");
        //   console.error("Error signing in with password and email", error);
        // });
        a.then((res) => {
          console.log("res", res.user.email);
        }).catch(async (error) => {
          console.log("error signing firebase", error);

          const { user } = await auth.createUserWithEmailAndPassword(
            data.user.email,
            password
          );
          generateUserDocument(user, { displayName });
          const loginData = auth.signInWithEmailAndPassword(data.user.email, password);
        })

        localStorage.setItem(
          'chat-app-current-user',
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="contain_form">
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img className="brand-i-logo" src={Logo} alt="logo" />
            <h1>VAULTIO</h1>
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
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}