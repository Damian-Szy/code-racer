import React, { useEffect } from "react";

import "./textBox.css";

// const textBox = (props) => {
//     return props.userInput.join('') === props.children.join('') ? <h1 style={{display: 'block'}}>You finished!</h1> : (<div className='text-box'>
//         {props.children.map((letter, index) => {
//           if (letter === ' ' && props.userInput[index] !== ' ' && props.userInput[index] !== undefined){
//               return <h1 key={index} style={{ color: "red" }}>{props.userInput[index]}</h1>;
//           }
//           else if (props.userInput[index] === undefined) {
//             return <h1 key={index} style={{ color: "black" }}>{letter}</h1>;
//           } else {
//           const correct = letter === props.userInput[index]
//           return <h1 key={index} style={{ color: correct ? "green" : "red", borderBottom: correct ? '2px solid black': null}}>{letter}</h1>;
//           }
//         })}
//       </div>)

// };

const TextBox = (props) => {
  let phraseWithoutTabs = props.children.replace(/@/g, '')
  let numTabs = 0;
  let phrase = props.children
  return (
    <div className="text-box">
      {phrase.split("").map((letter, index) => {
        let color = 'black'
        if (letter === "@") {
          numTabs += 1;
          return null
        } if (props.userInput[index - numTabs] !== undefined){
          color = phraseWithoutTabs[index - numTabs] === props.userInput[index - numTabs] ? 'blue' : 'red'
        } if (letter === '~'){
          return <br key={index}/>
        }  if (phrase[index - 1] === " ") {
          return <h1 key={index} style={{ marginLeft: "5px", color: color }}>{letter}</h1>;
        } if (
          phrase[index - 1] === "@" &&
          phrase[index - 2] === "@"
        ) {
          return <h1 key={index} style={{ marginLeft: "60px", color: color }}>{letter}</h1>;
        } if (phrase[index - 1] === "@") {
          return <h1 key={index} style={{ marginLeft: "30px", color: color }}>{letter}</h1>;
        } 
        return <h1 key={index} style={{color: color}}>{letter}</h1>;
      })}
    </div>
  );
};

export default TextBox;
