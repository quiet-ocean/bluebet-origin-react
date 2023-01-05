import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";

//assets
import logo from "../../assets/logo-wide.png";

const useStyles = makeStyles({
  root: {
    background: "#070A17",
    // background: "#131522",
    display: "flex",
    height: "5rem",
    justifyContent: "row",
    "& img": {
      height: "2.5rem",
      // margin: "0",
      marginLeft: "1rem",
      marginTop: "auto",
      marginBottom: "auto",
      display:"flex",
      justifyContent: "center",
    },
    
  },
  online: {
    display: "flex",
    alignItems: "center",
    marginLeft: "3em",
    color: "#3c4160",
    fontSize: 13,
    "& span": {
      marginRight: 5,
      color: "#4F79FD",
    },
    "& p": {
      marginRight: 3,
    },
  },
});

const Messages = ({usersOnline}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <img src={logo} alt="logo" />
      <Box className={classes.online} style={{color:"white"}}>
            <span>●</span>
            <p>{usersOnline}</p>
            Online
          </Box>
    </Box>
  );
};

export default Messages;
