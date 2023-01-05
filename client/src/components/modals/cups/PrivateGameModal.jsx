import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PropTypes from "prop-types";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

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
}));

const PrivateGameModal = ({ open, handleClose, link }) => {
  // Declare State
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Private Game Created!
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <TextField
            className="input"
            variant="outlined"
            label="Invite Link"
            inputProps={{ readOnly: false, "aria-readonly": false }}
            value={link || ""}
          />
          <CopyToClipboard text={link || ""} onCopy={() => setCopied(true)}>
            <Button className="saveBtn" variant="contained">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </CopyToClipboard>
        </Box>
        <h4 className={classes.vipDesc}>
          You've created private cups game, it will not be listed in the public
          games list. Share this link to people you want to invite!
        </h4>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PrivateGameModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  link: PropTypes.string,
};

export default PrivateGameModal;
