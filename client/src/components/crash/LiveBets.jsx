import React from "react";
// Import Bootstrap
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  staticRow: {
    background: "#0A0C1A",
    color: "#fff",
    borderRadius: "5px",
  },
  liveBetCol: {
    display: "flex",
    justifyContent: "center",
  },

  lightColor: {
    color: "#fff",
    opacity: 0.5,
  },
  liveBetColColor: {
    display: "flex",
    justifyContent: "center",
    color: "rgb(9, 199, 9)",
  },
}));

function LiveBets() {
  const FakeAPI = [
    {
      game: "CRASH",
      user: "John",
      time: "01:01a.m.",
      wager: "2.25 ",
      payout: "2x",
      profit: "0.51",
    },
    {
      game: "CRASH",
      user: "John",
      time: "01:01a.m.",
      wager: "2.25 ",
      payout: "2x",
      profit: "0.51",
    },
    {
      game: "CRASH",
      user: "John",
      time: "01:01a.m.",
      wager: "2.25 ",
      payout: "2x",
      profit: "0.51",
    },
    {
      game: "CRASH",
      user: "John",
      time: "01:01a.m.",
      wager: "2.25 ",
      payout: "2x",
      profit: "0.51",
    },
  ];

  const classes = useStyles();
  return (
    <div>
      <Grid container spacing={1} className={classes.staticRow}>
        <Grid item xs={2} className="liveBet-col">
          {" "}
          <h6 className="static-heading">GAME</h6>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <h6 className="static-heading">USER</h6>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <h6 className="static-heading">TIME</h6>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <h6 className="static-heading">WAGER</h6>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <h6 className="static-heading">PAYOUT</h6>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <h6 className="static-heading">PROFIT</h6>
        </Grid>
      </Grid>
      {FakeAPI.map((data, index) => {
        return (
          <Grid container spacing={1} key={index}>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <h6>{data.game}</h6>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <h6>{data.user}</h6>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <h6>{data.time}</h6>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <h6>{data.wager}</h6>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <h6>{data.payout}</h6>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <h6>{data.profit}</h6>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}

export default LiveBets;