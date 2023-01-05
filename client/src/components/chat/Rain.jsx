import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { chatSocket } from "../../services/websocket.service";
import { useToasts } from "react-toast-notifications";

// MUI Components
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

//Components
import RainCAPTCHA from "../modals/RainModal";

// Assets
import rain from "../../assets/rainbg.png";
import umbrella from "../../assets/umbrella.png";

// Custom styles
const useStyles = makeStyles({
  root: {
    padding: 20,
    height: "7rem",
    width: "100%",
    position: "relative",
  },
  content: {
    backgroundImage: `url(${rain})`,
    backgroundSize: "100% 100%",
    background: "#4E7AFD",
    borderRadius: 5,
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    "& img": {
      position: "absolute",
      right: 0,
      bottom: 0,
    },
  },
  join: {
    backgroundColor: "#6E92FD",
    borderColor: "#4F79FD",
    color: "white",
    transform: "skew(-20deg)",
    margin: "auto",
    marginRight: "1rem",
    fontSize: 10,
    "&:hover": {
      backgroundColor: "#8aa8ff",
    },
  },
});

const Rain = ({ rain }) => {
  // Declare state
  const classes = useStyles();
  const { addToast } = useToasts();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Open reCaptcha Modal
  const onClick = () => {
    setModalVisible(state => !state);
  };

  // Handle reCaptcha completed event
  const onChange = value => {
    setLoading(true);
    chatSocket.emit("enter-rain", value);
  };

  // componentDidMount
  useEffect(() => {
    // Handle rain joining error event
    const onError = message => {
      setLoading(false);
      addToast(message, { appearance: "error" });
      setModalVisible(state => !state);
    };

    // Handle rain joining success event
    const onSuccess = message => {
      setLoading(false);
      addToast(message, { appearance: "success" });
      setModalVisible(state => !state);
    };

    // Listeners
    chatSocket.on("rain-join-error", onError);
    chatSocket.on("rain-join-success", onSuccess);

    // componentDidUnmount
    return () => {
      // Remove Listeners
      chatSocket.off("rain-join-error", onError);
      chatSocket.off("rain-join-success", onSuccess);
    };
  }, [addToast]);

  return (
    <Slide in={rain.active} direction={"right"}>
      <Box className={classes.root}>
        <Box className={classes.content}>
          <img src={umbrella} alt="umbrella" />
          <Button
            onClick={onClick}
            className={classes.join}
            variant="contained"
          >
            Join
          </Button>

          <RainCAPTCHA
            open={modalVisible}
            handleClose={() => setModalVisible(state => !state)}
            onChange={onChange}
            loading={loading}
          />
        </Box>
      </Box>
    </Slide>
  );
};

export default Rain;
