import React, { useState, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// Components
import Opponent from "./Opponent";
import EnemyCup from "./EnemyCup";
import Provably from "../modals/ProvablyModal";

// Icons
import CasinoIcon from "@material-ui/icons/Casino";

// Assets
import vs from "../../assets/vs.png";
import green from "../../assets/greenKing.png";
import blue from "../../assets/blueKing.png";
import red from "../../assets/redKing.png";

import fakeBets from "../../libs/fakeBets";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  container: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 120,
  },
  box: {
    marginBottom: 5,
  },
  round: {
    display: "flex",
    height: "10rem",
    width: "100%",
    marginBottom: 10,
    border: "1px solid #111729",
    borderRadius: 5,
  },
  provably: {
    background: "#111729",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "3rem",
    [theme.breakpoints.down("sm")]: {
      height: "fit-content",
      position: "absolute",
      margin: "1rem",
      borderRadius: "100%",
    },
    "& span": {
      color: "#232b42",
    },
    "& svg": {
      transform: "rotate(45deg)",
    },
  },
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    alignItems: "flex-start",
    marginLeft: "3rem",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      marginLeft: "1rem",
      marginBottom: "1rem",
      justifyContent: "flex-end",
    },
    "& h1": {
      margin: 0,
      color: "white",
      fontSize: 20,
      fontWeight: "100",
    },
    "& h3": {
      margin: 0,
      fontSize: 12,
      color: "#191c30",
    },
  },
  players: {
    width: "15rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    [theme.breakpoints.down("xs")]: {
      alignItems: "center",
      width: "100%",
      margin: "0 1rem",
    },
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      margin: "0 1rem",
      alignItems: "center",
    },
  },
  player: {
    display: "flex",
    color: "white",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
    "& img": {
      height: "auto",
    },
    "& span": {
      marginLeft: "1rem",
      marginRight: "1rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  result: {
    background: "#070A15",
    width: "30%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  avatar: {
    backgroundColor: "#181c32",
    color: "#333a60",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  vs: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 2rem",
  },
  waitTitle: {
    color: "white",
    position: "absolute",
    fontSize: 15,
    margin: 0,
  },
}));

// Custom Styled Component
const JoinBtn = withStyles(theme => ({
  root: {
    marginLeft: "1rem",
    transform: "skew(-20deg)",
    color: "white",
    background: props => props.color,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
    "& .MuiButton-label": {
      marginRight: 0,
    },
    "& .MuiTouchRipple-root": {
      marginRight: 0,
    },
    "&:hover": {
      background: props => props.color,
    },
    "& span": {
      marginLeft: 0,
    },
    "& :nth-child(1)": {
      transform: "skew(20deg)",
      textTransform: "capitalize",
      fontSize: 10,
    },
  },
}))(Button);

