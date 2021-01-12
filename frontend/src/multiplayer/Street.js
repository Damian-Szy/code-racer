import React, { useEffect, useState } from "react";

import Logo from "../logo.png";
import "./Street.css";

const Street = (props) => {
  const [width, setWidth] = useState(100)
  const [widthCar, setWidthCar] = useState(100)
  
  useEffect(() => {
    setWidth(document.querySelector('tbody').offsetWidth)
    setWidthCar(document.querySelector('img').offsetWidth / 2)
  }, [])


  return (
    <table>
      <tbody className="cars">
        <td>
          <p style={{left: props.completion*(width-widthCar)}} className="username">{props.username}</p>
          <img  style={{left: `${props.completion*(width-widthCar)}px`}} src={Logo} alt="race car"></img>
        </td>
      </tbody>
      <h1 className="speed">{props.speed} WPM</h1>
    </table>
  );
};

export default Street;
