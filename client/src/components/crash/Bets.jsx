import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#0A0C1A",
    width: "100%",
    // height: "29vh",
    height: '37vh',
    // borderTopRightRadius: 5,
    // borderTopLeftRadius: 5,
    borderRadius: 5,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 20,
    },
  },
  betAmount: {
    width: "100%",
    height: "3rem",
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    color: "#31344f",
    fontWeight: "bold",
    "& span": {
      display: "flex",
      marginLeft: "auto",
      color: "white",
    },
  },
  bets: {
    display: "flex",
    color: "white",
    height: "100%",
    flexDirection: "column",
    overflowY: "auto",
  },
  bet: {
    display: "flex",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 5,
    width: "100%",
    padding: 10,
    fontSize: 12,
    background: "#20243e",
    position: "relative",
  },
  winningAmount: {
    color: "#6afe43",
  },
  avatar: {
    height: 25,
    width: 25,
  },
}));

const Bets = ({ players, loading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} height="100% !important" minHeight="20vh">
      <Box className={classes.betAmount} style={{color:"white", fontWeight: 400 }}>
        {/* Current Bets placed */}
        {players.length ? players.length : '0'} Players
        <span style={{ fontWeight: 'bold' }}>
          {loading
            ? "Loading..."
            : "$" +
              players
                .map(player => parseFloat(player.betAmount))
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}
        </span>
      </Box>

      <Box className={classes.bets}>
        {players
          .sort((a, b) => b.betAmount - a.betAmount)
          .map(player => (
            <Box key={player.betId} padding="0 1rem">
              <Box className={classes.bet}>
                <Box
                  style={{
                    width: "40%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    className={classes.avatar}
                    src={player.avatar}
                    variant="rounded"
                  />
                  <Box ml={2}>{player.username}</Box>
                </Box>
                <Box ml="auto" style={{ width: "20%" }}>
                  {player.stoppedAt &&
                    `${(player.stoppedAt / 100).toFixed(2)}x`}
                </Box>
                <Box ml="auto" style={{ width: "20%" }}>
                  ${player.betAmount.toFixed(2)}
                </Box>
                <Box
                  ml="auto"
                  style={{ width: "20%" }}
                  className={classes.winningAmount}
                >
                  {player.winningAmount &&
                    `+$${player.winningAmount.toFixed(2)}`}
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
      
    </Box>
  );
};

Bets.propTypes = {
  players: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Bets;
