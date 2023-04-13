import React from "react";
// Import Bootstrap
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  staticRow: {
    background: "#0A0C1A",
    color: "#fff",
    borderRadius: "5px",
    
    '& .MuiTypography-root': {
      fontSize: 14,
      fontWeight: 700,
      margin: 12,
      textTransform: 'capitalize',
    }
  },
  liveBetCol: {
    display: "flex",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 500,
  },

  lightColor: {
    color: "#fff",
    opacity: 0.5,
  },
  liveBetColColor: {
    display: "flex",
    justifyContent: "center",
    // color: "rgb(9, 199, 9)",
    // color: '#737990',
    color: '#9F9F9F',
    '& .MuiTypography-root': {
      fontSize: 14,
      fontWeight: 200,
      margin: 12,
      textTransform: 'capitalize',
    }
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
          <Typography className="static-heading" style={{ textAlign: 'center' }}>GAME</Typography>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <Typography className="static-heading">USER</Typography>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <Typography className="static-heading">TIME</Typography>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <Typography className="static-heading">WAGER</Typography>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <Typography className="static-heading">PAYOUT</Typography>
        </Grid>
        <Grid item xs={2} className={classes.liveBetCol}>
          {" "}
          <Typography className="static-heading">PROFIT</Typography>
        </Grid>
      </Grid>
      {FakeAPI.map((data, index) => {
        return (
          <Grid container spacing={1} key={index} style={{ background: index % 2 === 1 ? '#363a568f' : '', borderRadius: 5 }}>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <Typography>{data.game}</Typography>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <Typography>{data.user}</Typography>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <Typography>{data.time}</Typography>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <Typography>{data.wager}</Typography>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <Typography>{data.payout}</Typography>
            </Grid>
            <Grid item xs={2} className={classes.liveBetColColor}>
              <Typography>{data.profit}</Typography>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}

export default LiveBets;