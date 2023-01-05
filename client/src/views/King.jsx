import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import {
  getActiveKingGames,
  getKingPrivateGame,
  getUserPrivateKingGames,
} from "../services/api.service";
import { kingSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Popover from "@material-ui/core/Popover";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";

// Components
import Game from "../components/king/Game";
import RoundSkeleton from "../components/RoundSkeleton";
import PrivateGameModal from "../components/modals/king/PrivateGameModal";

// import fakeBets from "../libs/fakeBets";

// Custom Styled Component
const AntSwitch = withStyles(theme => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#4f79fd",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    borderRadius: 16 / 2,
    opacity: 0.5,
    backgroundColor: "#57618d",
  },
  checked: {},
}))(Switch);

// Custom Styled Component
const BetInput = withStyles({
  root: {
    width: "10rem",
    marginTop: "auto",
    marginRight: "1rem",
    transform: "skew(-20deg)",
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
      transform: "skew(20deg)",
    },
    "& div input": {
      color: "#fff",
      padding: "0.5rem 1rem",
      transform: "skew(20deg)",
    },
    "& div": {
      background: "#171A28",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);

// Custom Styled Component
const ArrowTop = withStyles({
  root: {
    margin: "auto",
    position: "absolute",
    top: -5,
    left: 135,
    width: 0,
    height: 0,
    borderLeft: "20px solid transparent",
    borderRight: "20px solid transparent",
    borderBottom: "20px solid #181c2c",
  },
})(Box);

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      paddingTop: 37,
      paddingLeft: 12,
      paddingRight: 12,
    },
  },
  container: {
    width: "100%",
    minHeight: "32.5rem",
    paddingTop: 50,
    paddingBottom: 120,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 0,
    },
  },
  box: {
    marginBottom: 5,
  },
  round: {
    display: "flex",
    height: "10rem",
    width: "100%",
    marginBottom: 10,
    border: "1px solid #111729",
    borderRadius: 5,
  },
  logo: {
    fontSize: 20,
    color: "white",
    fontFamily: "Aero",
    letterSpacing: 2,
  },
  provably: {
    background: "#111729",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "3rem",
    "& span": {
      color: "#232b42",
    },
    "& svg": {
      transform: "rotate(45deg)",
    },
  },
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    alignItems: "center",
    justifyContent: "center",
    "& h1": {
      margin: 0,
      color: "white",
      fontSize: 20,
      fontWeight: "100",
    },
    "& h3": {
      margin: 0,
      fontSize: 12,
      color: "#191c30",
    },
  },
  players: {
    width: "15rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  player: {
    display: "flex",
    color: "white",
    alignItems: "center",
    "& img": {
      width: "2rem",
      height: "auto",
      marginRight: "1rem",
    },
    "& span": {
      marginLeft: "1rem",
    },
  },
  controls: {
    background: "#080b19",
    padding: "1rem 3rem",
    paddingTop: 0,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "2.25rem",
  },
  create: {
    backgroundColor: "#4f79fd",
    borderColor: "#FF4D4D",
    color: "white",
    padding: "0 2rem",
    transform: "skew(-20deg)",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#4f79fd",
    },
  },
  multiplier: {
    backgroundColor: "#181B2B",
    borderColor: "#181B2B",
    color: "white",
    transform: "skew(-20deg)",
    marginRight: 10,
  },
  result: {
    background: "#070A15",
    width: "110%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  reverse: {
    transform: "skew(15deg)",
  },
  private: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "montserrat",
    fontSize: 12,
    color: "#2c314b",
    "& > span:nth-child(2)": {
      marginLeft: 10,
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0,
        display: "none",
      },
    },
    "& > span:nth-child(1)": {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  },
  popover: {
    marginTop: 10,
    position: "relative",
    "& > .MuiPopover-paper": {
      background: "#181c2c",
      color: "white",
      width: 300,
      overflow: "visible",
      padding: "1rem 2rem",
    },
    "& .MuiSlider-markLabel": {
      color: "white",
      opacity: 0.5,
      transition: "0.5s ease",
      fontSize: 10,
    },
    "& .MuiSlider-markLabelActive": {
      color: "white",
      opacity: 1,
      transition: "0.5s ease",
      fontSize: 12,
    },
  },
  noGames: {
    display: "flex",
    flexDirection: "column",
    height: "40rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#373e6f",
  },
}));

