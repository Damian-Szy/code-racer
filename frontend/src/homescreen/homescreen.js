import React from "react";

import { Link } from "react-router-dom";
import singlePlayerPhoto from "../single-player.png";
import multiPlayerPhoto from "../multi-player.svg";
import "./homescreen.css";

const homeScreen = (props) => {
    const gameId = 'fsdjlkaf'
  return (
    <div className="homescreen">
      <table>
        <tbody>
          <tr>
            <td>
              <img src={multiPlayerPhoto} alt="MultiPlayer" />
            </td>
            <td>
              <Link to='/create-game'>MultiPlayer</Link>
            </td>
          </tr>
          <tr>
            <td>
              <img src={singlePlayerPhoto} alt="Practice" />
            </td>
            <td>
              <Link to="/practice">Practice</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default homeScreen;
