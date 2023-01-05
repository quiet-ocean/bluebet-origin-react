import PropTypes from "prop-types";
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { changeWallet } from "./actions/auth";
import { sockets } from "./services/websocket.service";

const EventHandler = withRouter(({ changeWallet, history }) => {
  const { addToast } = useToasts();

  // componentDidMount
  useEffect(() => {
    // Show success toast notification to user
    const notifySuccess = msg => {
      addToast(msg, { appearance: "success" });
    };

    // Show error toast notification to user
    const notifyError = msg => {
      addToast(msg, { appearance: "error" });
    };

    // Show connection error message
    const connectError = () =>
      notifyError("Lost connection to the server, reconnecting...");

    // Show connection kicked message
    const socketKicked = () =>
      notifyError(
        "You have been temporarily kicked for spammy behaviour. Please refresh the page!"
      );

    // Change wallet amount
    const updateWallet = amount => changeWallet({ amount });

    // User was banned
    const userBanned = () => history.push("/banned");

    // Listeners
    sockets.forEach((socket, index) => {
      // For the first socket only
      if (index === 0) socket.on("connect_error", connectError);

      socket.on("connection_kicked", socketKicked);
      socket.on("notify-error", notifyError);
      socket.on("notify-success", notifySuccess);
      socket.on("update-wallet", updateWallet);
      socket.on("user banned", userBanned);
    });

    // componentDidUnmount
    return () => {
      // Remove listeners
      sockets.forEach((socket, index) => {
        // For the first socket only
        if (index === 0) socket.off("connect_error", connectError);

        socket.off("connection_kicked", socketKicked);
        socket.off("notify-error", notifyError);
        socket.off("notify-success", notifySuccess);
        socket.off("update-wallet", updateWallet);
        socket.off("user banned", userBanned);
      });
    };

    // eslint-disable-next-line
  }, [addToast, changeWallet]);

  return null;
});

EventHandler.propTypes = {
  changeWallet: PropTypes.func.isRequired,
  history: PropTypes.object,
};

export default connect(() => ({}), { changeWallet })(EventHandler);
