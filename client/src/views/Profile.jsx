import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserProfileData } from "../services/api.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

// Icons
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import SecurityIcon from "@material-ui/icons/Security";

// Components
import AccountVerificationModal from "../components/modals/AccountVerificationModal";

// Custom styles
const useStyles = makeStyles(theme => ({
  profile: {
    margin: "5rem 0",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      margin: "2rem 0",
    },
    "& > h1": {
      fontFamily: "Aero",
      margin: 0,
      marginBottom: "1rem",
    },
  },
  userWrap: {
    display: "flex",
    background: "#0f1229",
    borderRadius: "0.25rem",
    padding: "2rem",
    height: "8rem",
  },
  user: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "1rem",
    "& > h1": {
      margin: 0,
    },
    "& > h5": {
      margin: 0,
      textTransform: "uppercase",
      color: "#40456b",
    },
  },
  pfp: {
    height: "100%",
    width: "4rem",
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      flexDirection: "column",
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#0f1229",
      width: "19%",
      height: "7rem",
      padding: "0 2rem",
      borderRadius: "0.25rem",
      color: "#3a3f6b",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        marginBottom: 10,
      },
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
    maxHeight: "23rem",
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
    "& th": {
      borderBottom: "none",
      color: "#32375f",
      fontSize: 12,
      textTransform: "uppercase",
      paddingLeft: 0,
    },
    "& td": {
      borderBottom: "5px #0f1229 solid",
      background: "#161a36",
      color: "#6bff6b",
      fontSize: 12,
      paddingLeft: 0,
      // textShadow: "0px 0px 20px",
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
      "&:nth-child(n+1):nth-child(-n+3)": {
        color: "white",
      },
    },
  },
  notVerified: {
    background: "#0f1229",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
    "& > div": {
      margin: "0 auto 0 0",
      display: "flex",
      alignItems: "center",
    },
    "& svg": {
      marginRight: "1rem",
      color: "#4e7afd",
    },
  },
  verifyBtn: {
    backgroundColor: "#4f79fd",
    borderColor: "#FF4D4D",
    color: "white",
    padding: "0.3rem 2rem",
    transform: "skew(-20deg)",
    textTransform: "capitalize",
    marginLeft: "1rem",
    "&:hover": {
      backgroundColor: "#4f79fd",
    },
  },
  reverse: {
    transform: "skew(15deg)",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "36rem",
  },
  noTransactions: {
    width: "100%",
    textAlign: "center",
    padding: "2rem 0 1rem 0",
    color: "#3a3f6b",
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

const Profile = ({ isLoading, isAuthenticated, user }) => {
  // Declare State
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Get profile data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserProfileData();

      // Update state
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while loading user profile data:", error);
    }
  };

  // Get verbal month from js month index
  const getMonthFromIndex = index => {
    switch (index) {
      default:
      case 0:
        return "JAN";
      case 1:
        return "FEB";
      case 2:
        return "MAR";
      case 3:
        return "APR";
      case 4:
        return "MAY";
      case 5:
        return "JUN";
      case 6:
        return "JUL";
      case 7:
        return "AUG";
      case 8:
        return "SEP";
      case 9:
        return "OCT";
      case 10:
        return "NOV";
      case 11:
        return "DEC";
    }
  };

  // Parse unix timestamp to readable format
  const parseDate = timestamp => {
    const d = new Date(timestamp);
    return `${getMonthFromIndex(
      d.getMonth()
    )} ${d.getDate()}, ${d.getFullYear()}`;
  };

  // Parse numeric status to readable format
  const parseState = state => {
    switch (state) {
      default:
      case 1:
        return "Pending";
      case 2:
        return "Declined";
      case 3:
        return "Completed";
      case 4:
        return "Manual Confirmation Needed";
    }
  };

  // Open verification modal
  const onClick = () => {
    setModalVisible(state => !state);
  };

  // componentDidMount
  useEffect(() => {
    if (!isLoading && isAuthenticated) fetchData();
  }, [isLoading, isAuthenticated]);

  // If user is not logged in
  if (!isLoading && !isAuthenticated) {
    return <Redirect to="/" />;
  }

  return isLoading || !user ? (
    <div className={classes.loader}>
      <ColorCircularProgress />
    </div>
  ) : (
    <div>
      <AccountVerificationModal
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <Box>
        <Container maxWidth="lg">
          <Box className={classes.profile}>
            {!loading && !profile.hasVerifiedAccount && (
              <Box className={classes.notVerified}>
                <div>
                  <SecurityIcon />
                  <p>
                    We need additional information to verify your account. After
                    verification you can claim your free $0.5!
                  </p>
                </div>
                <Button
                  className={classes.verifyBtn}
                  size="medium"
                  color="primary"
                  variant="contained"
                  onClick={onClick}
                >
                  <span className={classes.reverse}>Verify Your Account</span>
                </Button>
              </Box>
            )}
            <h1>PROFILE</h1>
            <Box className={classes.userWrap}>
              <Avatar
                className={classes.pfp}
                src={user.avatar}
                variant="rounded"
              />
              <Box className={classes.user}>
                <Tooltip
                  interactive
                  placement="top"
                  title={`UserID: ${user._id}`}
                >
                  <h1>{user.username}</h1>
                </Tooltip>
                <h5>Registered {parseDate(user.created)}</h5>
                <h5 style={{ textTransform: "none" }}>UID: {user._id}</h5>
              </Box>
            </Box>
            <Grid className={classes.grid} container>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> GAMES PLAYED
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    parseCommasToThousands(profile.gamesPlayed)
                  )}
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> GAMES WON
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    parseCommasToThousands(profile.gamesWon)
                  )}
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> TOTAL DEPOSITED
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(profile.totalDeposited)}`
                  )}
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> TOTAL WITHDRAWN
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(profile.totalWithdrawn)}`
                  )}
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> WAGERED
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(profile.wager)}`
                  )}
                </h1>
              </Box>
            </Grid>
            <h1>TRANSACTIONS</h1>
            <Box className={classes.tran}>
              {loading ? (
                <LoadingTable />
              ) : profile.transactions.length > 1 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile.transactions.map(transaction => (
                      <TableRow key={transaction._id}>
                        <TableCell>{transaction._id}</TableCell>
                        <TableCell>{parseDate(transaction.created)}</TableCell>
                        <TableCell>{parseState(transaction.state)}</TableCell>
                        <TableCell>{transaction.action}</TableCell>
                        <TableCell
                          style={transaction.won ? { color: "#5c638f" } : {}}
                        >
                          -${transaction.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className={classes.noTransactions}>No Transactions!</div>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

const LoadingTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array(3)
          .fill()
          .map((element, index) => (
            <TableLoader key={index} />
          ))}
      </TableBody>
    </Table>
  );
};

const TableLoader = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={25} width={250} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={100} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
    </TableRow>
  );
};

Profile.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Profile);
