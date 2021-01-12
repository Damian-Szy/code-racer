import React, {useContext, useEffect} from "react";
import axios from 'axios'
import { NavLink, Redirect } from "react-router-dom";
import "./header.css";
import Logo from "../logo.png";
import {AuthContext} from '../context/auth-context'

const getRanHex = () => {
  let result = [];
  let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  for (let n = 0; n < 24; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join('');
}

const Header = (props) => {
  const auth = useContext(AuthContext)

  // check if we are already logged in through cookie
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/verify`, {withCredentials: true}).then(res => {
      if (res.data.userId === null){
        const userId = getRanHex()
        auth.logout();
        auth.setClientId(userId)
        auth.setUsername(`Guest ${Math.floor(Math.random() * (999 - 1 + 1)) + 1}`)
      } else {
        auth.login()
        auth.setClientId(res.data.userId)
        auth.setUsername(res.data.username)
      }
    }).catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div className="main-header">
      <NavLink to="/">
        <img src={Logo} alt="Logo" onClick={() => Redirect('/')} />
        <h1 className='logo-name'>CodeRacer</h1>
      </NavLink>

      {auth.isLoggedIn ? (
        <div className='profile-logout'>
        <NavLink className="profile-button" to={{pathname: `/profile/${props.userId}`}}>
          Profile
        </NavLink>
        <NavLink className="logout-button" to="/logout">
          Logout
        </NavLink>
        </div>
      ) : (
        <NavLink className="login-button" to="/auth">
          Login/Signup
        </NavLink>
      )}
      
    </div>
  );
};

export default Header;
