import React from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles({
  content: {
    overflowY: "hidden",
    color: "#737990",
    fontSize: 13,
    whiteSpace: "normal",
    marginTop: 5,
  },
  avatar: {
    // width: 25,
    // height: 25,
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

const SkeletonMessage = () => {
  // Declare state
  const classes = useStyles();

  // Random number helper
  const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Randomly generate skeleton chat message
  const message = {
    contentLength: randomIntFromInterval(3, 255),
    isGif: Math.random() < 0.5,
    user: {
      usernameLength: randomIntFromInterval(5, 16),
      rank: 1,
    },
  };

  return (
    <Box className={classes.chatbox}>
      <Skeleton
        variant="rect"
        className={classes.avatar}
        width={25}
        height={25}
      />
      <div className="message">
        {message.user.rank === 5 ? (
          <Box>
            <div className="username">
              <Skeleton
                variant="text"
                width={message.user.usernameLength}
                height={5}
              />
            </div>
            <div className="admin">
              <Skeleton
                variant="text"
                className={classes.avatar}
                width={10}
                height={5}
              />
            </div>
          </Box>
        ) : (
          <div className="username">
            <Skeleton
              variant="text"
              width={message.user.usernameLength}
              height={5}
            />{" "}
            {message.user.rank === 4 && (
              <Skeleton
                variant="text"
                className={classes.avatar}
                width={7}
                height={5}
              />
            )}
          </div>
        )}
        {/* {message.isGif ? (
          <div className={classes.content}>
            <Skeleton variant="rect" width={210} height={210} />
          </div>
        ) : (
        )} */}
        <div className={classes.content}>
          {Array(Math.round(message.contentLength / 30))
            .fill()
            .map((element, index) => (
              <Skeleton key={index} variant="text" width={38} height={5} />
            ))}
        </div>
      </div>
    </Box>
  );
};

export default SkeletonMessage;
