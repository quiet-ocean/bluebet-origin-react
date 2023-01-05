import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getRaceInformation, getRacePosition } from "../services/api.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";

// Components
import Countdown from "react-countdown";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";

// import fakeRace from "../libs/fakeRace";

// Custom Styles
const useStyles = makeStyles({
  profile: {
    margin: "5rem 0",
    color: "white",
    "& h1": {
      fontFamily: "Aero",
      margin: 0,
      marginBottom: "1rem",
      "& span": {
        margin: "0 0 0 1rem",
      },
    },
    "& h2": {},
    "& .saveBtn": {
      position: "absolute",
      right: "1rem",
      top: "0.55rem",
      width: "6rem",
      background: "#4e7afd",
      color: "white",
      "& .MuiButton-label": {
        transform: "skew(15deg)",
      },
    },
  },
  userWrap: {
    // display: "flex",
    display: "none", // MADNESS EDIT
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f1229",
    borderRadius: "0.25rem",
    padding: "2rem",
    height: "12rem",
    marginBottom: "2rem",
    "& input": {
      color: "white",
      transform: "skew(15deg)",
    },
    "& > div": {
      width: "49%",
      transform: "skew(-15deg)",
      "& > div": {
        width: "100%",
      },
    },
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    "& .earnings": {
      width: "49%",
      background: "#699958a6",
      color: "#92c68a",
      position: "relative",
      "& > button": {
        position: "absolute",
        background: "#84c46d",
        transform: "skew(-15deg)",
        color: "white",
        width: "6rem",
        right: "2rem",
        "& .MuiButton-label": {
          transform: "skew(15deg)",
        },
      },
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#0f1229",
      height: "7rem",
      padding: "0 2rem",
      borderRadius: "0.25rem",
      color: "#3a3f6b",
      "& svg": {
        marginRight: "0.25rem",
        color: "#4e7afd",
      },
      "& h1": {
        margin: 0,
        color: "white",
      },
    },
  },
  tran: {
    background: "#0f1229",
    padding: "2rem",
    paddingTop: "1rem",
    "& th": {
      borderBottom: "none",
      color: "#32375f",
      fontSize: 12,
      textTransform: "uppercase",
      paddingLeft: 0,
    },
    "& .MuiAvatar-root": {
      width: 30,
      height: 30,
    },
    "& td": {
      borderBottom: "5px #0f1229 solid",
      background: "#161a36",
      color: "white",
      fontSize: 12,
      paddingLeft: 0,
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
    },
  },
  bgInput: {
    "& .MuiOutlinedInput-root": {
      background: "rgba(44, 48, 84, 0.45)",
    },
  },
  noRace: {
    height: "23rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& h3": {
      color: "#4b547f",
    },
  },
});

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span>Ended!</span>;
  } else {
    // Render a countdown
    return (
      <span>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};

const Race = ({ isAuthenticated, isLoading }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [activeRace, setActiveRace] = useState(null);
  const [topWinners, setTopWinners] = useState(null);
  const [personalPosition, setPersonalPosition] = useState(0);
  const [personalProgress, setPersonalProgress] = useState(0);
  const [prizeDistribution, setPrizeDistribution] = useState([]);

  // componentDidMount
  useEffect(() => {
    // Fetch public data from the api
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRaceInformation();

        // If race is active
        if (response.active) {
          // Update state
          setTopWinners(response.topTen);
          setActiveRace(response.activeRace);
          setPrizeDistribution(response.prizeDistribution);
          setLoading(false);
        } else {
          // Update state
          setActiveRace(null);
          setLoading(false);
        }
      } catch (error) {
        console.log("There was an error while loading race data:", error);
        addToast(
          "There was an error while loading race data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    // Fetch public data
    fetchData();
  }, [addToast]);

  // When user is loaded, fetch personal data
  useEffect(() => {
    // Fetch personal data from the api
    const fetchPersonalData = async () => {
      setLoadingPersonal(true);
      try {
        const response = await getRacePosition();

        // If race is active
        if (response.active) {
          // Update state
          setPersonalPosition(response.myPosition);
          setPersonalProgress(response.myProgress);
        }

        // Update state
        setLoadingPersonal(false);
      } catch (error) {
        console.log("There was an error while loading your race data:", error);
        addToast(
          "There was an error while loading your race data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    if (!isLoading && isAuthenticated) fetchPersonalData();
  }, [isAuthenticated, isLoading, addToast]);

  return (
    <div>
      <Box>
        <Container maxWidth="lg">
          <Box className={classes.profile}>
            <Box display="flex">
              <h1>
                RACE
                {!loading && activeRace && (
                  <Countdown
                    date={new Date(activeRace.endingDate)}
                    renderer={renderer}
                  />
                )}
              </h1>
              <h1 style={{ marginLeft: "auto", color: "#4f79fd" }}>
                {loading ? (
                  <Skeleton
                    width={80}
                    height={40}
                    variant="rect"
                    animation="wave"
                  />
                ) : (
                  activeRace &&
                  `$${parseCommasToThousands(activeRace.prize.toFixed(2))}`
                )}
              </h1>
            </Box>
            <Box className={classes.userWrap}>
              {loadingPersonal ? (
                "Loading your statistics..."
              ) : !isLoading && !isAuthenticated ? (
                "Sign in to enter the race!"
              ) : !activeRace ? (
                "No active race currently"
              ) : personalPosition === -1 ? (
                "Enter the race and win"
              ) : (
                <span>
                  Your position in the race:{" "}
                  <b>{parseCommasToThousands(personalPosition)}</b>
                  <br />
                  You have wagered{" "}
                  <b>${parseCommasToThousands(personalProgress)}</b> to the
                  race!
                </span>
              )}
            </Box>

            {loading ? (
              <LoadingTable />
            ) : activeRace ? (
              <Fragment>
                <h1>TOP 10 WINNERS</h1>
                <Box className={classes.tran}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>USER</TableCell>
                        <TableCell>TOTAL WAGERED</TableCell>
                        <TableCell>PRIZE</TableCell>
                        <TableCell>PLACE</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topWinners.map((entry, index) => {
                        return (
                          <TableRow>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src={entry._user.avatar}
                                  variant="rounded"
                                />
                                <Box ml="1rem">{entry._user.username}</Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              ${parseCommasToThousands(entry.value.toFixed(2))}
                            </TableCell>
                            <TableCell style={{ color: "#40ff40" }}>
                              $
                              {parseCommasToThousands(
                                (
                                  activeRace.prize *
                                  (prizeDistribution[index] / 100)
                                ).toFixed(2)
                              )}
                            </TableCell>
                            <TableCell>#{index + 1}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Fragment>
            ) : (
              <Box className={classes.noRace}>
                <h3>No currently active race!</h3>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </div>
  );
};

// Loading table component
const LoadingTable = () => {
  // Declare State
  const classes = useStyles();

  return (
    <Fragment>
      <h1>TOP 10 WINNERS</h1>
      <Box className={classes.tran}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USER</TableCell>
              <TableCell>TOTAL WAGERED</TableCell>
              <TableCell>PRIZE</TableCell>
              <TableCell>PLACE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array(10)
              .fill()
              .map((element, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Skeleton
                        animation="wave"
                        variant="rect"
                        height={30}
                        width={30}
                      />
                      <Skeleton
                        style={{ marginLeft: "1rem" }}
                        animation="wave"
                        width="100%"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton width="100%" animation="wave" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="100%" animation="wave" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="100%" animation="wave" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </Fragment>
  );
};

Race.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps)(Race);