// Custom Styled Component
const Play = withStyles({
  root: {
    height: 64,
    width: 80,
    top: 0,
    padding: "0 10px",
    transition: "0.25s ease",
    cursor: "pointer",
    position: "relative",
    background: props => props.bg,
    pointerEvents: props => props.events,
    backgroundSize: "contain !important",
    backgroundPosition: "center !important",
    backgroundRepeat: "no-repeat !important",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
})(Box);

// Custom Styled Component
const Ball = withStyles({
  root: {
    width: 10,
    height: 10,
    background: "white",
    borderRadius: "100%",
    position: "absolute",
    transition: "0.25s ease",
    top: props => props.top,
    left: props => props.left,
    zIndex: 0,
  },
})(Box);

const Round = () => {
  const classes = useStyles();

  const [betSchema] = useState(fakeBets);
  const [top, setTop] = useState(80);
  const [openProv, setProv] = useState(false);
  const [left, setLeft] = useState(null);
  const [events, setEvents] = useState("all");
  const userID = 1;

  const result = event => {
    event.target.style.top = "-1rem";
    var win = ["green", "red", "blue"];
    var chosen = event.target.dataset.cup;
    setEvents("none");

    const Pos = ["50px", "auto", "213px"];
    const ballPos = Math.floor(Math.random() * 3);
    win = win[ballPos];

    if (chosen === win) {
      setTop(100);
    }

    setLeft(Pos[ballPos]);
    //Animation Example
  };

  function joinGame() {}

  return (
    <div style={{ width: "100%" }}>
      {betSchema.king.map((bet, i) => {
        return (
          <Box key={i} className={classes.round}>
            <Provably
              id="214fd148-e27b-45c8-a6d2-73e38f40a19a"
              handleClose={() => setProv(!openProv)}
              open={openProv}
            />
            <Box className={classes.provably}>
              <IconButton onClick={() => setProv(!openProv)} color="primary">
                <CasinoIcon />
              </IconButton>
            </Box>
            <Box className={classes.value}>
              <h1>${bet.price}</h1>
              <h3>VALUE</h3>
            </Box>
            <Box className={classes.players}>
              {bet.left[0].slot === null ? (
                <Box className={classes.player}>
                  <Avatar variant="rounded" className={classes.avatar} />
                  <JoinBtn
                    color="#4f79fd"
                    variant="contained"
                    onClick={() => joinGame()}
                  >
                    Join
                  </JoinBtn>
                </Box>
              ) : (
                <Box className={classes.player}>
                  <Avatar
                    src={bet.left[0].avatar}
                    variant="rounded"
                    className={classes.avatar}
                  />
                  <span>{bet.left[0].slot}</span>
                </Box>
              )}
            </Box>
            {bet.left[0].ID === userID ? (
              <Box className={classes.result}>
                <Ball left={left} top={top} />

                <Play
                  data-cup="green"
                  data-round={bet.roundID}
                  events={events}
                  bg={`url(${green})`}
                  id={bet.roundID}
                  onClick={event => result(event)}
                />
                <Play
                  data-cup="red"
                  data-round={bet.roundID}
                  events={events}
                  bg={`url(${red})`}
                  id={bet.roundID}
                  onClick={event => result(event)}
                />
                <Play
                  data-cup="blue"
                  data-round={bet.roundID}
                  events={events}
                  bg={`url(${blue})`}
                  id={bet.roundID}
                  onClick={event => result(event)}
                />
              </Box>
            ) : (
              <Box className={classes.result}>
                <EnemyCup />
              </Box>
            )}
            <Box className={classes.vs}>
              <img src={vs} alt="vs" />
            </Box>
            <Box className={classes.players}>
              {bet.right[0].slot === null ? (
                <Box className={classes.player}>
                  <Avatar variant="rounded" className={classes.avatar} />
                  <JoinBtn
                    color="#4f79fd"
                    variant="contained"
                    onClick={() => joinGame()}
                  >
                    Join
                  </JoinBtn>
                </Box>
              ) : (
                <Box className={classes.player}>
                  <Avatar
                    src={bet.right[0].avatar}
                    variant="rounded"
                    className={classes.avatar}
                  />
                  <span>{bet.right[0].slot}</span>
                </Box>
              )}
            </Box>
            {bet.right[0].ID === userID ? (
              <Box className={classes.result}>
                <Ball />
                <Play
                  events={events}
                  bg={`url(${green})`}
                  onClick={event => result(event)}
                />
                <Play
                  events={events}
                  bg={`url(${red})`}
                  onClick={event => result(event)}
                />
                <Play
                  events={events}
                  bg={`url(${blue})`}
                  onClick={event => result(event)}
                />
              </Box>
            ) : (
              <Fragment>
                {bet.right[0].state === "waiting" ? (
                  <Box className={classes.result}>
                    <h2 className={classes.waitTitle}>Waiting for Opponent</h2>
                    <Opponent
                      style={{ opacity: 0.2 }}
                      events="none"
                      bg={`url(${green})`}
                    />
                    <Opponent
                      style={{ opacity: 0.2 }}
                      events="none"
                      bg={`url(${red})`}
                    />
                    <Opponent
                      style={{ opacity: 0.2 }}
                      events="none"
                      bg={`url(${blue})`}
                    />
                  </Box>
                ) : bet.right[0].state === "ready" ? (
                  <Box className={classes.result}>
                    <Opponent events="none" bg={`url(${green})`} />
                    <Opponent events="none" bg={`url(${red})`} />
                    <Opponent events="none" bg={`url(${blue})`} />
                  </Box>
                ) : null}
              </Fragment>
            )}
          </Box>
        );
      })}
    </div>
  );
};

export default Round;
