import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getRouletteSchema } from "../services/api.service";
import { rouletteSocket } from "../services/websocket.service";
import Spritesheet from "react-responsive-spritesheet";
import Countdown from "react-countdown";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

// Components
import Bets from "../components/roulette/Bets";
import Wheel from "../components/roulette/Wheel";
import HistoryEntry from "../components/roulette/HistoryEntry";

// Assets
import timer from "../assets/timer.png";
import ani2Cup from "../assets/2xAni.png";
import ani3Cup from "../assets/3xAni.png";
import ani4Cup from "../assets/4xAni.png";

// import fakeBets from "../libs/fakeBets"

const TILE_COUNT = 54;

// Custom Styled Component
const BetInput = withStyles({
  root: {
    marginTop: "auto",
    transform: "skew(-20deg)",
    marginRight: 10,
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
      // background: "#171A28",
      background: "#1e234a",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);

// Custom Styled Component
const Arrow = withStyles({
  root: {
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "30px solid #ffe292",
    position: "absolute",
    top: "1.5rem",
    zIndex: 1000,
    transition: "0.25s ease",
    opacity: props => props.opacity,
  },
})(Box);

// Custom Styled Component
const Prize = withStyles({
  root: {
    position: "absolute",
    fontSize: 60,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    textShadow: "0px 0px 20px black",
    margin: "auto",
    fontWeight: "bold",
    color: "gold",
    opacity: props => props.opacity,
    transition: "0.25s ease",
  },
})(Box);

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%",
    paddingTop: 50,
    paddingBottom: 120,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 25,
    },
    "& > div > div": {
      justifyContent: "space-around",
    },
  },
  box: {
    marginBottom: 5,
  },
  logo: {
    fontSize: 20,
    color: "white",
    fontFamily: "Aero",
    letterSpacing: 2,
    [theme.breakpoints.down("xs")]: {
      fontSize: 15,
      marginTop: 5,
    },
  },
  countdown: {
    fontSize: 15,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  controls: {
    overflow: "visible",
    background: "#080b19",
    padding: "1rem 3rem",
    paddingTop: 0,
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "2.25rem",
    alignItems: "center",
    maxWidth: "56rem",
    maskImage: "linear-gradient(240deg,rgba(0,0,0,1) 34%,rgba(0,0,0,0))",
    overflow: "hidden",
  },
  game: {
    display: "flex",
    width: "56%",
    height: "75vh",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  bets: {
    display: "flex",
    background: "#111429",
    width: "43%",
    height: "75vh",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  info: {
    width: "100%",
    display: "flex",
    height: "4rem",
    background: "#1b1e36",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  wheel: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    margin: "auto",
    position: "relative",
    overflow: "hidden",
    background: "#111429",
    marginTop: 5,
    borderRadius: 5,
    transition: "1s ease",
    maskImage: "linear-gradient(180deg,rgba(0,0,0,1) 33%,rgba(0,0,0,0) 90%)",
  },
  disabled: {
    opacity: 0.25,
    transition: "0.25s ease",
    pointerEvents: "none",
    cursor: "not-allowed",
  },
  regular: {
    opacity: 1,
    transition: "0.25s ease",
    pointerEvents: "all",
    cursor: "pointer",
  },
  placeBet: {
    background: "#111429",
    borderRadius: 5,
    "& > div": {
      //transform: 'perspective(250px) rotateX(20deg) scale(0.85)',
    },
    "& > div > div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      "&:nth-child(1)": {
        "& button:nth-child(1)": {
          background: "#eacc34",
        },
        "& button:nth-child(2)": {
          background: "#1d69ef",
        },
        "& button:nth-child(3)": {
          background: "#b157ce",
        },
      },
      "&:nth-child(2)": {
        "& button:nth-child(1)": {
          background: "#48c92d",
        },
        "& button:nth-child(2)": {
          background: "#e8511e",
        },
        "& button:nth-child(3)": {
          background: "#ff5656",
        },
      },
    },
    "& button": {
      width: "30.5%",
      color: "white",
      fontSize: 15,
      transition: "0.25s ease",
      opacity: 0.75,
      "&:hover": {
        textShadow: "0px 0px 10px",
        opacity: 1,
      },
    },
    animation: {
      [theme.breakpoints.down("xs")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(0.2)",
        },
      },
      [theme.breakpoints.up("sm")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(0.6)",
        },
      },
      [theme.breakpoints.up("md")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(0.85)",
        },
      },
      [theme.breakpoints.up("lg")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(1)",
        },
      },
    },
  },
  contain: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  multiplier: {
    // backgroundColor: "#181B2B",
    // borderColor: "#181B2B",
    backgroundColor: "#1e234a",
    borderColor: "#1e234a",
    color: "white",
    transform: "skew(-20deg)",
    marginRight: 10,
  },
  playerCont: {
    display: "flex",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    padding: "1rem 0",
  },
  reverse: {
    transform: "skew(15deg)",
  },
  create: {
    backgroundColor: "#4f79fd",
    borderColor: "#FF4D4D",
    color: "white",
    transform: "skew(-20deg)",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#4f79fd",
    },
  },
  betButtons: {
    padding: "1rem 1rem",
    "& button": {
      height: "4rem",
      marginBottom: 10,
    },
  },
  extra: {
    position: "absolute",
    top: -37,
    right: 7,
    color: "white",
    textShadow: "0px 0px 19px white",
  },
}));

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return "Picking";
  } else {
    // Render a countdown
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
};

