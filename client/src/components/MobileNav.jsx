import React from "react";
import { makeStyles } from "@material-ui/core";
import { NavLink as Link } from "react-router-dom";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ChatIcon from "@material-ui/icons/Chat";

// Assets
import cup from "../assets/cup.png";
import spin from "../assets/roll.png";
import king from "../assets/king.png";
import shuffle from "../assets/shuffle.png";
import crash from "../assets/crash.png";

const useStyles = makeStyles(theme => ({
  root: {
    background: "#080B19",
    display: "flex",
    width: "85%",
    boxShadow: "none",
    padding: "1rem 1rem",
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "83%",
    },
    "& .MuiToolbar-gutters": {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },
  },
  menu: {
    color: "#424863",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
    },
  },
  active: {
    "& > button": {
      height: "3rem",
      width: "5rem",
      backgroundColor: "#4F79FD",
      borderColor: "#4F79FD",
      color: "white",
      transform: "skew(-20deg)",
      marginRight: 20,
      "& img": {
        opacity: "1 !important",
      },
    },
  },
  reverse: {
    transform: "skew(20deg)",
    textTransform: "capitalize",
    display: "flex",
    "& .crash": {
      height: 35,
    },
  },
  notactive: {
    textDecoration: "none",
    "& > button": {
      width: "5rem",
      height: "3rem",
      borderColor: "#313548",
      color: "#313548",
      transform: "skew(-20deg)",
      marginRight: 20,
      [theme.breakpoints.down("sm")]: {
        width: "4rem",
        marginRight: 5,
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "skew(20deg)",
      },
    },
  },
  balance: {
    display: "flex",
    flexDirection: "column",
    background: "#111427",
    transform: "skew(-15deg)",
    marginLeft: "auto",
    padding: "0.5rem 5rem 0.5rem 1.5rem",
    borderRadius: "0.25rem",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& span": {
      color: "#4c4f61",
      textTransform: "uppercase",
      fontSize: 8,
    },
  },
  price: {
    fontSize: 15,
  },
  plus: {
    position: "absolute",
    background: "#84C46D",
    padding: "0.25rem 0.3rem",
    right: "-1rem",
    top: "0.75rem",
    minWidth: 30,
    "&:hover": {
      background: "#59ba6e",
    },
    "& span": {
      color: "white",
    },
  },
  pfp: {
    transform: "skew(-15deg)",
    marginLeft: "2rem",
    background: "#181B2B",
    padding: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
    },
  },
  controls: {
    marginTop: 20,
  },
  right: {
    display: "flex",
    marginLeft: "auto",
  },
  create: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
    color: "white",
    transform: "skew(-20deg)",
    marginRight: 20,
  },
  multiplier: {
    backgroundColor: "#181B2B",
    borderColor: "#181B2B",
    color: "white",
    transform: "skew(-20deg)",
    marginRight: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    transform: "skew(-20deg)",
  },
  modal: {
    "& div > div": {
      background: "#171a32",
      color: "#fff",
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  desktop: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  mobileNav: {
    display: "none",
    justifyContent: "space-between",
    position: "fixed",
    bottom: 0,
    zIndex: 10000,
    background: "#080b19",
    width: "100%",
    padding: 20,
    overflow: "visible",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  chat: {
    position: "absolute",
    bottom: "1.25rem",
    left: "1rem",
    color: "white",
    background: "#4f79fd",
    "&:focus": {
      background: "#4f79fd",
    },
  },
}));

const MobileNav = ({ mobileChat, setMobile }) => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.mobileNav}>
      <Box className={classes.notactive}>
        <Button
          onClick={() => setMobile(!mobileChat)}
          size="large"
          color="primary"
          variant="outlined"
        >
          <span className={classes.reverse}>
            <ChatIcon style={{ color: "white" }} />
          </span>
        </Button>
      </Box>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/crash"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
            <img className="crash" src={crash} alt="crash" />
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/cups"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
            <img src={cup} alt="cup" />
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/shuffle"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
            <img src={shuffle} alt="shuffle" />
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/roulette"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
            <img src={spin} alt="spin" />
          </span>
        </Button>
      </Link>
    </Box>
  );
};

export default MobileNav;
