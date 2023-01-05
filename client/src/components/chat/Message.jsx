import React from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

// Declare useful variables
const GIPHY_URLS = [
  "https://media.giphy.com",
  "https://media0.giphy.com",
  "https://media1.giphy.com",
  "https://media2.giphy.com",
  "https://media3.giphy.com",
];

const useStyles = makeStyles({
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
    "& .dev": {
      background: "#ebb734",
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

const Message = ({ message }) => {
  // Declare state
  const classes = useStyles();

  // Check if message contains a GIF
  const checkIfContainsGif = msg => {
    return GIPHY_URLS.filter(url => msg.includes(url)).length > 0;
  };

  return (
    <Box className={classes.chatbox}>
      <Avatar
        variant="rounded"
        src={message.user.avatar}
        className={classes.avatar}
      />
      <div className="message">
        {message.user.rank === 5 ? (
          <Box>
            <div className="username">{message.user.username}</div>
            <div className="admin">ADMIN</div>
          </Box>
        ) : (
          <div className="username">
            {message.user.username}{" "}
            {message.user.rank === 4 && <span className="mod">MOD</span>}
            {message.user.rank === 3 && <span className="dev">DEVELOPER</span>}
          </div>
        )}
        {checkIfContainsGif(message.content) ? (
          <div className={classes.content}>
            <img
              className={classes.gif}
              src={message.content}
              alt={message.content}
            />
          </div>
        ) : (
          <div className={classes.content}>{message.content}</div>
        )}
      </div>
    </Box>
  );
};

export default Message;
