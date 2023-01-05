import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Spritesheet from "react-responsive-spritesheet";
import Countdown from "react-countdown";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { shuffleSocket } from "../services/websocket.service";
import { getShuffleSchema } from "../services/api.service";
import { useToasts } from "react-toast-notifications";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import Chose from "../components/shuffle/Chose";
import Explode from "../components/shuffle/Explode";

// Assets
import percent from "../assets/percent.png";
import timer from "../assets/timer.png";
import bag from "../assets/bag.png";
import cupOutline from "../assets/cup-outline.png";
import red from "../assets/shuffle/red.png";
import blue from "../assets/shuffle/blue.png";
import green from "../assets/shuffle/green.png";
import yellow from "../assets/shuffle/yellow.png";
import pink from "../assets/shuffle/pink.png";
import aniShuffle from "../assets/aniShuffle.png";
import shufflePause from "../assets/shufflePause.png";

import ballRed from "../assets/shuffle/ballRed.png";
import ballBlue from "../assets/shuffle/ballBlue.png";
import ballGreen from "../assets/shuffle/ballGreen.png";
import ballYellow from "../assets/shuffle/ballYellow.png";
import ballPink from "../assets/shuffle/ballPink.png";

// import fakeBets from "../libs/fakeBets";

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

// Custom styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingTop: 50,
    paddingBottom: 120,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 25,
    },
    "& > div > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      "& > hr": {
        width: "100%",
        marginTop: "1rem",
        background: "blue",
        borderColor: "#111429",
      },
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
  game: {
    display: "flex",
    alignItems: "center",
    background: "#111429",
    width: "100%",
    height: "7vh",
    [theme.breakpoints.down("xs")]: {
      "& > div": {
        margin: "0 auto",
      },
    },
    "& > img": {
      marginLeft: "2rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  animation: {
    display: "flex",
    background: "#111429",
    width: "100%",
    height: "40vh",
    marginTop: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      "& > img": {
        width: "75%",
      },
      "& .react-responsive-spritesheet": {
        transform: "scale(0.3)",
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
  bets: {
    display: "grid",
    alignItems: "space-between",
    gridColumnGap: 15,
    gridTemplateColumns: "auto auto auto auto auto",
    width: "100%",
    height: "20vh",
    marginTop: 15,
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "auto auto",
      gridRowGap: 15,
      height: "fit-content",
    },
    "& > div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      background: "#111429",
      borderRadius: 5,
      "& h5, h3": {
        margin: 0,
        fontWeight: "300",
      },
      "& h3": {
        marginTop: 10,
      },
      "& span": {
        color: "#6c82ff",
      },
      "& hr": {
        width: "75%",
        opacity: 0.1,
        margin: "1rem 0",
      },
      "& .betLeft": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        color: "white",
        padding: "0 2.5rem",
        [theme.breakpoints.down("xs")]: {
          padding: "20px 15px",
        },
      },
      "& .betRight": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f1226",
        width: "40%",
        height: "100%",
        fontSize: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        [theme.breakpoints.down("xs")]: {
          background: "transparent",
        },
      },
    },
  },
  players: {
    display: "grid",
    alignItems: "space-between",
    gridColumnGap: 10,
    gridRowGap: 10,
    gridTemplateColumns: "auto auto auto auto",
    width: "100%",
    minHeight: "8vh",
    marginTop: 15,
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "auto auto",
      gridRowGap: 10,
    },
  },
  smallBet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    width: "100%",
    height: 70,
    background: "#111429",
    borderRadius: 5,
    paddingLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      padding: 9,
      paddingLeft: 12,
    },
    "& h3, h5": {
      margin: 0,
      fontWeight: "300",
    },
    "& span": {
      color: "#6c82ff",
    },
  },
  potValue: {
    color: "white",
    display: "flex",
    alignItems: "center",
    marginRight: "2rem",
    "& img": {
      marginRight: "1rem",
    },
    "& h5, h3": {
      margin: 0,
    },
    "& h5": {
      color: "#4e5378",
      fontSize: 12,
    },
    "& h3": {
      fontSize: 20,
      [theme.breakpoints.down("sm")]: {
        fontSize: 15,
      },
    },
  },
  betInfo: {
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8,
      fontSize: 12,
    },
    "& h3": {
      margin: 0,
      [theme.breakpoints.down("xs")]: {
        fontSize: 10,
      },
    },
  },
  outline: {
    marginLeft: "auto",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
    width: "30%",
    background: "#0f1226",
    [theme.breakpoints.down("xs")]: {
      background: "transparent",
      width: "20%",
    },
  },
  multiplier: {
    backgroundColor: "#181B2B",
    borderColor: "#181B2B",
    color: "white",
    transform: "skew(-20deg)",
    marginRight: 10,
  },
  reverse: {
    transform: "skew(15deg)",
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
  round: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    "& > img": {
      width: 30,
      height: 30,
      marginLeft: 20,
    },
  },
  nonActive: {
    opacity: 0.35,
    transition: "0.25s ease",
  },
  activeRound: {
    transform: "scale(1.05)",
    opacity: 1,
    transition: "0.25s ease",
  },
  aniShuffle: {
    width: 952,
    height: 206,
    position: "relative",
    top: 0,
    transition: "0.25s ease",
  },
  ballWrap: {
    width: 952,
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ballBox: {
    width: 952,
    height: 206,
    position: "relative",
    top: 0,
    transition: "0.25s ease",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.3)",
    },
    [theme.breakpoints.up("sm")]: {
      transform: "scale(0.6)",
    },
    [theme.breakpoints.up("md")]: {
      transform: "scale(0.85)",
    },
    [theme.breakpoints.up("lg")]: {
      transform: "scale(1)",
    },
  },
  ball: {
    width: 982,
    height: "100%",
    position: "relative",
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

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

const Shuffle = ({ user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [betAmount, setBetAmount] = useState("0");

  const [waitTime, setWaitTime] = useState(5000);
  const [gameStatus, setGameStatus] = useState(0);
  const [currentlyPicking, setCurrentlyPicking] = useState(0);
  const [players, setPlayers] = useState([]);
  const [nextRoundPlayers, setNextRoundPlayers] = useState(null);
  const [wheelImages, setWheelImages] = useState([]);
  const [transform, setTransform] = useState("translateX(0px)");
  const [animation, setAnimation] = useState("3s ease");
  const [winner, setWinner] = useState(null);
  const [move, setMove] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [top, setTop] = useState(0);

  // Fetch shuffle schema from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const schema = await getShuffleSchema();

      console.log("Schema:", schema);

      // Get current game status
      const currentStatus = schema.current.status;

      // If current game is on countdown
      if (currentStatus === 2) {
        setWaitTime(Date.now() + schema.current.timeLeft);
      } else if (currentStatus === 3) {
        // If current game is picking players
        setCurrentlyPicking(schema.current.currentlyPicking);
      } else if (currentStatus === 4) {
        // If current game is rolling
        console.log("Shuffle game rolling...");
      }

      // Update state
      setPlayers(schema.current.players);
      setNextRoundPlayers(schema.current.nextRoundPlayers);
      setGameStatus(currentStatus);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while loading roulette schema:", error);
    }
  };

  // TextField onChange event handler
  const onChange = e => {
    // Update state
    setBetAmount(e.target.value);
  };

  // Button onClick event handler
  const onClick = () => {
    setJoining(true);
    shuffleSocket.emit("join-game", parseFloat(betAmount));
  };

  // New round has started
  const newRound = () => {
    // Update state
    setGameStatus(1);
    setCurrentlyPicking(0);
    setPlayers([]);
    setNextRoundPlayers(null);
  };

  // Add player to the game
  const addPlayer = player => {
    // Update state
    setPlayers(state => [...state, player]);
  };

  // Player's percentages updated
  const percentagesUpdated = players => {
    // Update state
    setPlayers(players);
  };

  // Server is picking a cup
  const pickingCup = cupId => {
    // Update state
    setGameStatus(3);
    setCurrentlyPicking(cupId);
  };

  // Get cup color from cupId
  const getCupColor = cupId => {
    switch (cupId) {
      default:
      case 1:
        return "#ff4c4c";
      case 2:
        return "#4c7aff";
      case 3:
        return "#4cffa1";
      case 4:
        return "#efff4c";
      case 5:
        return "#e84cff";
    }
  };

  // Countdown started
  const countdownStarted = time => {
    // Update state
    setGameStatus(2);
    setWaitTime(Date.now() + time);
  };

  // Game is rolling
  const rollingGame = () => {
    // Update state
    setCurrentlyPicking(0);
  };

  // Game rolled
  const gameRolled = (winner, winningCupIndex) => {
    // Update state
    setGameStatus(4);
    setCurrentlyPicking(0);

    // Ball image selector
    const winnerBall = [ballRed, ballBlue, ballGreen, ballYellow, ballPink];

    // Wait for animation and set winner
    setTimeout(() => setWinner(winnerBall[winningCupIndex]), 1000);
    setTimeout(() => setCurrentlyPicking(winningCupIndex + 1), 2700);
  };

  // Filter out next round players
  const noNextRoundPlayers = player =>
    ![
      nextRoundPlayers && nextRoundPlayers.red && nextRoundPlayers.red._id,
      nextRoundPlayers && nextRoundPlayers.blue && nextRoundPlayers.blue._id,
      nextRoundPlayers && nextRoundPlayers.green && nextRoundPlayers.green._id,
      nextRoundPlayers &&
        nextRoundPlayers.yellow &&
        nextRoundPlayers.yellow._id,
      nextRoundPlayers && nextRoundPlayers.pink && nextRoundPlayers.pink._id,
    ].includes(player._id);

  // componentDidMount
  useEffect(() => {
    // Player picked for next round
    const playerPicked = (winner, allPlayers, currentCup) => {
      // Reset Animation
      setAnimation("none");
      setTransform("translateX(0px)");

      // Get images for wheel
      const images = allPlayers.map(player => ({
        avatar: player.avatar,
        _id: player._id,
      }));
      setWheelImages(images.map(item => item.avatar));

      // Calculate animation
      const tileWidth = 100;
      const tileCount = images.length;
      const repeatCount = 30;
      const rowWidth = tileCount * tileWidth;
      const winnerIndex = images.map(item => item._id).indexOf(winner._id);
      const translateX =
        (repeatCount / 3) * rowWidth +
        (winnerIndex + 1) * tileWidth -
        tileWidth / 2;

      // Wait for animation reset
      setTimeout(() => {
        setTransform(`translateX(-${translateX}px)`);
        setAnimation("3s ease");
      }, 1000);

      // Wait for the animation
      setTimeout(() => {
        setNextRoundPlayers(state => ({ ...state, [currentCup]: winner }));
      }, 5000);
    };

    // Game joining error handler
    const handleError = msg => {
      setJoining(false);
      addToast(msg, { appearance: "error" });
    };

    // Game joining success handler
    const handleSuccess = msg => {
      setJoining(false);
      addToast("Successfully joined the game!", { appearance: "success" });
    };

    // Fetch data initially
    fetchData();

    // Listeners
    shuffleSocket.on("game-join-error", handleError);
    shuffleSocket.on("game-join-success", handleSuccess);
    shuffleSocket.on("new-player", addPlayer);
    shuffleSocket.on("percentages-updated", percentagesUpdated);
    shuffleSocket.on("picking-cup", pickingCup);
    shuffleSocket.on("player-picked", playerPicked);
    shuffleSocket.on("countdown-started", countdownStarted);
    shuffleSocket.on("rolling-game", rollingGame);
    shuffleSocket.on("game-rolled", gameRolled);
    shuffleSocket.on("new-round", newRound);

    // componentDidUnmount
    return () => {
      // Remove Listeners
      shuffleSocket.off("game-join-error", handleError);
      shuffleSocket.off("game-join-success", handleSuccess);
      shuffleSocket.off("new-player", addPlayer);
      shuffleSocket.off("percentages-updated", percentagesUpdated);
      shuffleSocket.off("picking-cup", pickingCup);
      shuffleSocket.off("player-picked", playerPicked);
      shuffleSocket.off("countdown-started", countdownStarted);
      shuffleSocket.off("rolling-game", rollingGame);
      shuffleSocket.off("game-rolled", gameRolled);
      shuffleSocket.off("new-round", newRound);
    };
  }, [addToast]);

  // Preload images
  useEffect(() => {
    const img = new Image();

    // By setting src, we trigger browser download
    img.src = aniShuffle;
    img.src = ballRed;
    img.src = ballBlue;
    img.src = ballGreen;
    img.src = ballYellow;
    img.src = ballPink;
  }, []);

  return (
    <div>
      <Toolbar variant="dense" className={classes.controls}>
        <Box className={classes.logo}>
          SHUFFLE
          <br />
          <Box alignItems="center" display="flex" fontSize={15}>
            <img
              style={{ display: "flex", marginRight: 5 }}
              src={timer}
              alt="timer"
            />
            {loading ? (
              <Fragment>Loading</Fragment>
            ) : gameStatus === 1 ? (
              <Fragment>Waiting for players</Fragment>
            ) : (
              <Fragment>
                <Countdown key={waitTime} date={waitTime} renderer={renderer} />
              </Fragment>
            )}
          </Box>
        </Box>
        <Box className={classes.right}>
          <BetInput
            label=""
            value={betAmount}
            onChange={onChange}
            variant="filled"
          />
          <Button
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => setBetAmount(state => parseFloat(state) + 1)}
          >
            <span className={classes.reverse}>+1</span>
          </Button>
          <Button
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => setBetAmount(state => parseFloat(state) + 5)}
          >
            <span className={classes.reverse}>+5</span>
          </Button>
          <Button
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => setBetAmount(state => parseFloat(state) + 25)}
          >
            <span className={classes.reverse}>+25</span>
          </Button>
          <Button
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => setBetAmount(state => parseFloat(state) + 50)}
          >
            <span className={classes.reverse}>+50</span>
          </Button>
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
            disabled={joining}
            onClick={onClick}
          >
            <span className={classes.reverse}>
              {joining ? "Joining..." : "Join"}
            </span>
          </Button>
        </Box>
      </Toolbar>
      <Box className={classes.root}>
        <Container maxWidth="lg">
          <Grid container>
            <Box className={classes.game}>
              <Box className={classes.round}>
                <img
                  className={
                    currentlyPicking === 1
                      ? classes.activeRound
                      : classes.nonActive
                  }
                  src={red}
                  alt="red"
                />
                <img
                  className={
                    currentlyPicking === 2
                      ? classes.activeRound
                      : classes.nonActive
                  }
                  src={blue}
                  alt="blue"
                />
                <img
                  className={
                    currentlyPicking === 3
                      ? classes.activeRound
                      : classes.nonActive
                  }
                  src={green}
                  alt="green"
                />
                <img
                  className={
                    currentlyPicking === 4
                      ? classes.activeRound
                      : classes.nonActive
                  }
                  src={yellow}
                  alt="yellow"
                />
                <img
                  className={
                    currentlyPicking === 5
                      ? classes.activeRound
                      : classes.nonActive
                  }
                  src={pink}
                  alt="pink"
                />
              </Box>
              <Box display="flex" marginLeft="auto">
                {!loading && (
                  <Fragment>
                    <Box className={classes.potValue}>
                      <img src={bag} alt="bag" />
                      <Box>
                        <h5>Pot Value</h5>
                        <h3>
                          {`$${players
                            .map(player => player.betAmount)
                            .reduce((a, b) => a + b, 0)
                            .toFixed(2)}`}
                        </h3>
                      </Box>
                    </Box>
                    <Box className={classes.potValue}>
                      <img src={percent} alt="percent" />
                      <Box>
                        <h5>Chance</h5>
                        <h3>
                          {user
                            ? players.find(player => player._id === user._id)
                              ? `${players
                                  .find(player => player._id === user._id)
                                  .winningPercentage.toFixed(2)}%`
                              : "0.00%"
                            : "0.00%"}
                        </h3>
                      </Box>
                    </Box>
                    <Box className={classes.potValue}>
                      <img src={bag} alt="bag" />
                      <Box>
                        <h5>My Bet</h5>
                        <h3>
                          {user
                            ? players.find(player => player._id === user._id)
                              ? `$${players
                                  .find(player => player._id === user._id)
                                  .betAmount.toFixed(2)}`
                              : "$0.00"
                            : "$0.00"}
                        </h3>
                      </Box>
                    </Box>
                  </Fragment>
                )}
              </Box>
            </Box>
            <Box className={classes.animation}>
              {loading ? (
                <Fragment>
                  <ColorCircularProgress />
                </Fragment>
              ) : gameStatus < 3 ? (
                <Fragment>
                  <img src={shufflePause} alt="paused" />
                </Fragment>
              ) : gameStatus === 3 ? (
                <Fragment>
                  <Chose
                    animation={animation}
                    transform={transform}
                    color={getCupColor(currentlyPicking)}
                    images={wheelImages}
                    repeat={30}
                  />
                  <Explode color={getCupColor(currentlyPicking)} />
                </Fragment>
              ) : gameStatus === 4 ? (
                <Fragment>
                  <Spritesheet
                    image={aniShuffle}
                    widthFrame={476 * 2}
                    heightFrame={206}
                    steps={120}
                    fps={60}
                    style={{ top: move }}
                    className={classes.aniShuffle}
                    onEnterFrame={[
                      {
                        frame: 119,
                        callback: () => {
                          setMove("-3rem");
                          setTop("3rem");
                          setOpacity(1);
                        },
                      },
                    ]}
                  />

                  <Box className={classes.ballWrap}>
                    <Box className={classes.ballBox}>
                      <Box
                        className={classes.ball}
                        style={{
                          top: top,
                          opacity: opacity,
                          backgroundImage: `url(${winner})`,
                        }}
                        alt="ballResult"
                      />
                    </Box>
                  </Box>
                </Fragment>
              ) : null}
            </Box>
            <Grid className={classes.bets}>
              <Box
                className={
                  currentlyPicking === 1
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.red ? (
                  <Box className="betLeft">
                    <Avatar
                      src={nextRoundPlayers.red.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.red.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span> {nextRoundPlayers.red.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.red.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" />
                    <h3>Unknown</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img style={{ width: 20, height: 20 }} src={red} alt="cup" />
                  <h3 style={{ color: "#ff4c4c" }}>RED</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 2
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.blue ? (
                  <Box className="betLeft">
                    <Avatar
                      src={nextRoundPlayers.blue.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.blue.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.blue.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.blue.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" />
                    <h3>Unknown</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img style={{ width: 20, height: 20 }} src={blue} alt="cup" />
                  <h3 style={{ color: "#4c7aff" }}>BLUE</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 3
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.green ? (
                  <Box className="betLeft">
                    <Avatar
                      src={nextRoundPlayers.green.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.green.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.green.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.green.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" />
                    <h3>Unknown</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img
                    style={{ width: 20, height: 20 }}
                    src={green}
                    alt="cup"
                  />
                  <h3 style={{ color: "#4cffa1" }}>GREEN</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 4
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.yellow ? (
                  <Box className="betLeft">
                    <Avatar
                      src={nextRoundPlayers.yellow.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.yellow.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.yellow.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.yellow.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" />
                    <h3>Unknown</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img
                    style={{ width: 20, height: 20 }}
                    src={yellow}
                    alt="cup"
                  />
                  <h3 style={{ color: "#efff4c" }}>YELLOW</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 5
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.pink ? (
                  <Box className="betLeft">
                    <Avatar
                      src={nextRoundPlayers.pink.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.pink.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.pink.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.pink.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" />
                    <h3>Unknown</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img style={{ width: 20, height: 20 }} src={pink} alt="cup" />
                  <h3 style={{ color: "#e84cff" }}>PINK</h3>
                </Box>
              </Box>
            </Grid>
            <hr />
            <Grid className={classes.players}>
              {nextRoundPlayers && nextRoundPlayers.red && (
                <Box className={classes.smallBet}>
                  <Avatar src={nextRoundPlayers.red.avatar} variant="rounded" />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.red.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.red.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.red.winningPercentage.toFixed(2)}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={red} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.blue && (
                <Box className={classes.smallBet}>
                  <Avatar
                    src={nextRoundPlayers.blue.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.blue.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.blue.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.blue.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={blue} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.green && (
                <Box className={classes.smallBet}>
                  <Avatar
                    src={nextRoundPlayers.green.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.green.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.green.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.green.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={green} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.yellow && (
                <Box className={classes.smallBet}>
                  <Avatar
                    src={nextRoundPlayers.yellow.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.yellow.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.yellow.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.yellow.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img
                        style={{ width: 32 }}
                        src={yellow}
                        alt="playingCup"
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.pink && (
                <Box className={classes.smallBet}>
                  <Avatar
                    src={nextRoundPlayers.pink.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.pink.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.pink.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.pink.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={pink} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {players
                .sort((a, b) => b.betAmount - a.betAmount)
                .filter(noNextRoundPlayers)
                .map(player => (
                  <Box key={player._id} className={classes.smallBet}>
                    <Avatar src={player.avatar} variant="rounded" />
                    <Box className={classes.betInfo}>
                      <h3>{player.username}</h3>
                      <Box display="flex">
                        <h5>
                          <span> $ </span>
                          {player.betAmount.toFixed(2)}{" "}
                        </h5>
                        <h5 style={{ marginLeft: 5 }}>
                          <span> % </span>
                          {player.winningPercentage.toFixed(2)}{" "}
                        </h5>
                      </Box>
                    </Box>
                    <Box className={classes.outline}>
                      <Box display="flex" alignItems="center">
                        <img src={cupOutline} alt="cupOutline" />
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

Shuffle.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Shuffle);
