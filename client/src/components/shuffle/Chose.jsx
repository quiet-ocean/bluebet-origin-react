import React, { Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core";

// MUI Components
import Box from "@material-ui/core/Box";

// Custom Styles
const useStyles = makeStyles({
  contain: {
    width: "90%",
    overflow: "visible",
    maskImage: "linear-gradient(90deg,transparent, white, white, transparent)",
    padding: "2rem 0",
    position: "relative",
    zIndex: 3,
  },
  rolling: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    zIndex: 100,
    top: -10,
  },
});

// Custom Styled Component
const Roll = withStyles({
  root: {
    display: "flex",
    transform: props => props.position,
    transition: props => props.animation,
    justifyContent: "center",
    zIndex: 90,
    "& img": {
      width: 100,
      zIndex: 90,
    },
  },
})(Box);

// Custom Styled Component
const ArrowTop = withStyles({
  root: {
    margin: "auto",
    position: "relative",
    zIndex: 100,
    top: 15,
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: props => props.borderSide,
  },
})(Box);

// Custom Styled Component
const ArrowBottom = withStyles({
  root: {
    margin: "auto",
    position: "relative",
    zIndex: 100,
    top: 105,
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: props => props.borderSide,
  },
})(Box);

const Chose = ({ color, images, transform, animation, repeat }) => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.contain}>
      <ArrowTop borderSide={`10px solid ${color}`} />
      <ArrowBottom borderSide={`10px solid ${color}`} />

      <h3 style={{ color: color }} className={classes.rolling}>
        Spinning Cup
      </h3>

      <Roll animation={animation} position={transform}>
        {Array(repeat)
          .fill()
          .map(e => (
            <Fragment>
              {images.map((e, i) => (
                <img src={e} key={i} alt="user-icon" />
              ))}
            </Fragment>
          ))}
      </Roll>
    </Box>
  );
};

export default Chose;
