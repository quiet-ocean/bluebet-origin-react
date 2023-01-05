import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core";

// MUI Components
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CasinoIcon from "@material-ui/icons/Casino";

// Components
import Animation from "./Result";
import Waiting from "./Waiting";
import Provably from "../modals/ProvablyModal";

// Assets
import cupColor from "../../assets/cupColor.png";

import fakeBets from "../../libs/fakeBets";

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
    position: "relative",
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
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      marginLeft: "1rem",
      marginBottom: "1rem",
      justifyContent: "flex-end",
    },
    justifyContent: "center",
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
    width: "100%",
    margin: "0 5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      margin: "0 0",
      alignItems: "center",
    },
    [theme.breakpoints.down("md")]: {
      margin: "0 1rem",
      alignItems: "center",
    },
  },
  player: {
    display: "flex",
    color: "white",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
    "& img": {
      height: "auto",
    },
    "& > span": {
      marginLeft: "1rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  result: {
    background: "#070A15",
    width: "110%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    "& > div": {
      height: "auto",
    },
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  avatar: {
    marginLeft: "1rem",
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
}));

const JoinBtn = withStyles(theme => ({
  root: {
    marginLeft: "1rem",
    transform: "skew(-20deg)",
    color: "white",
    background: props => props.color,
    [theme.breakpoints.down("xs")]: {
      display: "none",
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

const Round = () => {
  const classes = useStyles();

  const [betSchema] = useState({ rounds: [fakeBets] });
  const [winner] = useState(3);
  const [openProv, setProv] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {betSchema.rounds[0].cups.map(bet => {
        return (
          <Box className={classes.round}>
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
              {bet.left.map((players, index) => {
                if (players.slot != null) {
                  return (
                    <Box key={index} className={classes.player}>
                      <img
                        src={cupColor}
                        alt="cupColor"
                        style={{ filter: players.colorRotate }}
                      />
                      <Avatar
                        variant="rounded"
                        src={players.avatar}
                        className={classes.avatar}
                      />
                      <span>{players.slot}</span>
                    </Box>
                  );
                }
                return (
                  <Box className={classes.player}>
                    <img
                      src={cupColor}
                      alt="cupColor"
                      style={{ filter: players.colorRotate }}
                    />
                    <Avatar variant="rounded" className={classes.avatar} />
                    <JoinBtn color={players.color} variant="contained">
                      Join
                    </JoinBtn>
                  </Box>
                );
              })}
            </Box>
            <Box className={classes.players}>
              {bet.right.map((players, index) => {
                if (players.slot != null) {
                  return (
                    <Box key={index} className={classes.player}>
                      <img
                        src={cupColor}
                        alt="cupColor"
                        style={{ filter: players.colorRotate }}
                      />
                      <Avatar
                        variant="rounded"
                        src={players.avatar}
                        className={classes.avatar}
                      />
                      <span>{players.slot}</span>
                    </Box>
                  );
                }
                return (
                  <Box key={index} className={classes.player}>
                    <img
                      src={cupColor}
                      alt="cupColor"
                      style={{ filter: players.colorRotate }}
                    />
                    <Avatar variant="rounded" className={classes.avatar} />
                    <JoinBtn color={players.color} variant="contained">
                      Join
                    </JoinBtn>
                  </Box>
                );
              })}
            </Box>

            <Box className={classes.result}>
              {bet.joinedUsers === bet.userAmount ? (
                <Animation players={bet.userAmount} winner={winner} />
              ) : (
                <Waiting players={bet.userAmount} />
              )}
            </Box>
          </Box>
        );
      })}
    </div>
  );
};

export default Round;
