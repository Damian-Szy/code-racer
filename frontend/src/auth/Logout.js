import React, { useContext, useState } from "react";

import { Redirect } from "react-router-dom";
import "./Logout.css";
import { AuthContext } from "../context/auth-context";
import axios from "axios";

const getRanHex = () => {
  let result = [];
  let hexRef = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];

  for (let n = 0; n < 24; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join("");
};

const Logout = () => {
  const [redirect, setRedirect] = useState(null);

  const auth = useContext(AuthContext);
  const logout = () => {
    auth.logout();
    auth.setClientId(getRanHex);
    auth.setUsername(`Guest ${Math.floor(Math.random() * (999 - 1 + 1)) + 1}`);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/logout`, { withCredentials: true })
      .then((res) => {
        setRedirect(<Redirect to="/" />);
      });
  };

  return (
    <div className="logout">
      <h1>Are you sure you would like to logout?</h1>
      <button onClick={logout}>Logout</button>
      {redirect}
    </div>
  );
};

export default Logout;
