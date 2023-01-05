import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserAffiliatesData,
  updateUserAffiliateCode,
  claimUserAffiliateEarnings,
} from "../services/api.service";
import { Redirect } from "react-router-dom";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { useToasts } from "react-toast-notifications";
import { changeWallet } from "../actions/auth";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";

// import fakeUser from "../libs/fakeUser";

// Custom Styles
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f1229",
    borderRadius: "0.25rem",
    padding: "2rem",
    height: "fit-content",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "& input": {
      color: "white",
      transform: "skew(15deg)",
    },
    "& label": {
      color: "#fff",
    },
    "& label.Mui-focused": {
      color: "#4e7afd",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#4e7afd",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#212549",
      },
      "&:hover fieldset": {
        borderColor: "#212549",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4e7afd",
      },
    },
    "& > div": {
      width: "49%",
      transform: "skew(-15deg)",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginBottom: 10,
      },
      "& > div": {
        width: "100%",
      },
    },
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "& .stats": {
      width: "24%",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        width: "100%",
        marginTop: 10,
      },
    },
    "& .earnings": {
      width: "49%",
      background: "#699958a6",
      color: "#92c68a",
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        fontSize: 10,
      },
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
    [theme.breakpoints.down("sm")]: {
      padding: "1rem",
    },
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
  desktop: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "36rem",
  },
  noAffiliates: {
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

const Affiliates = ({ isAuthenticated, isLoading, user, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [affiliatesData, setAffiliatesData] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState("Loading...");

  // Get affiliates data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserAffiliatesData();

      // Update state
      setAffiliatesData(data);
      setAffiliateCode(data.affiliateCode);
      setLoading(false);
    } catch (error) {
      console.log(
        "There was an error while loading user affiliates data:",
        error
      );
    }
  };

  // Save user affiliate code
  const saveAffiliateCode = async () => {
    setSaving(true);
    try {
      const response = await updateUserAffiliateCode(affiliateCode);

      // Update state
      setSaving(false);
      setAffiliateCode(response.newAffiliateCode);
      setAffiliatesData(state =>
        state ? { ...state, affiliateCode: response.newAffiliateCode } : null
      );
      addToast("Successfully updated your affiliate code!", {
        appearance: "success",
      });
    } catch (error) {
      setSaving(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        console.log(
          "There was an error while updating user affiliate code:",
          error
        );
        addToast(
          "There was an error while updating your affiliate code. Please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  // Claim user affiliate earnings
  const claimEarnings = async () => {
    setClaiming(true);
    try {
      const response = await claimUserAffiliateEarnings();

      // Update state
      setClaiming(false);
      setAffiliatesData(state =>
        state ? { ...state, affiliateMoneyAvailable: 0 } : null
      );
      addToast(`Successfully claimed ${response.claimedAmount} credits!`, {
        appearance: "success",
      });

      // Update redux state
      changeWallet({ amount: response.claimedAmount });
    } catch (error) {
      setClaiming(false);

      // Check if user caused this error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        console.log(
          "There was an error while claiming user affiliate earnings:",
          error
        );
        addToast(
          "There was an error while claiming your affiliate earnings. Please try again later!",
          { appearance: "error" }
        );
      }
    }
  };

  // Input onChange event handler
  const onChange = (e, newValue) => {
    setAffiliateCode(e.target.value);
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
      <Box>
        <Container maxWidth="lg">
          <Box className={classes.profile}>
            <h1>AFFILIATES</h1>
            <Box className={classes.userWrap}>
              <Box position="relative">
                <TextField
                  className={classes.bgInput}
                  variant="outlined"
                  label="YOUR AFFILIATE CODE"
                  disabled={loading}
                  value={affiliateCode}
                  onChange={onChange}
                />
                <Button
                  className="saveBtn"
                  variant="contained"
                  disabled={saving || loading}
                  onClick={saveAffiliateCode}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </Box>
              <TextField
                className={classes.bgInput}
                variant="outlined"
                label="YOUR AFFILIATE LINK"
                disabled={loading}
                value={loading ? "Loading..." : affiliatesData.affiliateLink}
                onFocus={e => e.target.select()}
              />
            </Box>

            <Grid className={classes.grid} container>
              <Box className="earnings">
                YOUR AVAILABLE EARNINGS
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(
                      affiliatesData.affiliateMoneyAvailable.toFixed(2)
                    )}`
                  )}
                </h1>
                <Button
                  variant="contained"
                  onClick={claimEarnings}
                  disabled={claiming || loading}
                >
                  {claiming ? "Claiming..." : "Claim"}
                </Button>
              </Box>
              <Box className="stats">
                TOTAL EARNED
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(
                      affiliatesData.affiliateMoney.toFixed(2)
                    )}`
                  )}
                </h1>
              </Box>
              <Box className="stats">
                AFFILIATED USERS
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    parseCommasToThousands(affiliatesData.usersAffiliated)
                  )}
                </h1>
              </Box>
            </Grid>

            <h1>AFFILIATED USERS</h1>
            <Box className={classes.tran}>
              {loading ? (
                <LoadingTable />
              ) : affiliatesData.affiliatedUsers.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Total Wager</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {affiliatesData.affiliatedUsers.map(user => {
                      return (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar src={user.avatar} variant="rounded" />
                              <Box ml="1rem" className={classes.desktop}>
                                {user.username}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>${user.wager.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className={classes.noAffiliates}>
                  No Affiliated Users :(
                </div>
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
          <TableCell>User</TableCell>
          <TableCell>Total Wager</TableCell>
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
  // Declare State
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Skeleton height={30} width={30} variant="rect" animation="wave" />
          <Box ml="1rem" className={classes.desktop}>
            <Skeleton animation="wave" height={25} width={50} />
          </Box>
        </Box>
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
    </TableRow>
  );
};

Affiliates.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Affiliates);
