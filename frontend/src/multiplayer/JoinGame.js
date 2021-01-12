import React, {useState, useEffect, useContext} from "react";

import { Redirect } from "react-router-dom";

import io from '../socket'
import {AuthContext} from '../context/auth-context'

const initializeSocket = () => {
    return io.init(process.env.REACT_APP_BACKEND_URL)
}

const JoinGame = (props) => {
    const auth = useContext(AuthContext)

    const [redirect, setRedirect] = useState(null);
  

    useEffect(() => {
        // give header a chance to set everything up
      if (auth.clientId){
        const socket = initializeSocket()
        let username = auth.username
        let userId = auth.clientId
        socket.emit('join-game', {gameId: props.match.params.gameId, username: username, userId: userId})
        // consider generating the random clientId and username here 
       
        socket.on("phrase", (arg) => {
            setRedirect(<Redirect to={{pathname: `/game/${props.match.params.gameId}`, state: {host: false, userId: userId, phrase: arg.phrase }}}/>)
          })
      } else {
          return;
      }
      
    }, [auth.username])



  return (
    <div>
      {redirect}
      <h1>Joining Game</h1>
      <div className="loader">Loading...</div>
    </div>
  );
};

export default JoinGame;
