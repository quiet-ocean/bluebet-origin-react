import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Assets
import cups from "../assets/logo.png";

// Custom styles
const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
    display: "block",
    textAlign: "left",
    padding: "3rem 5rem",
    color: "#e1e4e8",
  },
  a: {
    color: "#4f79fd !important",
    textDecoration: "none",
    "&:hover": {
      color: "#333",
      textDecoration: "none",
    },
  },
  h1: {
    fontSize: "50px",
  },
  img: {
    height: "3rem",
  },
}));

const Outdated = () => {
  // Declare State
  const classes = useStyles();

  return (
    <article className={classes.root}>
      <img src={cups} className={classes.img} alt="Cups.gg Logo" />
      <h1 className={classes.h1}>Oops, running late!</h1>
      <div>
        <p>
          We have detected that you are running a outdated version of the site.
          To ensure the best experience you must be using the latest version.
          <br />
          If you don't know what this means, you most certainly just need to
          refresh this page couple of times.
        </p>
      </div>
    </article>
  );
};

export default Outdated;
