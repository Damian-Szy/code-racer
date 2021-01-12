import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";

import io from "../socket";
import "./multiplayerRace.css";
import Street from "./Street";
import InputField from "../contest/inputField";
import StartLight from "../contest/startLight";
import TextBox from "../contest/textBox";
import { AuthContext } from "../context/auth-context";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MultiplayerRace = (props) => {
  const auth = useContext(AuthContext);
  const [showLink, setShowLink] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [users, setUsers] = useState([{}]);
  const [startButton, setStartButton] = useState(null)
  let gameId = props.match.params.gameId;
  const userInputRef = useRef(userInput);
  userInputRef.current = userInput;

  const [raceTime, setRaceTime] = useState([0]);
  const raceTimeRef = useRef(raceTime);
  raceTimeRef.current = raceTime;

  const setUserInputHandler = (newAddition) => {
    if (newAddition === "backspace") {
      setUserInput((prevState) => prevState.slice(0, -1));
    } else {
      setUserInput((prevState) => prevState + newAddition);
    }
  };


  const [time, setTime] = useState(10);
  useEffect(() => {
    let sendGameDataID;
    io.getIO().on("game-data", (args) => {
      setUsers(args);
    });
    io.getIO().on("start-game", async (args) => {
      for (let i = 0; i < 11; i++) {
        setTimeout(() => {
          setTime((prevState) => 10 - i);
        }, i * 1000);
      }
      await sleep(10000);
      sendGameDataID = setInterval(() => {
        io.getIO().emit("race-update", {
          gameId: gameId,
          userId: auth.clientId,
          words: userInputRef.current.length / 5,
          time: raceTimeRef.current,
        });
        if (raceTimeRef.current > 0) {
          setRaceTime(prevState => prevState +1)
        } else {
          setRaceTime(1)
        }
        if (userInputRef.current === props.location.state.phrase.replace(/@/ig, '')){
          clearInterval(sendGameDataID)
          if (auth.isLoggedIn){
            io.getIO().emit('finished-race', {gameId: gameId, userId: auth.clientId, words: userInputRef.current.length / 5,
              time: raceTimeRef.current,})
          }
        }
      }, 1000);
    });

    if (props.location.state.host) {
      setStartButton(
        <div className="start-button">
          <button onClick={startGameHandler}>Start Race</button>
        </div>
      );
    }

    return () => {
      io.getIO().emit("close", { username: auth.username, gameId: gameId });
      clearInterval(sendGameDataID);
    };
  }, []);

  let link;
  let button;

  const removeLinkHandler = () => {
    setShowLink(false);
  };

  const startGameHandler = () => {
    setStartButton(null)
    io.getIO().emit("start-game", { gameId: gameId });
  };



  if (showLink && props.location.state) {
    link = (
      <h1>
        Share this link with your friends to join: {window.location.hostname}/join-game/
        {gameId}
      </h1>
    );
    button = <button onClick={removeLinkHandler}>Close</button>;
  }


  return (
    <div className="mp-screen">
      <div
        className="game-id"
        style={
          showLink && props.location.state
            ? { border: "black solid 1px" }
            : null
        }
      >
        {link}
        {button}
      </div>
      <StartLight time={time.toString()} />
      <div className="street">
        {users.map((user, index) => (
          <Street
            key={index}
            username={user.username}
            speed={user.speed}
            completion={
              user.wordsTyped / props.location.state.phrase.split(" ").length
            }
          />
        ))}
      </div>
      <div>
        <TextBox userInput={userInput}>{props.location.state.phrase}</TextBox>
        <InputField
          onChange={(newAddition) => setUserInputHandler(newAddition)}
          phrase={props.location.state.phrase}
          time={time}
        ></InputField>
        {startButton}
      </div>
    </div>
  );
};

export default MultiplayerRace;
