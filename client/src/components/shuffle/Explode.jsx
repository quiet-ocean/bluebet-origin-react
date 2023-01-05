import React, { useEffect, useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";

// MUI Components
import Box from "@material-ui/core/Box";

// Custom Styled Component
const Explode = withStyles({
  root: {
    position: "absolute",
    width: "1rem",
    height: "1rem",
    borderRadius: "100%",
    background: props => props.color,
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: "auto",
    animationName: props => props.animation,
    animationDuration: "5.1s",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "forwards",
    opacity: 0.5,
  },
})(Box);

const Exploded = ({ color }) => {
  // Declare State
  const [animation, setAnimation] = useState("explodeAni");

  // componentDidMount
  useEffect(() => {
    if (color === "#e84cff") {
      setTimeout(() => setAnimation("none"), 3000);
    }
  });

  return (
    <Fragment>
      <Explode color={color} animation={animation} />
    </Fragment>
  );
};

export default Exploded;
