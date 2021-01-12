import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import "./profilePage.css";

const ProfilePage = (props) => {
  const [data, setData] = useState({timeTyped: 3670});
  const auth = useContext(AuthContext);
  const [time, setTime] = useState({hours: 0, minutes: 0, seconds: 0})
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/get-profile`, {withCredentials: true})
      .then((res) => {
        const hours = Math.floor(res.data.timeTyped/3600)
        let timeLeft = res.data.timeTyped - (hours*3600)
        const minutes = Math.floor(timeLeft/60)
        const seconds = timeLeft - (minutes*60)
        setTime({totalSeconds: res.data.timeTyped, hours: hours, minutes: minutes, seconds: seconds})
        setData({
          username: auth.username,
          wordsTyped: res.data.wordsTyped,
          racesPlayed: res.data.racesPlayed,
          functionsTyped: res.data.functionsTyped,
          classesTyped: res.data.classesTyped
        });
      })
      .catch();
  }, []);

  return (
    <div className="profile-card">
      <h1>{data.username}</h1>
      <h1>Stats</h1>
      <div className="stats">
        <table>
          <tbody>
            <tr>
              <td>
                <p>Words Typed:</p>
              </td>
              <td>
                <p>{data.wordsTyped}</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Time Typed:</p>
              </td>
              <td>
                <p>{time.hours}h {time.minutes}m {time.seconds}s</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Average WPM:</p>
              </td>
              <td>
                <p>{Math.floor(60 * data.wordsTyped / time.totalSeconds)} WPM</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Races Played:</p>
              </td>
              <td>
                <p>{data.racesPlayed}</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Functions Typed:</p>
              </td>
              <td>
                <p>{data.functionsTyped}</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Classes Typed:</p>
              </td>
              <td>
                <p>{data.classesTyped}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
