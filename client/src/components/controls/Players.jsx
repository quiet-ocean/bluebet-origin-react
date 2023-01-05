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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    backgroundColor: "#1f263b",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    color: "white",
    textShadow: "0px 0px 10px",
  },
}))(Box);

const Unchecked = withStyles(theme => ({
  root: {
    opacity: 0.5,
    transition: "1s opacity",
    height: "100%",
    width: "100%",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    backgroundColor: "#1f263b",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    color: "white",
  },
}))(Box);

const ColorRadio = withStyles(theme => ({
  root: {
    padding: 0,
    height: "2.25rem",
    width: "3rem",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      width: "2rem",
    },
    marginRight: 5,
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
    width: "6rem",
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
}));

const Players = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <ColorOption>
      <Box className={classes.reverse}>Players</Box>
      <ColorRadio
        checkedIcon={<Checked>2</Checked>}
        icon={<Unchecked>2</Unchecked>}
        onChange={() => onChange(2)}
        checked={value === 2}
        value={2}
      />
      <ColorRadio
        checkedIcon={<Checked>3</Checked>}
        icon={<Unchecked>3</Unchecked>}
        onChange={() => onChange(3)}
        checked={value === 3}
        value={3}
      />
      <ColorRadio
        checkedIcon={<Checked>4</Checked>}
        icon={<Unchecked>4</Unchecked>}
        onChange={() => onChange(4)}
        checked={value === 4}
        value={4}
      />
    </ColorOption>
  );
};

Players.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Players;
