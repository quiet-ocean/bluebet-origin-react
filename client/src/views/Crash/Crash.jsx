import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getCrashSchema, getUserCrashData } from "../../services/api.service";
import { crashSocket } from "../../services/websocket.service";
import Countdown from "react-countdown";
import PropTypes from "prop-types";
import _ from "underscore";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";
import { getUserVipData, claimRakebackBalance } from "../../services/api.service";

import { changeWallet } from "../../actions/auth";
// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

// Icons
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import InfoIcon from "@material-ui/icons/Info";
import CasinoIcon from "@material-ui/icons/Casino";

// Components
import Bets from "../../components/crash/Bets";
import Cup from "../../components/crash/Cup";
import HistoryEntry from "../../components/crash/HistoryEntry";

// Assets
import timer from "../../assets/timer.png";

import stars from "../../assets/stars.png";
import LinearProgress from "@material-ui/core/LinearProgress";
import LiveBets from "../../components/crash/LiveBets";
import Crown from "../../assets/Crown.webp";
// Custom Styled Component
import BetInput from './BetInput'
import TargetInput from "./TargetInput";
import useStyles from "./useStyles";
import { CrashHistory } from "./CrashHistory";
import { BreadCrumbs } from "../../components/BreadCrumbs";
import { Typography } from "@material-ui/core";

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return "In Progress";
  } else {
    // Render a countdown
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
};

// Same game states as in backend
const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

