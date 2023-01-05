import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { getUserCryptoInformation } from "../../../services/api.service";
import { CopyToClipboard } from "react-copy-to-clipboard";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

// Custom Styles
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
        color: "#fff",
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
    // width: "75%",
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

const Ethereum = () => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState(null);
  const [copied, setCopied] = useState(false);

  // componentDidMount
  useEffect(() => {
    // Fetch crypto information from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCryptoInformation();

        // Update state
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.log(
          "There was an error while fetching user crypto information:",
          error
        );
        addToast(
          "There was an error while fetching your crypto deposit information. Please try again later!",
          { appearance: "error" }
        );
      }
    };

    fetchData();
  }, [addToast]);

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.flexbox}>
          <Box className={classes.inputs}>
            <Box>
              Send your desired amount of Ethereum (ETH) to the following
              address.
              <br />
              You will be credited after 8 confirmations.
            </Box>
            {loading ? (
              <Skeleton
                height={56}
                width={504}
                animation="wave"
                variant="rect"
              />
            ) : (
              <Box className={classes.Depvalue}>
                <TextField
                  label="Ethereum Deposit Address"
                  variant="outlined"
                  color="#4F79FD"
                  value={cryptoData.eth.address}
                />
                <CopyToClipboard
                  text={cryptoData.eth.address}
                  onCopy={() => setCopied(true)}
                >
                  <Button>{copied ? "COPIED!" : "COPY"}</Button>
                </CopyToClipboard>
              </Box>
            )}
          </Box>
          {loading ? (
            <Skeleton
              height={140}
              width={140}
              animation="wave"
              variant="rect"
              style={{ marginLeft: "2em" }}
            />
          ) : (
            <img
              className={classes.qrcopy}
              src={cryptoData.eth.dataUrl}
              alt="QR Code"
            />
          )}
        </Box>
      </Fragment>
    </Box>
  );
};

export default Ethereum;
