import React, {useState, useContext} from "react";

import axios from "axios";
import { Link, Redirect} from "react-router-dom";
import "./auth.css";
import {AuthContext} from '../context/auth-context'

const Auth = (props) => {
  const [errors, setErrors] = useState(null)
  const auth = useContext(AuthContext)

  const loginHandler = async (e) => {
    e.preventDefault();
    let response;
    try {
      response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }, {withCredentials: true});
    } catch (err) {
      setErrors(<p>{err.response.data.message}</p>)
    }
    if (response.data.userId){
      auth.login()
      auth.setClientId(response.data.userId)
      auth.setUsername(response.data.username)
      setErrors(<Redirect to='/'/>)
    }
  };

  const validateEmail = e => {
    setErrors(/^\S+@\S+\.\S+$/.test(e.target.value) ? null : <p>Not a valid email</p>)
  }

  const validatePassword = e => {
    setErrors(e.target.value.trim().length < 5 ? <p>Password Too Short</p> : null)
  }

  return (
    <div>
      <h1>Login</h1>
      <form className="login-form" action="" onSubmit={loginHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" onChange={validateEmail} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" onChange={validatePassword}/>
        </div>
        <button className="btn" type="submit" disabled={errors}>
          Login
        </button>
      </form>
      <div className="create-account">
        <p>Don't have an account?</p>
        <Link to="/create-account">Make one here</Link>
      </div>
      {errors}
    </div>
  );
};

export default Auth;
