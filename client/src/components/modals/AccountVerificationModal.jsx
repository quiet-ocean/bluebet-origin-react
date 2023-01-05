import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import {
  getUserVerificationData,
  sendVerificationCode,
  submitVerificationCode,
  checkAndVerifyUser,
} from "../../services/api.service";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../services/api.service";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    "& > button": {
      color: "#5f679a",
      background: "none",
      border: "none",
      fontFamily: "inherit !important",
      cursor: "pointer",
      fontWeight: "inherit !important",
      textDecoration: "none",
      transition: "all .3s ease",
      "&:hover": {
        color: "#4c5277",
      },
    },
    "& > a": {
      color: "#5f679a",
      textDecoration: "none",
      transition: "all .3s ease",
      "&:hover": {
        color: "#4c5277",
      },
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
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "15rem",
  },
  loyaltyBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 0 0 0",
    "& h4": {
      color: "#373c5c",
    },
    "& b": {
      color: "#5f679a",
      textDecoration: "none",
    },
    "& img": {
      height: "4rem",
      width: "auto",
      marginRight: "1rem",
    },
  },
  checkBtn: {
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
  captcha: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "2rem 0 0 0",
  },
}));

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd !important",
  },
})(CircularProgress);

const AccountVerificationModal = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [verificationType, setVerificationType] = useState(null);

  // Mobile checking state
  const [mobileNumber, setMobileNumber] = useState("");
  const [sending, setSending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reCaptcha, setReCaptcha] = useState(null);

  // CS:GO checking state
  const [checking, setChecking] = useState(false);

  // Button onClick event handler
  const sendMessage = async () => {
    setSending(true);
    try {
      const response = await sendVerificationCode(mobileNumber, reCaptcha);

      // Update state
      setVerificationType("waitingsms");
      addToast(
        "Successfully sent your verification code to your phone number!",
        { appearance: "success" }
      );

      console.log("Sent message to:", response.mobileNumber);
    } catch (error) {
      setSending(false);
      setReCaptcha(null);
      console.log(
        "There was an error while sending SMS to a phone number:",
        error
      );

      // If this was a validation error
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
        // User caused this error
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        addToast(
          "There was an error while sending your verification code, please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  // Button onClick event handler
  const submitCode = async () => {
    setSubmitting(true);
    try {
      const response = await submitVerificationCode(verificationCode);

      // Update state
      if (response.success) {
        addToast("Successfully verified your account!", {
          appearance: "success",
        });
        handleClose();
      }
    } catch (error) {
      setSubmitting(false);
      console.log("There was an error while submitting SMS code:", error);

      // If this was a validation error
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
        // User caused this error
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        addToast(
          "There was an error while submitting your verification code, please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  // Button onClick event handler
  const onClick = async () => {
    setChecking(true);
    try {
      const response = await checkAndVerifyUser();

      // Update state
      if (response.success) {
        addToast("Successfully verified your account!", {
          appearance: "success",
        });
        handleClose();
      }
    } catch (error) {
      setChecking(false);
      console.log(
        "There was an error while checking user's steam inventory:",
        error
      );

      // If this was user's error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        addToast(
          "There was an error while checking your steam inventory, please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  // TextField onChange event handler
  const onChange = e => {
    setMobileNumber(e.target.value);
  };

  // TextField onChange event handler
  const codeOnChange = e => {
    // Update state
    setVerificationCode(e.target.value);
  };

  // ReCAPTCHA onChange event handler
  const reCaptchaOnChange = value => {
    // Update state
    setReCaptcha(value);
  };

  // componentDidMount
  useEffect(() => {
    // Fetch verification data from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getUserVerificationData();

        // Update state
        setVerificationType(response.verificationType);
        setLoading(false);

        // If user is already verified, close modal
        if (response.hasVerifiedAccount) {
          addToast("You have already verified your account!", {
            appearance: "info",
          });
          handleClose();
        }

        // If phone number is submitted, change it to that
        if (
          response.verificationType === "textmessage" &&
          response.verifiedPhoneNumber
        ) {
          setMobileNumber(response.verifiedPhoneNumber);
          setVerificationType("waitingsms");
        }
      } catch (error) {
        console.log("Error while getting user verification data:", error);
        addToast(
          "There was an error while getting your verification information, please try again later!",
          { appearance: "error" }
        );
      }
    };

    if (open) fetchData();
  }, [handleClose, addToast, open]);

  // When modal is re-opened, reset state
  useEffect(() => {
    if (open) {
      setMobileNumber("");
      setSending(false);
      setReCaptcha(null);
    }
  }, [open]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Verify Your account
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        ) : verificationType === "waitingsms" ? (
          <Fragment>
            <h4 className={classes.vipDesc}>
              We have sent a SMS Verification code to <b>{mobileNumber}</b>.
            </h4>
            <Box position="relative" className={classes.progressbox}>
              <TextField
                className="input"
                variant="outlined"
                label="SMS Verification Code"
                inputProps={{ readOnly: false, "aria-readonly": false }}
                value={verificationCode}
                onChange={codeOnChange}
              />
              <Button
                className="saveBtn"
                variant="contained"
                onClick={submitCode}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
            <h4 className={classes.vipDesc}>
              Please allow up to 5 minutes for the message to arrive.
              <button onClick={() => setVerificationType("textmessage")}>
                Send again
              </button>{" "}
              After you have the verification code, submit it above to verify
              your account.
            </h4>
          </Fragment>
        ) : verificationType === "textmessage" ? (
          <Fragment>
            <Box position="relative" className={classes.progressbox}>
              <TextField
                className="input"
                variant="outlined"
                label="Your Phone Number"
                inputProps={{ readOnly: false, "aria-readonly": false }}
                value={mobileNumber}
                onChange={onChange}
              />
              <Button
                className="saveBtn"
                variant="contained"
                onClick={sendMessage}
                disabled={sending || !reCaptcha}
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </Box>
            {!sending && (
              <ReCAPTCHA
                className={classes.captcha}
                onChange={reCaptchaOnChange}
                sitekey={RECAPTCHA_SITE_KEY}
              />
            )}
            <h4 className={classes.vipDesc}>
              In order to verify your account, we will send a{" "}
              <b>6-digit SMS code</b> to your phone number. Please enter your
              working phone number with the corresponding country code (e.g
              +14045964682 for US number)
            </h4>
          </Fragment>
        ) : verificationType === "loyaltybadge" ? (
          <Fragment>
            <Box className={classes.loyaltyBox}>
              <Button
                className={classes.checkBtn}
                variant="contained"
                onClick={onClick}
              >
                {checking ? "Checking..." : "Check your Steam inventory"}
              </Button>
            </Box>
            <Box className={classes.loyaltyBox}>
              <img
                src="https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9Q1LO5kNoBhSQl-fV_ak2srsUVxwIgEZ5rikLgYy0KeZdTtHuoW1xteNx6LxMejTlD0BsZ0l07vHoNnw0FKy_F0sPT4FlIcnBQ"
                alt="CS:GO Loyalty Badge"
              />
              <h4>
                In order to verify your account, you must set your Steam
                inventory privacy settings to public and have{" "}
                <b>CS:GO Loyalty Badge</b> in your inventory. Click check to
                verify your account.
              </h4>
            </Box>
          </Fragment>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AccountVerificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  link: PropTypes.string,
};

export default AccountVerificationModal;
