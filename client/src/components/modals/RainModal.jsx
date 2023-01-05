import React from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../services/api.service";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";

// Custom Styles
const useStyles = makeStyles({
  modal: {
    "& div > div": {
      background: "#171a32",
      color: "#fff",
    },
  },
  captcha: {
    padding: "0 2rem",
  },
  loader: {
    width: "304px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd !important",
  },
})(CircularProgress);

const Help = ({ open, handleClose, onChange, loading }) => {
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
        Join the Rain
      </DialogTitle>
      {loading ? (
        <DialogContent>
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        </DialogContent>
      ) : (
        <ReCAPTCHA
          className={classes.captcha}
          onChange={onChange}
          sitekey={RECAPTCHA_SITE_KEY}
        />
      )}
      <DialogActions>
        {!loading && (
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Help;
