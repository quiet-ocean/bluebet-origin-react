import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { withdrawCrypto } from "../../../services/api.service";
import PropTypes from "prop-types";
import { changeWallet } from "../../../actions/auth";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 25,
    padding: "1rem",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      margin: 10,
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    height: "10rem",
    justifyContent: "space-around",
    marginTop: "25px",
    "& > div": {
      transform: "skew(-15deg)",
      "& label": {
        color: "#4f5792",
      },
      "& label.Mui-focused": {
        color: "#4e7afd",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#4e7afd",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#212549",
        },
        "&:hover fieldset": {
          borderColor: "#212549",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#4e7afd",
        },
      },
      "& > div > input": {
        transform: "skew(15deg)",
      },
    },
    "& > div > div": {
      background: "#14172c !important",
    },
  },
  value: {
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#14172c !important",
      },
      "& > div > input": {
        transform: "skew(15deg)",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "white",
      backgroundColor: "#527cff !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  Depvalue: {
    position: "relative",
    width: "75%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#14172c !important",
      },
      "& > div > input": {
        transform: "skew(15deg)",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "white",
      backgroundColor: "#527cff !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  withdraw: {
    color: "white",
    backgroundColor: "#527cff !important",
    width: "100%",
    marginTop: "1rem",
    transform: "skew(-15deg)",
    height: "3rem",
  },
  qr: {
    position: "absolute",
    width: 140,
    marginRight: "1rem",
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  qrcopy: {
    height: 140,
    width: 140,
    marginLeft: "2em",
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
  },
  flexbox: {
    display: "flex",
    alignItems: "center",
    "& img": {
      margin: "0 0 0 2em",
    },
  },
}));

const Bitcoin = ({ user, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [withdrawing, setWithdrawing] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // TextField onChange event handler
  const addressOnChange = e => {
    setAddress(e.target.value);
  };

  // TextField onChange event handler
  const amountOnChange = e => {
    setAmount(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setWithdrawing(true);
    try {
      const response = await withdrawCrypto("BTC", address, parseFloat(amount));

      // Update state
      setWithdrawing(false);
      changeWallet({ amount: -Math.abs(response.siteValue) });

      // Check transaction status
      if (response.state === 1) {
        addToast(
          `Successfully withdrawed ${response.siteValue.toFixed(
            2
          )} credits for ${response.cryptoValue.toFixed(
            8
          )} Bitcoin! Your withdrawal should arrive within a few minutes!`,
          { appearance: "success" }
        );
      } else {
        addToast(
          `Successfully withdrawed ${response.siteValue.toFixed(
            2
          )} credits for Bitcoin! Your withdrawal should arrive within a few minutes!`,
          { appearance: "success" }
        );
      }
    } catch (error) {
      setWithdrawing(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        console.log("There was an error while withdrawing crypto:", error);
        addToast(
          "There was an error while requesting this withdrawal. Please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box>
          Withdraw your desired amount of Bitcoin (BTC) to the following
          address.
          <br />
          You will be credited after 8 confirmations.
        </Box>
        <Box className={classes.inputs}>
          <TextField
            label="Your Bitcoin Address"
            variant="outlined"
            color="#4F79FD"
            value={address}
            onChange={addressOnChange}
          />
          <Box className={classes.value}>
            <TextField
              label="Amount (Min. $5.00)"
              variant="outlined"
              color="#4F79FD"
              value={amount}
              onChange={amountOnChange}
            />
            <Button onClick={() => setAmount(user ? user.wallet : 0)}>
              MAX
            </Button>
          </Box>
        </Box>
        <Button
          className={classes.withdraw}
          onClick={onClick}
          disabled={withdrawing}
        >
          {withdrawing ? "Withdrawing..." : "Request Withdrawal"}
        </Button>
      </Fragment>
    </Box>
  );
};

Bitcoin.propTypes = {
  user: PropTypes.object,
  changeWallet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Bitcoin);