const King = ({ user, match, history, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [privateGame, setPrivateGame] = useState(false);
  const [betAmount, setBetAmount] = useState("0");
  const [costMultiplier, setCostMultiplier] = useState(0);
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [privateLink, setPrivateLink] = useState(null);
  const [games, setGames] = useState([]);

  // TextField onChange event handler
  const onChange = e => {
    const value = e.target.value;
    setBetAmount(value);
  };

  // Slider onChange event handler
  const sliderOnChange = (e, newValue) => {
    setCostMultiplier(newValue);
  };

  // Button onClick event handler
  const onClick = () => {
    setCreating(true);
    kingSocket.emit(
      "create-new-game",
      parseFloat(betAmount),
      privateGame,
      costMultiplier / 100
    );
  };

  // Add new public game
  const addGame = game => {
    setCreating(false);
    setGames(state => (state ? [game, ...state] : null));
  };

  // Show private game invite link
  const addPrivateGame = inviteLink => {
    setCreating(false);
    setPrivateLink(inviteLink);
    setPrivateGameModalVisible(true);
  };

  // Game was joined (started)
  const gameJoined = game => {
    // Update state
    setGames(state =>
      state.map(entry =>
        entry._id === game._id
          ? {
              ...entry,
              status: 3,
              _opponent: game._opponent,
              roundNumber: entry.roundNumber + 1,
            }
          : entry
      )
    );
  };

  // New round was generated
  const newRound = game => {
    // Update state
    setGames(state =>
      state.map(entry =>
        entry._id === game._id
          ? {
              ...entry,
              status: 2,
              nextAutoChoose: Date.now() + game.autoChooseTimeout,
            }
          : entry
      )
    );
  };

  // Game updated some other way
  const gameUpdated = game => {
    // Update state
    setGames(state =>
      state.map(entry =>
        entry._id === game._id ? { ...entry, ...game } : entry
      )
    );
  };

  // componentDidMount
  useEffect(() => {
    // Fetch active games from the API
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getActiveKingGames();

        // Update state
        setGames(games);
        setLoading(false);
      } catch (error) {
        addToast(
          "There was an error while loading games data, please try again later!",
          { appearance: "error" }
        );
        console.log("There was an error while loading king games:", error);
      }
    };

    // Fetch private game data from API
    const fetchPrivateGameData = async inviteCode => {
      setLoading(true);
      try {
        const game = await getKingPrivateGame(inviteCode);

        // Update State
        setGames([game]);
        setLoading(false);
      } catch (error) {
        // If game was not found
        if (error.response && error.response.status === 400) {
          addToast("Couldn't find any active games with that invite link!", {
            appearance: "error",
          });
          history.push("/king");
        } else {
          addToast(
            "There was an error while loading that private game data, please try again later!",
            { appearance: "error" }
          );
          history.push("/king");
        }
        console.log(
          "There was an error while loading private king game data:",
          error
        );
      }
    };

    // There was an error while creating a game
    const creationError = msg => {
      // Update state
      setCreating(false);

      addToast(msg, { appearance: "error" });
    };

    // If game id was passed (private game route)
    if (match.params.inviteCode) {
      // Fetch private game data
      fetchPrivateGameData(match.params.inviteCode);
    } else {
      // Fetch games when component mounts
      fetchData();
    }

    // Listeners
    kingSocket.on("game-creation-error", creationError);
    kingSocket.on("private-game-created", addPrivateGame);
    kingSocket.on("new-king-game", addGame);
    kingSocket.on("game-joined", gameJoined);
    kingSocket.on("new-round", newRound);
    kingSocket.on("game-updated", gameUpdated);
    // kingSocket.on("game-rolling", gameRolling);

    // componentDidUnmount
    return () => {
      // Remove listeners
      kingSocket.off("game-creation-error", creationError);
      kingSocket.off("private-game-created", addPrivateGame);
      kingSocket.off("new-king-game", addGame);
      kingSocket.off("game-joined", gameJoined);
      kingSocket.off("new-round", newRound);
      kingSocket.off("game-updated", gameUpdated);
      // kingSocket.off("game-rolling", gameRolling);
    };
    // eslint-disable-next-line
  }, [addToast, match.params]);

  // When user is loaded, fetch private games
  useEffect(() => {
    // Fetch private games from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getUserPrivateKingGames();

        // Update state
        setGames(state => [...games, ...state]);
        setLoading(false);
      } catch (error) {
        addToast(
          "There was an error while loading your private games data, please try again later!",
          { appearance: "error" }
        );
        console.log(
          "There was an error while loading private king games:",
          error
        );
      }
    };

    // If game id was not passed (general route)
    if (!match.params.inviteCode && isAuthenticated) {
      fetchData();
    }
  }, [addToast, isAuthenticated, match.params]);

  return (
    <div>
      <PrivateGameModal
        open={privateGameModalVisible}
        handleClose={() => setPrivateGameModalVisible(state => !state)}
        link={privateLink}
      />
      <Toolbar variant="dense" className={classes.controls}>
        <Box className={classes.logo}>
          KING
          <br />
          <Box className={classes.private}>
            <span>Private Game</span>
            <AntSwitch
              checked={privateGame}
              onChange={event => {
                if (!privateGame) setAnchorEl(event.currentTarget);
                setPrivateGame(state => !state);
              }}
              name="checkedC"
            />
          </Box>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            className={classes.popover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <ArrowTop />
            <Box
              marginTop="9px"
              width="100%"
              textAlign="center"
              fontSize="10px"
            >
              TAKE OVER COMPETITOR'S COSTS
            </Box>
            <Slider
              defaultValue={20}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              marks={marks}
              onChange={sliderOnChange}
              value={costMultiplier}
            />
          </Popover>
        </Box>
        <Box className={classes.right}>
          <BetInput
            label=""
            variant="filled"
            onChange={onChange}
            value={betAmount}
          />
          <Button
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() =>
              setBetAmount(state => (parseFloat(state) / 2).toFixed(2))
            }
          >
            <span className={classes.reverse}>1/2</span>
          </Button>
          <Button
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() =>
              setBetAmount(state => (parseFloat(state) * 2).toFixed(2))
            }
          >
            <span className={classes.reverse}>2x</span>
          </Button>
          <Button
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => setBetAmount(user ? user.wallet : 0)}
          >
            <span className={classes.reverse}>Max</span>
          </Button>
          <Button
            className={classes.create}
            size="medium"
            color="primary"
            variant="contained"
            onClick={onClick}
          >
            <span className={classes.reverse}>
              {creating ? (
                "Creating..."
              ) : (
                <Fragment>
                  Create Game{" "}
                  {privateGame &&
                  costMultiplier &&
                  !isNaN(betAmount) &&
                  !isNaN(costMultiplier)
                    ? `($${(
                        (parseFloat(betAmount) || 0) +
                        betAmount * (costMultiplier / 100)
                      ).toFixed(2)})`
                    : ""}
                </Fragment>
              )}
            </span>
          </Button>
        </Box>
      </Toolbar>

      <Box className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <div style={{ width: "100%" }}>
              {loading ? (
                <RoundSkeleton />
              ) : games.length > 0 ? (
                <div style={{ width: "100%" }}>
                  {games.map(game => (
                    <Game key={game._id} game={game} />
                  ))}
                </div>
              ) : (
                <Container className={classes.noGames}>
                  <p>No currently active games!</p>
                </Container>
              )}
            </div>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

King.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(King);
