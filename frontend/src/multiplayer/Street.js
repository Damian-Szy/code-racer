import React from "react";

import Logo from "../logo.png";
import "./Street.css";

const Street = (props) => {
  return (
    <table>
      <tbody className="cars">
        <td>
          <p className="username">{props.username}</p>
          <img src={Logo} alt="race car"></img>
        </td>
      </tbody>
      <h1 className="speed">{props.speed} WPM</h1>
    </table>
  );
};

export default Street;
