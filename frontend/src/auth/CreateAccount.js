import React, {useState, useContext} from "react";
import { Link , Redirect} from "react-router-dom";
import axios from 'axios'
import "./CreateAccount.css";
import {AuthContext} from '../context/auth-context'
const CreateAccount = (props) => {
  const [errors, setErrors] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const auth = useContext(AuthContext)

  const createAccountHandler = async (e) => {
    e.preventDefault();
    if (document.getElementById("password").value !== document.getElementById("confirm-password").value){
      setErrors(<p>Passwords don't match</p>)
      return;
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-account`, {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }, { withCredentials: true }).then(response => {
        if (response.data.message === 'User created!'){
          auth.login()
          auth.setClientId(response.data.userId)
          auth.setUsername(response.data.username)
          setRedirect(true)
        }
      }).catch(err => {
        setErrors(<p>{err.response.data.message}</p>)
      });
  };

  const validateEmail = e => {
    setErrors(/^\S+@\S+\.\S+$/.test(e.target.value) ? null : <p>Not a valid email</p>)
  }

  const validatePassword = e => {
    setErrors(e.target.value.trim().length < 5 ? <p>Password Too Short</p> : null)
  }


  return (
    <div>
      {redirect ? <Redirect to='/'/> : null}
      <h1>Sign-Up</h1>
      <form class="login-form" onSubmit={createAccountHandler}>
        <div class="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </div>
        <div class="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" onChange={validateEmail}/>
        </div>
        <div class="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" onChange={validatePassword}/>
        </div>
        <div class="form-control">
          <label htmlFor="password">Confirm Password</label>
          <input type="password" name="password" id="confirm-password" />
        </div>
        <button class="btn" type="submit">
          Sign Up
        </button>
      </form>
      <div className="create-account">
        <p>Already have an account?</p>
        <Link to="/auth">Login here</Link>
      </div>
      {errors}
    </div>
  );
};

export default CreateAccount;
