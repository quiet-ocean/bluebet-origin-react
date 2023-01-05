import React, { Fragment, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
// import ScrollToBottom from "react-scroll-to-bottom";
import PropTypes from "prop-types";

// Components
import Message from "./Message";
import ModeratedMessage from "./ModeratedMessage";
import SkeletonMessage from "./SkeletonMessage";

const useStyles = makeStyles({
  root: {
    flex: "1 1",
    flexDirection: "column",
    overflowX: "hidden",
    position: "relative",
    background:"#0A0C1A",
    maskImage: "linear-gradient(0deg,rgba(0,0,0,1) 83%,rgba(0,0,0,0))",
    "& div": {
      overflowY: "scroll",
    },
  },
  box: {
    background:"#0A0C1A",
  },
  content: {
    overflowY: "hidden",
    color: "#737990",
    fontSize: 13,
    whiteSpace: "normal",
    marginTop: 5,
  },
  avatar: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  chatbox: {
    display: "flex",
    padding: "20px 0px",
    margin: "0px 15px",
    borderTop: "1px solid #2d334a42",
    fontFamily: "Roboto",
    borderRadius: 0,
    "& .message": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      "& > div": {
        display: "flex",
      },
    },
    "& .message .username": {
      color: "white",
      position: "relative",
      fontSize: 13,
    },
    "& .admin": {
      background: "#f53737",
      borderRadius: 3,
      fontSize: 8,
      marginLeft: 10,
      padding: "5px 10px",
      letterSpacing: 2,
      color: "white",
    },
    "& .mod": {
      background: "#4f79fd",
      borderRadius: 3,
      fontSize: 8,
      marginLeft: 10,
      padding: "5px 10px",
      letterSpacing: 2,
      color: "white",
    },
  },
  gif: {
    width: "100%",
    borderRadius: 5,
    marginTop: 5,
  },
});

const Messages = ({ chatMessages, loading, user }) => {
  // Declare State
  const classes = useStyles();
  const emptyDiv = useRef(null);

  // Scroll chat using ref
  const scrollChat = () => {
    // Call method on that element
    if (emptyDiv && emptyDiv.current)
      emptyDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  // When chat messages change
  useEffect(() => {
    scrollChat();
  }, [chatMessages]);

  // When messages load the first time
  useEffect(() => {
    // Set timeout for animation
    const timeout = setTimeout(() => {
      // If messages are loaded
      if (chatMessages) scrollChat();
    }, 500);

    // Clear function
    return () => {
      // Save memory and remove timeout
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [loading]);

  return (
    // <ScrollToBottom className={classes.root}>
    //   {loading
    //     ? Array(15)
    //         .fill()
    //         .map((element, index) => <SkeletonMessage key={index} />)
    //     : chatMessages.map(message =>
    //         user && user.rank >= 3 ? (
    //           <Fragment>
    //             <ModeratedMessage message={message} key={message.msgId} />
    //           </Fragment>
    //         ) : (
    //           <Message message={message} key={message.msgId} />
    //         )
    //       )}
    // </ScrollToBottom>
    <div className={classes.root}>
      <div>
        {loading
          ? Array(15)
              .fill()
              .map((element, index) => <SkeletonMessage key={index} />)
          : chatMessages.map(message =>
              user && user.rank >= 3 ? (
                <Fragment>
                  <ModeratedMessage message={message} key={message.msgId} />
                </Fragment>
              ) : (
                <Message message={message} key={message.msgId} />
              )
            )}
      </div>
      <div style={{ float: "left", clear: "both" }} ref={emptyDiv} />
    </div>
  );
};

Messages.propTypes = {
  chatMessages: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Messages);
