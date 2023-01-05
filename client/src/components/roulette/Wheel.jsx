import React from "react";
import { withStyles } from "@material-ui/core/styles";

// MUI Components
import Box from "@material-ui/core/Box";

// Assets
import wheelImg from "../../assets/wheel.png";

// Custom Styled Componen
const Wheel = withStyles({
  root: {
    height: "150%",
    background: `url(${wheelImg})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    transform: props => props.result,
    transition: props => props.transition,
    opacity: props => props.opacity,
  },
})(Box);

const WheelSpin = ({ opacity, rotate, transition }) => {
  return (
    <span
      style={{
        transition: "0.25s ease",
        positon: "absolute",
        bottom: "-5rem",
        height: "100%",
        width: "100%",
        opacity: opacity,
      }}
    >
      <Wheel result={rotate} transition={transition} />
    </span>
  );
};

export default WheelSpin;
