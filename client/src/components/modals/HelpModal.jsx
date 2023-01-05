import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Custom Styles
const useStyles = makeStyles({
  modal: {
    "& div > div": {
      background: "#171a32",
      color: "#fff",
    },
  },
});

const Help = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Help Modal
      </DialogTitle>
      <DialogContent dividers>
        <b>How "Wheel" works:</b>
        <p>
          1. Place the amount you'd like to bet on any multiplier
          <br />
          2. If the spinner lands on 7x everything will be multiplied by 7
          <br />
          3. If the spinner lands on the "cup" a random multiplier will be
          chosen from 2x to 4x
        </p>
        <b>How "Shuffle" works:</b>
        <p>
          1. Place the amount you'd like to bet
          <br />
          2. 2 players or more must participate
          <br />
          3. Once all players have participated, random participants will be
          picked and chosen a cup for
          <br />
          4. Cups will begin to shuffle and one of those cups contain a ball
          that will reveal the winner
        </p>
        <b>How "Cups" work:</b>
        <p>
          1. Choose the number of players, from 2-4
          <br />
          2. Pick the color of your cup
          <br />
          3. The amount you'd like to bet
          <br />
          4. Once all players have participated in the game, a random cup will
          have a ball underneath it that determines the winner.
        </p>
        <b>How "King" works:</b>
        <p>
          1. Place the amount you'd like to bet
          <br />
          2. Pick a random cup, 1 of them has a ball underneath
          <br />
          3. If you pick the correct one and your versus pick the wrong one, you
          win
          <br />
          4. If both of you pick the correct one or both of you pick the wrong
          one, it goes to round 2
          <br />
          5. It keeps on going until one of you win
        </p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Help;
