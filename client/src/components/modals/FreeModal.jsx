import React, { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  getUserAffiliatesData,
  redeemAffiliateCode,
} from "../../services/api.service";
import { changeWallet } from "../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd !important",
  },
})(CircularProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      background: "#171a32",
      color: "#fff",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      [theme.breakpoints.down("xs")]: {
        width: "80%",
      },
    },
  },
  vipTitle: {
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#507afd",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#373c5c",
    textAlign: "center",
    margin: "2rem auto",
    "& > a": {
      color: "#5f679a",
      textDecoration: "none",
    },
    "& b": {
      color: "#5f679a",
      textDecoration: "none",
    },
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      background: "rgba(44, 48, 84, 0.45)",
      "& > input": {
        transform: "skew(15deg)",
      },
    },
    "& > div": {
      width: "100%",
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
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#4e7afd",
      color: "white",
      transform: "skew(-15deg)",
      "&:hover": {
        background: "#4e7afd",
      },
      "& .MuiButton-label": {
        transform: "skew(15deg)",
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "15rem",
  },
}));

const Free = ({ open, handleClose, changeWallet, code: suppliedCode }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);
  const [code, setCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const affiliator = await redeemAffiliateCode(code);

      // Update state
      setAffiliateData(state => ({
        ...state,
        currentlySupporting: affiliator,
      }));
      setRedeeming(false);

      // If free money was claimed (first redeem)
      if (affiliator.freeMoneyClaimed) {
        addToast("You have successfully claimed your free $0.50. Enjoy! :)", {
          appearance: "success",
        });
        changeWallet({ amount: 0.5 });
      } else {
        addToast("Successfully updated your dynamic affiliator code!", {
          appearance: "success",
        });
      }
    } catch (error) {
      setRedeeming(false);
      console.log(
        "There was an error while trying to redeem affiliate code:",
        error
      );

      // If this was validation error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through errors
        error.response.data.errors.forEach(error =>
          addToast(error.msg, { appearance: "error" })
        );
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        // If this was user caused error
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        addToast("Unknown error happened, please contact administrators!", {
          appearance: "error",
        });
      }
    }
  };

  // componentDidMount
  useEffect(() => {
    // Fetch current affiliate data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserAffiliatesData();

        // If user has claimed affiliate code
        if (data.currentlySupporting) {
          // Make sure it's not set by affiliate link
          setCode(state =>
            state === "" ? data.currentlySupporting.code : state
          );
        }

        // Update state
        setAffiliateData(data);
        setLoading(false);
      } catch (error) {
        console.log(
          "There was an error while loading user affiliate data:",
          error
        );
        addToast(
          "There was an error while getting your affiliate data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    // If modal is opened, fetch data
    if (open) {
      fetchData();
    } else {
      // When modal is closed, reset code
      setCode("");
    }
  }, [addToast, open]);

  // If affiliate code was supplied
  useEffect(() => {
    if (suppliedCode) {
      setCode(suppliedCode);
      addToast("Detected affiliate link! Redirected you to affiliates page!", {
        appearance: "success",
      });
    }
  }, [addToast, suppliedCode]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Free Cash
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        ) : (
          <Fragment>
            {affiliateData.currentlySupporting && (
              <h4 className={classes.vipDesc}>
                You are currently supporting{" "}
                <b>{affiliateData.currentlySupporting.username}</b>!
              </h4>
            )}
            <Box position="relative" className={classes.progressbox}>
              <TextField
                className="input"
                variant="outlined"
                label="Affiliate Code"
                value={code}
                onChange={onChange}
              />
              <Button
                className="saveBtn"
                variant="contained"
                onClick={onClick}
                disabled={redeeming}
              >
                {redeeming ? "Redeeming..." : "Redeem"}
              </Button>
            </Box>
            <h4 className={classes.vipDesc}>
              Enter a code to support your affiliate and gain a free 0.50!
            </h4>
          </Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Free.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Free);