const Crash = ({ user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [gameState, setGameState] = useState(1);
  const [gameId, setGameId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [betting, setBetting] = useState(false);
  const [auth, setAuth] = useState(false);
  const [plannedBet, setPlannedBet] = useState(false);
  const [ownBet, setOwnBet] = useState(null);
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(true);
  const [autoBetEnabled, setAutoBetEnabled] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [payout, setPayout] = useState(1);
  const [betAmount, setBetAmount] = useState("0");
  const [target, setTarget] = useState("2");
  const [privateHash, setPrivateHash] = useState(null);
  const [publicSeed, setPublicSeed] = useState(null);
  const [maxProfit, setMaxProfit] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [claiming, setClaiming] = useState(false);

  const [vipData, setVipData] = useState(null);
  // Claim user vip rakeback
  const claimRakeback = async () => {
    setClaiming(true);
    try {
      const response = await claimRakebackBalance();

      // Notify user
      addToast(
        `Successfully claimed $${response.claimed.toFixed(2)} to your balance!`
      );
      changeWallet({ amount: parseFloat(response.claimed.toFixed(2)) });
    } catch (error) {
      setClaiming(false);
      console.log(
        "There was an error while claiming user rakeback balance:",
        error
      );

      // If this was user error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        addToast(
          "There was an error while claiming your rakeback balance, please try again later!"
        );
      }
    }
  };
  // Add new player to the current game
  const addNewPlayer = player => {
    setPlayers(state => [...state, player]);
  };

  // Button onClick event handler
  const clickBet = () => {
    if (parseFloat(betAmount) <= 0) return;

    if (gameState === GAME_STATES.Starting) {
      setJoining(true);

      // Emit new bet event
      crashSocket.emit(
        "join-game",
        autoCashoutEnabled ? parseFloat(target) * 100 : null,
        parseFloat(betAmount)
      );
    } else {
      if (plannedBet) {
        setPlannedBet(false);
      } else if (!autoBetEnabled) {
        setPlannedBet(true);
      }
    }
  };

  const clickCashout = () => {
    // Emit bet cashout
    crashSocket.emit("bet-cashout");
  };

  // TextField onChange event handler
  const onBetChange = e => {
    setBetAmount(e.target.value);
  };

  const onTargetChange = e => {
    setTarget(e.target.value);
  };

  const handleAutoCashoutChange = e => {
    if (!betting || cashedOut) setAutoCashoutEnabled(e.target.checked);
  };

  const handleAutoBetChange = e => {
    setAutoBetEnabled(e.target.checked);
    setPlannedBet(false);
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
      setJoining(false);
      addToast(msg, { appearance: "error" });
    };

    // Success event handler
    const joinSuccess = bet => {
      setJoining(false);
      setOwnBet(bet);
      setBetting(true);
      addToast("Successfully joined the game!", { appearance: "success" });
    };

    // Error event handler
    const cashoutError = msg => {
      addToast(msg, { appearance: "error" });
    };

    // Success event handler
    const cashoutSuccess = () => {
      addToast("Successfully cashed out!", { appearance: "success" });

      // Reset betting state
      setTimeout(() => {
        setBetting(false);
      }, 1500);
    };

    // New round is starting handler
    const gameStarting = data => {
      // Update state
      setGameId(data._id);
      setStartTime(new Date(Date.now() + data.timeUntilStart));
      setGameState(GAME_STATES.Starting);
      setPrivateHash(data.privateHash);
      setPublicSeed(null);

      setPayout(1);
      setPlayers([]);
      setOwnBet(null);

      if (autoBetEnabled) {
        setJoining(true);

        // Emit new bet event
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount)
        );
      } else if (plannedBet) {
        setJoining(true);

        // Emit new bet event
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount)
        );

        // Reset planned bet
        setPlannedBet(false);
      }
    };

    // New round started handler
    const gameStart = data => {
      // Update state
      setStartTime(Date.now());
      setGameState(GAME_STATES.InProgress);
      setPublicSeed(data.publicSeed);
    };

    // Current round ended handler
    const gameEnd = data => {
      // Update state
      setGameState(GAME_STATES.Over);
      setPayout(data.game.crashPoint);
      addGameToHistory(data.game);
      setBetting(false);
      setCashedOut(false);
    };

    // New game bets handler
    const gameBets = bets => {
      _.forEach(bets, bet => addNewPlayer(bet));
    };

    // New cashout handler
    const betCashout = bet => {
      // Check if local user cashed out
      if (bet.playerID === user._id) {
        setCashedOut(true);
        setOwnBet(Object.assign(ownBet, bet));

        // Reset betting state
        setTimeout(() => {
          setBetting(false);
        }, 1500);
      }

      // Update state
      setPlayers(state =>
        state.map(player =>
          player.playerID === bet.playerID ? Object.assign(player, bet) : player
        )
      );
    };

    // Current round tick handler
    const gameTick = payout => {
      if (gameState !== GAME_STATES.InProgress) return;

      setPayout(payout);
    };

    // Listeners
    crashSocket.on("game-starting", gameStarting);
    crashSocket.on("game-start", gameStart);
    crashSocket.on("game-end", gameEnd);
    crashSocket.on("game-tick", gameTick);
    crashSocket.on("game-bets", gameBets);
    crashSocket.on("bet-cashout", betCashout);
    crashSocket.on("game-join-error", joinError);
    crashSocket.on("game-join-success", joinSuccess);
    crashSocket.on("bet-cashout-error", cashoutError);
    crashSocket.on("bet-cashout-success", cashoutSuccess);

    return () => {
      // Remove Listeners
      crashSocket.off("game-starting", gameStarting);
      crashSocket.off("game-start", gameStart);
      crashSocket.off("game-end", gameEnd);
      crashSocket.off("game-tick", gameTick);
      crashSocket.off("game-bets", gameBets);
      crashSocket.off("bet-cashout", betCashout);
      crashSocket.off("game-join-error", joinError);
      crashSocket.off("game-join-success", joinSuccess);
      crashSocket.off("bet-cashout-error", cashoutError);
      crashSocket.off("bet-cashout-success", cashoutSuccess);
    };
  }, [
    addToast,
    gameState,
    startTime,
    plannedBet,
    autoBetEnabled,
    autoCashoutEnabled,
    betAmount,
    target,
    ownBet,
    user,
  ]);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const schema = await getCrashSchema();

        // Update state
        setGameId(schema.current._id);
        setPrivateHash(schema.current.privateHash);
        setPublicSeed(schema.current.publicSeed);
        setPlayers(schema.current.players);
        setStartTime(new Date(Date.now() - schema.current.elapsed));
        setHistory(schema.history.reverse());
        setLoading(false);
        setGameState(schema.current.status);
        setMaxProfit(schema.options.maxProfit);
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // Initially, fetch data
    fetchData();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCrashData();

        // Update state
        if (data.bet && data.bet.status === BET_STATES.Playing) {
          setBetting(true);
          setOwnBet(data.bet);
        }
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // If user is signed in, check user data
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  // componentDidMount
  useEffect(() => {
    // Fetch vip data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserVipData();

        console.log(
          data.wager -
            data.currentLevel.wagerNeeded / data.nextLevel.wagerNeeded
        );

        // Update state
        setVipData(data);
        setCompleted(
          (data.wager - data.currentLevel.wagerNeeded) /
            data.nextLevel.wagerNeeded
        );
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
        addToast(
          "There was an error while getting your VIP data, please try again later!",
          { appearance: "error" }
        );
      }
    };
    // If modal is opened, fetch data
    if (isAuthenticated) fetchData();
  }, [addToast, isAuthenticated]);
  return (
    <div>
      {/* <Toolbar variant="dense" className={classes.controls}>
        <Box className={classes.logo}>
          CRASH
          <br />
          <Box className={classes.countdown} alignItems="center" display="flex">
            <img
              style={{ display: "flex", marginRight: 5 }}
              src={timer}
              alt="timer"
            />
            {loading ? (
              <Fragment>Loading</Fragment>
            ) : gameState === GAME_STATES.Over ? (
              <Fragment>Crashed</Fragment>
            ) : (
              <Fragment>
                <Countdown
                  key={startTime}
                  date={startTime}
                  renderer={renderer}
                />
              </Fragment>
            )}
          </Box>
        </Box>
        <Box className={classes.right}>
          {history.map(game => (
            <HistoryEntry key={game._id} game={game} />
          ))}
        </Box>
      </Toolbar> */}
      <div>
        <Box className={classes.root}>
          <Container className={classes.container}>
            <BreadCrumbs />
            <Grid
              style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between' }}
              container
              className={classes.contain}
            >
              <Box className={classes.game} flexDirection="column">
                <Box className={classes.cup}>
                  {/* <Box className={classes.gameInfo}>
                    <Tooltip
                      interactive
                      title={
                        <span>
                          Round ID: {gameId}
                          <br />
                          Private Hash: {privateHash}
                          <br />
                          Public Seed:{" "}
                          {publicSeed ? publicSeed : "Not created yet"}
                        </span>
                      }
                      placement="bottom"
                    >
                      <span>
                        <CasinoIcon fontSize="inherit" /> Provably Fair
                      </span>
                    </Tooltip>
                  </Box>
                  <Box className={classes.maxProfit}>
                    <Tooltip
                      interactive
                      title={`$${parseCommasToThousands(
                        cutDecimalPoints(maxProfit.toFixed(7))
                      )} Max Profit`}
                      placement="bottom"
                    >
                      <span>
                        <InfoIcon fontSize="inherit" /> Max Profit
                      </span>
                    </Tooltip>
                  </Box> */}
                  <Cup
                    loading={loading}
                    payout={payout}
                    ownBet={ownBet}
                    gameState={gameState}
                    startTime={startTime}
                  />
                </Box>
                <Box style={{ position: 'absolute', top: 12, left: 12, width: '66%' }}>
                  <CrashHistory history={history}/>
                </Box>
              </Box>
              <Box
                className={classes.game1}
                flexDirection="column"
                // justifyContent="end"
                style={{ background: "" }}
              >
                <Bets players={players} loading={loading} />
                <Box className={classes.placeBet} mt='18px' pb={2} pt={1}>
                  <Box className={classes.betControl}>
                    <Typography className={classes.title} style={{ color: "white" }}>
                      Bet Amount
                    </Typography>
                    <Box className={classes.betCont}>
                      <BetInput
                        label=""
                        variant="filled"
                        value={betAmount}
                        onChange={onBetChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              className={classes.inputIcon}
                              position="start"
                            >
                              <AttachMoneyIcon
                                style={{ fontSize: 16, marginTop: "-1em" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                      {/* <Button
                        className={classes.multiplier}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          setBetAmount(
                            state => (parseFloat(state) + 1).toFixed(2) || 0
                          )
                        }
                      >
                        <span className={classes.reverse}>+1</span>
                      </Button> */}
                      {/* <Button
                        className={classes.multiplier}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          setBetAmount(
                            state => (parseFloat(state) + 5).toFixed(2) || 0
                          )
                        }
                      >
                        <span className={classes.reverse}>+5</span>
                      </Button> */}
                      {/* <Button
                        className={classes.multiplier}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          setBetAmount(
                            state => (parseFloat(state) + 10).toFixed(2) || 0
                          )
                        }
                      >
                        <span className={classes.reverse}>+10</span>
                      </Button> */}
                      {/* <Button
                        className={classes.multiplier}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          setBetAmount(
                            state => (parseFloat(state) + 25).toFixed(2) || 0
                          )
                        }
                      >
                        <span className={classes.reverse}>+25</span>
                      </Button> */}
                      {/* <Button
                        className={classes.multiplier}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          setBetAmount(
                            state => (parseFloat(state) + 50).toFixed(2) || 0
                          )
                        }
                      >
                        <span className={classes.reverse}>+50</span>
                      </Button> */}
                      <Button
                        className={classes.multiplier2}
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
                        className={classes.multiplier1}
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
                      {/* <Button
                        className={classes.multiplier}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          setBetAmount(
                            user ? parseFloat(user.wallet).toFixed(2) : 0
                          )
                        }
                      >
                        <span className={classes.reverse}>Max</span>
                      </Button> */}
                    </Box>
                  </Box>
                  <Box className={classes.betControl}>
                    <Typography
                      style={{ width: "100%", color: "white" }}
                      className={classes.splitTitle}
                    >
                      Cashout At:
                    </Typography>
                    <br />
                    {/* <div className={classes.splitTitle}>Auto Bet</div> */}
                    <Box
                      className={classes.cashoutCont}
                      style={{ width: "100%" }}
                    >
                      {/* <Switch
                        color="primary"
                        checked={autoCashoutEnabled}
                        onChange={handleAutoCashoutChange}
                      /> */}
                      <TargetInput
                        label=""
                        variant="filled"
                        value={`x ${target}`}
                        onChange={onTargetChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              className={classes.inputIcon}
                              position="start"
                            >
                              <TrackChangesIcon style={{ fontSize: 16, marginTop: '-1rem' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                  {/* <Box className={classes.autoCont}>
                    <Switch
                      color="primary"
                      checked={autoBetEnabled}
                      onChange={handleAutoBetChange}
                    />
                  </Box> */}
                  {!betting ? (
                    <Button
                      className={classes.bet}
                      size="medium"
                      color="primary"
                      variant="contained"
                      disabled={joining || autoBetEnabled}
                      onClick={clickBet}
                    >
                      <span className={classes.reverse}>
                        {joining
                          ? "Betting..."
                          : plannedBet
                          ? "Cancel bet"
                          : "Place Bet"}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      className={classes.cashout}
                      size="medium"
                      color="secondary"
                      variant="contained"
                      disabled={gameState !== GAME_STATES.InProgress || cashedOut}
                      onClick={clickCashout}
                    >
                      <span className={classes.reverse}>
                        {cashedOut ? "Cashed out" : "Cashout"}
                      </span>
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Container>
        </Box>
        {isAuthenticated ? (
          <Box
            className={classes.root}
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "-250px",
            }}
          >
            <h1 className={classes.vipTitle}>
              VIP Level <span>{vipData ? vipData.currentLevel.name : " "}</span>
            </h1>
            <div className={classes.vipBar}>
              <Box position="relative" className={classes.progressbox}>
                <img src={stars} alt="star" />
                <LinearProgress
                  className={classes.progress}
                  variant="buffer"
                  valueBuffer={completed * 100}
                  value={completed * 100}
                />
                <span>
                  <img src={Crown} alt="" />
                </span>
              </Box>
            </div>
          </Box>
        ) : (
          <div></div>
        )}
        <Box
          className={classes.liveBetsWrapper}
          style={{
            width: "100%",
            // marginTop: "-100px",
            marginBottom: 48,
          }}
        >
          <LiveBets />
        </Box>
      </div>
    </div>
  );
};

Crash.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Crash);
