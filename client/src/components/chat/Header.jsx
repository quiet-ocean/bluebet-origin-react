import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

//assets
import logo from "../../assets/logo-wide.png";

const useStyles = makeStyles({
  root: {
    background: "#070A17",
    // background: "#131522",
    display: "flex",
    // height: "5rem",
    height: 56,
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
    // marginLeft: "3em",
    marginLeft: 24,
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
      {/* <img src={logo} alt="logo" /> */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 12px' }}>
        <Typography style={{ display: 'flex', alignItems: 'center', color: '#fff', fontSize: 20 }}>Chat</Typography>
        <Box className={classes.online} style={{color:"white"}}>
          <span>●</span>
          <Typography>
            {usersOnline ? usersOnline : 0}&nbsp;
            Online
          </Typography>
        </Box>
      </div>
    </Box>
  );
};

export default Messages;
