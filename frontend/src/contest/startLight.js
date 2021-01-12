import React from "react";

import "./startLight.css";

const StartLight = (props) => {
  // take in the time
  let startLight;
  startLight =
    props.time > 0 ? (
      <div className="start-section">
        <div>
          <h1>Countdown:</h1>
        </div>
        <div>
          <h1>{props.time}</h1>
        </div>
      </div>
    ) : (
      <div>
        <h1>GO</h1>
      </div>
    );

  return startLight;
};

export default StartLight;
