import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  getUserVipData,
  claimRakebackBalance,
} from "../../services/api.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
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
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

// Assets
import stars from "../../assets/stars.png";

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
      [theme.breakpoints.down("sm")]: {
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
    margin: "1rem auto",
    "& > a": {
      color: "#5f679a",
      textDecoration: "none",
    },
  },
  progressbox: {
    margin: "0 1rem",
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
  progress: {
    background: "#0f101a !important",
    height: "2.5rem",
    borderRadius: "0.25rem",
    transform: "skew(-20deg)",
    "& > div": {
      background:
        "-webkit-linear-gradient( 0deg, rgb(79,121,253) 0%, rgb(110,145,255) 100%) !important",
    },
  },
  rake: {
    color: "#507afd",
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "15rem",
  },
}));

const Vip = ({ open, handleClose, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [vipData, setVipData] = useState(null);

  // Claim user vip rakeback
  const claimRakeback = async () => {
    setClaiming(true);
    try {
      const response = await claimRakebackBalance();

      // Notify user
      addToast(
        `Successfully claimed $${response.claimed.toFixed(2)} to your balance!`
      );
      changeWallet({ amount: parseFloat(response.claimed.toFixed(2)) });
    } catch (error) {
      setClaiming(false);
      console.log(
        "There was an error while claiming user rakeback balance:",
        error
      );

      // If this was user error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        addToast(
          "There was an error while claiming your rakeback balance, please try again later!"
        );
      }
    }
  };

  // componentDidMount
  useEffect(() => {
    // Fetch vip data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserVipData();

        console.log(
          data.wager -
            data.currentLevel.wagerNeeded / data.nextLevel.wagerNeeded
        );

        // Update state
        setVipData(data);
        setCompleted(
          (data.wager - data.currentLevel.wagerNeeded) /
            data.nextLevel.wagerNeeded
        );
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
        addToast(
          "There was an error while getting your VIP data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    // If modal is opened, fetch data
    if (open) fetchData();
  }, [addToast, open]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        VIP Progress
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        ) : (
          <Fragment>
            <h1 className={classes.vipTitle}>
              VIP Level <span>{vipData.currentLevel.name}</span>
            </h1>
            <Box position="relative" className={classes.progressbox}>
              <img src={stars} alt="star" />
              <LinearProgress
                className={classes.progress}
                variant="buffer"
                valueBuffer={completed * 100}
                value={completed * 100}
              />
            </Box>
            <h4 className={classes.vipDesc}>
              Your progress is a sum accumulated through your wager on every
              game mode that is against the house. Click
              <a href="https://cups.gg/"> here </a>to learn more.
            </h4>
            <Box justifyContent="center" display="flex" textAlign="center">
              <h2>
                ${parseCommasToThousands(vipData.rakebackBalance.toFixed(2))}
              </h2>
              <Button
                className={classes.rake}
                disabled={claiming}
                onClick={claimRakeback}
              >
                {claiming ? "Claiming..." : "Claim Rake"}
              </Button>
            </Box>
            <h4 className={classes.vipDesc}>
              Your current rakeback percentage is{" "}
              <a href="#!">{vipData.currentLevel.rakebackPercentage}%</a>
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

Vip.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Vip);
