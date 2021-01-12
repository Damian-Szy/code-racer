import React, { useState, useEffect, useContext} from "react";

import io from '../socket'
import {AuthContext} from '../context/auth-context'
import './createGame.css'
import { Redirect} from "react-router-dom";

const CreateGame = props => {
  const auth = useContext(AuthContext)
  const [redirect, setRedirect] = useState(null);
  

  useEffect(() => {
    const socket = io.init(process.env.REACT_APP_BACKEND_URL)
    socket.emit('create-game', {userId: auth.clientId, username: auth.username})
    socket.on("gameId-phrase", (arg) => {
        setRedirect(<Redirect to={{pathname: `/game/${arg.gameId}`, state: {host: true, userId: auth.clientId, phrase: arg.phrase }}}/>)
      })
  }, [auth.username])

  

  return (
    <div>
        {redirect}
      <h1>Creating Game</h1>
      <div className="loader">Loading...</div>
    </div>
  );
};

export default CreateGame;
