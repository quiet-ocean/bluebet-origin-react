import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

// Components
import Litecoin from "./deposit/Litecoin";
import Ethereum from "./deposit/Ethereum";
import Bitcoin from "./deposit/Bitcoin";

// Assets
import bitcoin from "../../assets/bitcoin.png";
import ethereum from "../../assets/ethereum.png";
import litecoin from "../../assets/litecoin.png";
import bitcoinICO from "../../assets/bitcoin-icon.png";
import ethereumICO from "../../assets/ethereum-icon.png";
import litecoinICO from "../../assets/litecoin-icon.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      background: "#171a32",
      color: "#fff",
      maxWidth: "1000px",
    },
  },
  cryptos: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
    "& div:nth-child(1)": {
      position: "relative",
    },
    "& button:nth-child(1)": {
      backgroundColor: "#f8931a",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(2)": {
      backgroundColor: "#62688f",
      margin: "0 10px",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(3)": {
      backgroundColor: "#b8b9bb",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
  },
  crypto: {
    height: "5rem",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "3rem",
      padding: "0",
      minWidth: 0,
    },
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
}));

const Deposit = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const [crypto, setCrypto] = useState("btc");

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogContent className={classes.cryptos} dividers>
        <Box display="flex">
          <Button
            onClick={() => setCrypto("btc")}
            className={classes.crypto}
            variant="contained"
          >
            <img className={classes.desktop} src={bitcoin} alt="bitcoin" />
            <img className={classes.mobile} src={bitcoinICO} alt="bitcoinICO" />
          </Button>
          <Button
            onClick={() => setCrypto("eth")}
            className={classes.crypto}
            variant="contained"
          >
            <img className={classes.desktop} src={ethereum} alt="ethereum" />
            <img
              className={classes.mobile}
              src={ethereumICO}
              alt="ethereumICO"
            />
          </Button>
          <Button
            onClick={() => setCrypto("ltc")}
            className={classes.crypto}
            variant="contained"
          >
            <img className={classes.desktop} src={litecoin} alt="litecoin" />
            <img
              className={classes.mobile}
              src={litecoinICO}
              alt="litecoinICO"
            />
          </Button>
        </Box>
        <Box display="flex" flexDirection="column">
          {crypto === "btc" ? (
            <Bitcoin deposit={true} />
          ) : crypto === "eth" ? (
            <Ethereum deposit={true} />
          ) : crypto === "ltc" ? (
            <Litecoin deposit={true} />
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Deposit;
