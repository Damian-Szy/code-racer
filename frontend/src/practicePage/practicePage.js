import React, { useEffect, useState, useRef } from "react";

import "./practicePage.css";
import InputField from "../contest/inputField";
import TextBox from "../contest/textBox";
import StartLight from "../contest/startLight";
import io from "../socket";
import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PracticePage = (props) => {
  const setUserInputHandler = (newAddition) => {
    if (newAddition === "backspace") {
      setUserInput((prevState) => prevState.slice(0, -1));
    } else {
      setUserInput((prevState) => prevState + newAddition);
    }
  };

  const [phrase, setPhrase] = useState("Loading");
  const [userInput, setUserInput] = useState("");
  const [speed, setSpeed] = useState(0);
  const [time, setTime] = useState(5);
  const [timeTyping, setTimeTyping] = useState(0);
  const [dataInterval, setDataInterval] = useState(0);
  const userInputRef = useRef(userInput);
  userInputRef.current = userInput;
  const timeTypingRef = useRef(timeTyping);
  timeTypingRef.current = timeTyping;

  let gameDataID;
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/get-phrase`, { withCredentials: true })
      .then((res) => {
        setPhrase(res.data.phrase);
      })
      .catch((err) => console.log(err));

    return () => {
      clearInterval(gameDataID);
    };
  }, []);

  const startGameHandler = async () => {
    setStartButton(null);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        setTime((prevState) => 5 - i);
      }, i * 1000);
    }
    await sleep(5000)
    setDataInterval(setInterval(() => {
      setTimeTyping(timeTypingRef.current + 1);
      setSpeed(Math.floor((60 * (userInputRef.current.length / 5)) / timeTypingRef.current));
    }, 1000));
  };
  if (userInput === phrase.replace(/@/ig, '')){
    clearInterval(dataInterval)
  }

  const [startButton, setStartButton] = useState(
    <div className="start-button">
      <button onClick={() => startGameHandler()}>Start Race</button>
    </div>
  );

  return (
    <div>
      <StartLight time={time.toString()} />
      <TextBox userInput={userInput}>{phrase}</TextBox>
      <InputField
        onChange={(newAddition) => setUserInputHandler(newAddition)}
        phrase={phrase}
        time={time}
      ></InputField>
      <h1>{speed} WPM</h1>
      {startButton}
    </div>
  );
};

export default PracticePage;
