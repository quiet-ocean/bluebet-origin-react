import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

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
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#3a3f64",
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      background: "#141629",
    },
    "& .MuiFormHelperText-root.Mui-disabled": {
      color: "#4960ed",
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

const Field = withStyles({
  root: {
    width: "100%",
    marginBottom: 20,
    "& label": {
      color: "#5562cd",
    },
    "& label.Mui-focused": {
      color: "#5562cd",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#5562cd",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#5562cd",
      },
      "&:hover fieldset": {
        borderColor: "#5562cd",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#5562cd",
      },
    },
  },
})(TextField);

const Provably = ({ open, handleClose, game }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Provably Fair
      </DialogTitle>
      <DialogContent dividers>
        <Field
          className={classes.field}
          label="Round ID"
          value={game._id}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Private Hash"
          value={game.privateHash}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Private Seed"
          value={game.privateSeed ? game.privateSeed : "Not Revealed"}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Public Seed"
          value={game.publicSeed ? game.publicSeed : "Not Generated"}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Round Ticket"
          value={game.randomModule ? game.randomModule : "Not Picked"}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Provably;
