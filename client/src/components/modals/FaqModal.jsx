import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// Custom Styles
const useStyles = makeStyles({
  modal: {
    "& div > div": {
      background: "#171a32",
      color: "#fff",
      maxHeight: "50rem",
    },
  },
});

const FaqModal = ({ open, handleClose }) => {
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
        FAQ
      </DialogTitle>
      <DialogContent dividers>
        <b>Which cryptocurrencies do you support?</b>
        <p>- Bitcoin</p>
        <p>- Ethereum</p>
        <p>- Litecoin</p>

        <b>How to contact the support team?</b>
        <p>
          There is a live support button in the footer or you can email us at
          support@cups.gg
        </p>

        <b>What is the house edge?</b>

        <p>Cups: 5%</p>
        <p>Shuffle: 5%</p>
        <p>King: 5%</p>
        <p>Wheel: 2%</p>

        <b>My winnings are missing:</b>

        <p>
          If your winnings are missing try to refresh the page, if it didn't fix
          the issue, please open a ticket
        </p>

        <b>How does the affiliates work?</b>

        <p>
          When using affiliator's code while betting, the affiliator gets 20% of
          every bet's house edge.
        </p>

        <p>
          Once you refer a new user to the site, they need to verify their
          account in order to claim the free $0.5
        </p>

        <p>
          The affiliates are dynamic and the user can support any user they
          want, but the free money can be only claimed once
        </p>

        <b>What is VIP?</b>

        <p>
          Once you reach a certain amount of wager, you will be welcomed in our
          vip program that include:
        </p>
        <p>- Rakeback</p>
        <p>- Weekly coupon codes</p>
        <p>- Monthly promotion</p>

        <p>The higher your vip rank is the higher rewards there is</p>

        <b>What is Race?</b>

        <p>
          It's a way to earn money by playing on the site! You need to battle
          your friend and the rest of the community to win
        </p>
        <p>
          Simply wager and play on Cups.gg! Once you have wagered, you have
          directly entered to the race!
        </p>

        <b>Can I deposit and withdraw directly?</b>

        <p>
          Unfortunately, to prevent trading on site we require the user to wager
          50% of the deposit before he withdraw
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

export default FaqModal;