const RESET_DEG = -3; // What is the reseted wheel rotation degrees

const Roulette = ({ user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [gameState, setGameState] = useState("Place your Bets");

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [waitTime, setWaitTime] = useState(5000);
  const [color, setColor] = useState("yellow");
  const [betAmount, setBetAmount] = useState("0");
  const [gameId, setGameId] = useState(null);
  const [privateHash, setPrivateHash] = useState(null);

  // Preloading animations
  const [animations, setAnimations] = useState({});

  const [showExtraMultiplier, setShowExtraMultiplier] = useState(false);
  const [extraMultiplier, setExtraMultiplier] = useState(null);
  const [rotation, setRotation] = useState(RESET_DEG);

  // Fetch roulette schema from API
  const fetchData = async () => {
    setLoading(true);
    setButtonsDisabled(true);
    try {
      const schema = await getRouletteSchema();

      // Update state
      setGameId(schema.current._id);
      setPrivateHash(schema.current.privateHash);
      setPlayers(schema.current.players);
      setWaitTime(Date.now() + schema.current.timeLeft);
      setHistory(schema.history.reverse());
      setLoading(false);
      setButtonsDisabled(false);
    } catch (error) {
      console.log("There was an error while loading roulette schema:", error);
    }
  };

  // Add new player to the current game
  const addNewPlayer = player => {
    setPlayers(state => [...state, player]);
  };

  // Button onClick event handler
  const onClick = () => {
    setJoining(true);
    setButtonsDisabled(true);

    // Emit new bet event
    rouletteSocket.emit("join-game", color, parseFloat(betAmount));
  };

  // TextField onChange event handler
  const onChange = e => {
    setBetAmount(e.target.value);
  };

  // Translate color name to HEX code
  const getColorCode = name => {
    switch (name) {
      default:
      case "yellow":
        return "#eacc34";
      case "blue":
        return "#1d69ef";
      case "purple":
        return "#b157ce";
      case "green":
        return "#48c92d";
      case "red":
        return "#e8511e";
      case "pink":
        return "#ff5656";
    }
  };

  // New round started event handler
  const newRoundStarted = (countdownTime, gameId, privateHash) => {
    // Update state
    setGameId(gameId);
    setPrivateHash(privateHash);
    setWaitTime(Date.now() + countdownTime);
    setGameState("Place your Bets");
    setRotation(RESET_DEG);
    setButtonsDisabled(false);
    setShowExtraMultiplier(false);
    setExtraMultiplier(null);
    setPlayers([]);
  };

  // Get rotation for the wheel
  const getWheelRotation = index => {
    // const offset = Math.random();
    const offsetDeg = 3; // (offset * 360) / TILE_COUNT
    return (index * 360) / TILE_COUNT + offsetDeg;
  };

  // Multiplier rolled (extra tiles)
  const multiplierRolled = multiplier => {
    // Update state
    setExtraMultiplier(`extra-${multiplier}`);
    setShowExtraMultiplier(true);
    setGameState(`Mystery multiplier ${multiplier}x!`);
  };

  // Normal round rolled
  const roundRolled = multiplier => {
    // Update state
    setExtraMultiplier(multiplier);
    setShowExtraMultiplier(true);
  };

  // Add game to history
  const addGameToHistory = game => {
    setHistory(state =>
      state.length >= 50
        ? [...state.slice(1, state.length), game]
        : [...state, game]
    );
  };

  // componentDidMount
  useEffect(() => {
    // Error event handler
    const joinError = msg => {
      setButtonsDisabled(false);
      setJoining(false);
      addToast(msg, { appearance: "error" });
    };

    // Success event handler
    const joinSuccess = () => {
      setButtonsDisabled(false);
      setJoining(false);
      addToast("Successfully joined the game!", { appearance: "success" });
    };

    // Game has rolled, show animation
    const gameRolled = (index, multiplier) => {
      // Update state
      setGameState("Rolling");
      setButtonsDisabled(true);

      // Calculate degrees
      const degrees = getWheelRotation(index);

      // console.log("Index:", index);
      // console.log("Degrees:", degrees);

      // Set wheel positions
      setRotation(-Math.abs(degrees + 360));

      // Wait for the animation (not to test for 0)
      if (multiplier !== undefined) {
        setTimeout(() => {
          setGameState(
            `Rolled ${
              multiplier === 0
                ? "mystery! Getting multiplier..."
                : multiplier + "x!"
            }`
          );
        }, 10000);
      }
    };

    // Game has rolled, show animation
    const specialGameRolled = (index, multiplier) => {
      // Update state
      setGameState("Rolling");
      setShowExtraMultiplier(false);
      setButtonsDisabled(true);

      // Calculate degrees
      const degrees = getWheelRotation(index);

      // Set wheel positions
      setRotation(state => {
        // If user missed first roll
        if (state === RESET_DEG) {
          return -Math.abs(degrees + 360);
        } else {
          const previousDegrees = Math.abs(state) - 360;
          const toStart = -Math.abs(360 - previousDegrees);
          const resetAmount = state + toStart;

          return resetAmount - (degrees + 360);
        }
      });
    };

    // Initially, fetch data
    fetchData();

    // Preload animations
    setAnimations({ twoX: ani2Cup, threeX: ani3Cup, fourX: ani4Cup });

    // Listeners
    rouletteSocket.on("new-player", addNewPlayer);
    rouletteSocket.on("game-join-error", joinError);
    rouletteSocket.on("game-join-success", joinSuccess);
    rouletteSocket.on("new-round", newRoundStarted);
    rouletteSocket.on("game-rolled", gameRolled);
    rouletteSocket.on("special-game-rolled", specialGameRolled);
    rouletteSocket.on("multiplier-rolled", roundRolled);
    rouletteSocket.on("additional-multiplier-rolled", multiplierRolled);
    rouletteSocket.on("add-game-to-history", addGameToHistory);

    return () => {
      // Remove Listeners
      rouletteSocket.off("new-player", addNewPlayer);
      rouletteSocket.off("game-join-error", joinError);
      rouletteSocket.off("game-join-success", joinSuccess);
      rouletteSocket.off("new-round", newRoundStarted);
      rouletteSocket.off("game-rolled", gameRolled);
      rouletteSocket.off("special-game-rolled", specialGameRolled);
      rouletteSocket.off("multiplier-rolled", roundRolled);
      rouletteSocket.off("additional-multiplier-rolled", multiplierRolled);
      rouletteSocket.off("add-game-to-history", addGameToHistory);

      // clearInterval(timer);
    };
  }, [addToast]);

  return (
    <div>
      <Toolbar variant="dense" className={classes.controls}>
        <Box className={classes.logo}>
          WHEEL
          <br />
          <Box className={classes.countdown} alignItems="center" display="flex">
            <img
              style={{ display: "flex", marginRight: 5 }}
              src={timer}
              alt="timer"
            />
            {loading ? (
              <Fragment>Loading</Fragment>
            ) : gameState === "Rolling" ? (
              <Fragment>Rolling</Fragment>
            ) : (
              <Fragment>
                <Countdown key={waitTime} date={waitTime} renderer={renderer} />
              </Fragment>
            )}
          </Box>
        </Box>
        <Box className={classes.right}>
          {history.map(game => (
            <HistoryEntry key={game._id} game={game} />
          ))}
        </Box>
      </Toolbar>
      <Box className={classes.root}>
        <Container maxWidth="lg">
          <Grid container className={classes.contain}>
            <Box className={classes.game} flexDirection="column">
              <Box className={classes.info}>
                {loading ? (
                  <Fragment>{gameState}</Fragment>
                ) : (
                  <Tooltip
                    interactive
                    title={
                      <span>
                        Round ID: {gameId}
                        <br />
                        Private Hash: {privateHash}
                      </span>
                    }
                    placement="top"
                  >
                    <span>{gameState}</span>
                  </Tooltip>
                )}
              </Box>
              <Box className={classes.wheel}>
                <Prize opacity={showExtraMultiplier ? 1 : 0}>
                  {extraMultiplier === "extra-2" ? (
                    <Spritesheet
                      image={animations.twoX}
                      timeout={0}
                      autoplay={true}
                      widthFrame={690}
                      heightFrame={412}
                      steps={180}
                      fps={60}
                      className={classes.animation}
                      style={{ position: "absolute", zIndex: 100 }}
                    />
                  ) : extraMultiplier === "extra-3" ? (
                    <Spritesheet
                      image={animations.threeX}
                      timeout={0}
                      autoplay={true}
                      widthFrame={690}
                      heightFrame={412}
                      steps={180}
                      fps={60}
                      className={classes.animation}
                      style={{ position: "absolute", zIndex: 100 }}
                    />
                  ) : extraMultiplier === "extra-4" ? (
                    <Spritesheet
                      image={animations.fourX}
                      timeout={0}
                      autoplay={true}
                      widthFrame={690}
                      heightFrame={412}
                      steps={180}
                      fps={60}
                      className={classes.animation}
                      style={{ position: "absolute", zIndex: 100 }}
                    />
                  ) : extraMultiplier ? (
                    String(extraMultiplier).includes("extra-") ? (
                      String(extraMultiplier).replace("extra-", "") + "x"
                    ) : (
                      extraMultiplier + "x"
                    )
                  ) : null}
                </Prize>
                <Arrow opacity={showExtraMultiplier ? 0.5 : 1} />
                {gameState === "Rolling" ? (
                  <Wheel
                    rotate={`rotate(${rotation}deg)`}
                    opacity={showExtraMultiplier ? 0.5 : 1}
                    transition="transform 10s ease"
                  />
                ) : (
                  <Wheel
                    opacity={showExtraMultiplier ? 0.5 : 1}
                    rotate={`rotate(${rotation}deg)`}
                    transition="none"
                  />
                )}
              </Box>
              <Box className={classes.placeBet}>
                <Box className={classes.playerCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={betAmount}
                    onChange={onChange}
                  />
                  <Button
                    className={classes.multiplier}
                    size="medium"
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      setBetAmount(
                        state => (parseFloat(state) / 2).toFixed(2) || 0
                      )
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
                      setBetAmount(
                        state => (parseFloat(state) * 2).toFixed(2) || 0
                      )
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
                    disabled={joining}
                    onClick={onClick}
                    style={{ backgroundColor: getColorCode(color) }}
                  >
                    <span className={classes.reverse}>
                      {joining ? "Betting..." : "Bet"}
                    </span>
                  </Button>
                </Box>
                <Box className={classes.betButtons}>
                  <Box
                    className={
                      buttonsDisabled ? classes.disabled : classes.regular
                    }
                  >
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => setColor("yellow")}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      1x
                    </Button>
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => setColor("blue")}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      2x
                    </Button>
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => setColor("purple")}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      3x
                    </Button>
                  </Box>
                  <Box
                    className={
                      buttonsDisabled ? classes.disabled : classes.regular
                    }
                  >
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => setColor("green")}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      10x
                    </Button>
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => setColor("red")}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      20x
                    </Button>
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => setColor("pink")}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      40x
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Bets players={players} loading={loading} />
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

Roulette.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Roulette);
