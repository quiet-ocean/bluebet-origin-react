import React, { useState } from "react";
import { withStyles } from "@material-ui/core";
import Spritesheet from "react-responsive-spritesheet";

// MUI Components
import Box from "@material-ui/core/Box";

// Assets
import ani from "../../assets/ani.png";
import ani2 from "../../assets/ani2.png";
import ani3 from "../../assets/ani3.png";

const Ball = withStyles({
  root: {
    width: 10,
    height: "10px !important",
    background: "white",
    borderRadius: "100%",
    position: "absolute",
    top: props => props.top,
    left: props => props.left,
    opacity: props => props.opacity,
    zIndex: 0,
    transition: "1s ease",
  },
})(Box);

const Round = ({ players, winner }) => {
  // Declare State
  const [opacity, setOpacity] = useState(0);
  const [move, setMove] = useState(0);
  const [top, setTop] = useState(75);
  const playerPos = [
    ["130px", "230px"],
    ["82px", "183px", "282px"],
    ["62px", "144px", "224px", "304px"],
  ];
  var ballPos = playerPos[players - 2][winner - 1];

  return (
    <div>
      <Ball left={ballPos} opacity={opacity} top={top} />
      {players === 2 ? (
        <Spritesheet
          image={ani2}
          widthFrame={344}
          heightFrame={94}
          steps={120}
          fps={45}
          style={{
            zIndex: 3,
            marginBottom: move,
            transition: "margin-bottom 1s ease",
          }}
          onEnterFrame={[
            {
              frame: 119,
              callback: () => {
                setOpacity(1);
                setMove("2rem");
              },
            },
          ]}
        />
      ) : players === 3 ? (
        <Spritesheet
          image={ani3}
          widthFrame={344}
          heightFrame={94}
          steps={120}
          fps={45}
          style={{
            zIndex: 3,
            marginBottom: move,
            transition: "margin-bottom 1s ease",
          }}
          onEnterFrame={[
            {
              frame: 119,
              callback: () => {
                setOpacity(1);
                setMove("2rem");
                setTop(90);
              },
            },
          ]}
        />
      ) : players === 4 ? (
        <Spritesheet
          image={ani}
          widthFrame={344}
          heightFrame={94}
          steps={120}
          fps={45}
          style={{
            zIndex: 3,
            marginBottom: move,
            transition: "margin-bottom 1s ease",
          }}
          onEnterFrame={[
            {
              frame: 119,
              callback: () => {
                setOpacity(1);
                setMove("2rem");
                setTop(90);
              },
            },
          ]}
        />
      ) : null}
    </div>
  );
};

export default Round;
