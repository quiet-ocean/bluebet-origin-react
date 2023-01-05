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
    },
  },
});

const ChatRulesModal = ({ open, handleClose }) => {
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
        Chat Rules
      </DialogTitle>
      <DialogContent dividers>
        <p>1 - No racism allowed in chat whether its a word or a gif</p>
        <p>2 - Do not advertise other sites</p>
        <p>3 - Do not promote your affiliate code in chat</p>
        <p>4 - Do not spam</p>
        <p>5 - Do not talk about bans / mutes in chat</p>
        <p>6 - You can also report mods by making a ticket</p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatRulesModal;
