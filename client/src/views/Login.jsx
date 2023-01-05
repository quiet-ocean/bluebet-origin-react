import React, { useState, Fragment, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { withRouter, Redirect } from "react-router-dom";
import { API_URL } from "../services/api.service";
import { exchangeTokens } from "../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

// Custom Styles
const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "50rem",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#373e6f",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      fontSize: 75,
      margin: 0,
    },
  },
  h2: {
    marginBottom: "3rem",
  },
  error: {
    color: red["A200"],
  },
  p: {
    marginTop: "2rem",
  },
});

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

const Login = ({
  match,
  location,
  isAuthenticated,
  isLoading,
  exchangeTokens,
}) => {
  // Declare state
  const classes = useStyles();
  const [error, setError] = useState("");
  const [authState, setAuthState] = useState("");

  // Get token from search query
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  // componentDidMount
  useEffect(() => {
    // Exchange tokens
    const fetchData = async token => {
      try {
        // Exchange tokens and login the user
        exchangeTokens({ idToken: token });
      } catch (error) {
        console.log("Error while exchanging token:", error);
        if (error.response && error.response.data && error.response.data.error)
          setError(error.response.data.error);
        else setError(error.message);
      }
    };

    // If identifier token is provided, exchange it
    if (token) {
      setAuthState("Authenticating...");
      fetchData(token);
    } else if (!isAuthenticated && !isLoading) {
      setAuthState("Redirecting...");
      window.location.replace(`${API_URL}/auth/${match.params.provider}`);
    }
  }, [
    exchangeTokens,
    isAuthenticated,
    isLoading,
    token,
    match.params.provider,
  ]);

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        {error ? (
          <h3 className={classes.error}>{error}</h3>
        ) : (
          <Fragment>
            {/* <h2 className={classes.h2}>Authenticating....</h2> */}
            <ColorCircularProgress />
            <p className={classes.p}>{authState}</p>
          </Fragment>
        )}
      </Container>
    </Box>
  );
};

Login.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  exchangeTokens: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps, { exchangeTokens })(withRouter(Login));
