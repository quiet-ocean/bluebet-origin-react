import React from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";

// MUI Components
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";

const ColorOption = withStyles(theme => ({
  root: {
    display: "flex",
    marginRight: "1rem",
    transform: "skew(-20deg)",
  },
}))(Box);

const Checked = withStyles(theme => ({
  root: {
    height: "100%",
    width: "100%",
    borderRadius: 3,
    opacity: props => props.op,
    backgroundColor: props => props.color,
    "&:before": {
      display: "flex",
      width: 20,
      height: 20,
      backgroundImage: "#f5092c",
      content: '""',
    },
  },
}))(Box);

const ColorRadio = withStyles(theme => ({
  root: {
    padding: 0,
    height: "2.25rem",
    width: "3rem",
    color: "white",
    marginRight: 5,
    [theme.breakpoints.down("sm")]: {
      width: "2.25rem",
    },
    "& span": {
      height: "100%",
    },
    "& .MuiTouchRipple-root": {
      opacity: 0,
    },
  },
}))(Checkbox);

const useStyles = makeStyles(theme => ({
  reverse: {
    display: "flex",
    width: "5rem",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    transform: "skew(20deg)",
    color: "#2b3252",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
  disabled: {
    cursor: "not-allowed !important",
    pointerEvents: "all !important",
  },
}));

const Color = ({ value, onChange, playerAmount }) => {
  // Declare State
  const classes = useStyles();

  return (
    <ColorOption>
      <Box className={classes.reverse}>Color</Box>
      <ColorRadio
        checkedIcon={<Checked op="1" color="#FF4D4D" />}
        icon={<Checked op="0.5" color="#FF4D4D" />}
        onChange={onChange}
        checked={value === "red"}
        value="red"
      />
      <ColorRadio
        checkedIcon={<Checked op="1" color="#4D79FF" />}
        icon={<Checked op="0.5" color="#4D79FF" />}
        onChange={onChange}
        checked={value === "blue"}
        value="blue"
      />
      <ColorRadio
        checkedIcon={<Checked op="1" color="#4DFF89" />}
        icon={<Checked op="0.5" color="#4DFF89" />}
        onChange={onChange}
        checked={value === "green"}
        disabled={playerAmount < 3}
        className={playerAmount < 3 ? classes.disabled : ""}
        value="green"
      />
      <ColorRadio
        checkedIcon={<Checked op="1" color="#FFE44D" />}
        icon={<Checked op="0.5" color="#FFE44D" />}
        onChange={onChange}
        checked={value === "yellow"}
        disabled={playerAmount !== 4}
        className={playerAmount !== 4 ? classes.disabled : ""}
        value="yellow"
      />
    </ColorOption>
  );
};

Color.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  playerAmount: PropTypes.number.isRequired,
};

export default Color;
