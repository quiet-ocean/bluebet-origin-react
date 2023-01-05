import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import { cupsSocket } from "../../services/websocket.service";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

// Components
import Animation from "../jackpot/Result";
import Waiting from "../jackpot/Waiting";
import ProvablyModal from "../modals/cups/ProvablyModal";
import PrivateGameModal from "../modals/cups/PrivateGameModal";
import PrivateGameJoinModal from "../modals/PrivateGameJoinModal";

// Icons
import CasinoIcon from "@material-ui/icons/Casino";
import LinkIcon from "@material-ui/icons/Link";
import AdbIcon from "@material-ui/icons/Adb";
import DoneIcon from "@material-ui/icons/Done";

// Assets
import cupColor from "../../assets/cupColor.png";
import Logo from "../../assets/logo.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  container: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 120,
  },
  box: {
    marginBottom: 5,
  },
  round: {
    display: "flex",
    height: "10rem",
    width: "100%",
    marginBottom: 10,
    position: "relative",
    border: "1px solid #111729",
    borderRadius: 5,
  },
  provably: {
    background: "#111729",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: "5px 0 0 5px",
    height: "100%",
    width: "3rem",
    [theme.breakpoints.down("sm")]: {
      height: "fit-content",
      position: "absolute",
      margin: "1rem",
      borderRadius: "100%",
    },
    "& span": {
      color: "#232b42",
    },
    "& svg": {
      transform: "rotate(45deg)",
    },
  },
  callBot: {
    transform: "rotate(0deg) !important",
  },
  calledBot: {
    color: "#4caf50",
    marginLeft: "6px",
  },
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    alignItems: "flex-start",
    marginLeft: "3rem",
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      marginLeft: "1rem",
      marginBottom: "1rem",
      justifyContent: "flex-end",
    },
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
    width: "100%",
    margin: "0 5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      margin: "0 0",
      alignItems: "center",
    },
    [theme.breakpoints.down("md")]: {
      margin: "0 1rem",
      alignItems: "center",
    },
  },
  player: {
    display: "flex",
    color: "white",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
    "& img": {
      height: "auto",
    },
    "& > span": {
      marginLeft: "1rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  result: {
    background: "#070A15",
    width: "110%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    "& > div": {
      height: "auto",
    },
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  avatar: {
    marginLeft: "1rem",
    backgroundColor: "#181c32",
    color: "#333a60",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  waitingResult: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100% !important",
    width: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
}));

// Custom Styled Component
const JoinBtn = withStyles(theme => ({
  root: {
    marginLeft: "1rem",
    transform: "skew(-20deg)",
    color: "white",
    background: props => props.color,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
    "&:hover": {
      background: props => props.color,
    },
    "& span": {
      marginLeft: 0,
    },
    "& :nth-child(1)": {
      transform: "skew(20deg)",
      textTransform: "capitalize",
      fontSize: 10,
    },
  },
}))(Button);

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

const Game = ({ game, user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const [provablyModalVisible, setProvablyModalVisible] = useState(false);
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [joining, setJoining] = useState(null);
  const [callingBot, setCallingBot] = useState(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedCup, setSelectedCup] = useState("");

  // Button onClick event handler
  const joinGame = color => {
    // If this is a private game
    if (game.privateGame) {
      setJoinModalVisible(true);
      setSelectedCup(color);
    } else {
      setJoining(color);
      cupsSocket.emit("join-game", game._id, color);
    }
  };

  // Button onClick event handler
  const callBot = () => {
    setCallingBot(true);
    cupsSocket.emit("call-bot", game._id);
  };

  // Parse winning cup into CupIndex
  const getWinner = cup => ["red", "blue", "green", "yellow"].indexOf(cup) + 1;

  // Captcha value changed (completed)
  const captchaOnChange = response => {
    setJoining(selectedCup);
    cupsSocket.emit("join-game", game._id, selectedCup, response);
  };

  // componentDidMount
  useEffect(() => {
    // Handle join event
    const joinEvent = () => {
      setJoining(null);
      setJoinModalVisible(false);
      setSelectedCup("");
    };

    // Handle cancel event
    const callingBotEvent = () => {
      setCallingBot(null);
    };

    // Listeners
    cupsSocket.on("game-join-error", joinEvent);
    cupsSocket.on("game-join-success", joinEvent);
    cupsSocket.on("game-call-bot-error", callingBotEvent);
    cupsSocket.on("game-call-bot-success", callingBotEvent);

    // componentDidUnmount
    return () => {
      // Remove listeners
      cupsSocket.on("game-join-error", joinEvent);
      cupsSocket.on("game-join-success", joinEvent);
      cupsSocket.on("game-call-bot-error", callingBotEvent);
      cupsSocket.on("game-call-bot-success", callingBotEvent);
    };
  }, []);

  return (
    <Box
      key={game._id}
      className={classes.round}
      style={
        game.ended
          ? { opacity: 0.4, transition: "all 0.3s ease" }
          : game.ownPrivateGame
          ? { border: "1px solid #4f79fd" }
          : {}
      }
    >
      <ProvablyModal
        game={game}
        handleClose={() => setProvablyModalVisible(state => !state)}
        open={provablyModalVisible}
      />
      {game.privateGame && (
        <PrivateGameJoinModal
          loading={Boolean(joining)}
          open={joinModalVisible}
          handleClose={() => setJoinModalVisible(state => !state)}
          onChange={captchaOnChange}
        />
      )}
      {game.ownPrivateGame && (
        <PrivateGameModal
          open={privateGameModalVisible}
          handleClose={() => setPrivateGameModalVisible(state => !state)}
          link={game.inviteLink}
        />
      )}
      <Box className={classes.provably}>
        <IconButton
          onClick={() => setProvablyModalVisible(state => !state)}
          color="primary"
        >
          <CasinoIcon />
        </IconButton>
        {isAuthenticated &&
          user &&
          game.players.length < game.playerAmount &&
          game.players.map(player => player._id).includes(user._id) &&
          game.voteBot &&
          !game.voteBot.includes(user._id) && (
            <IconButton
              onClick={() => (!callingBot ? callBot() : null)}
              color="primary"
            >
              <AdbIcon className={classes.callBot} />
            </IconButton>
          )}
        {game.ownPrivateGame && (
          <IconButton
            onClick={() => setPrivateGameModalVisible(state => !state)}
            color="primary"
          >
            <LinkIcon />
          </IconButton>
        )}
      </Box>
      <Box className={classes.value}>
        <h1>${(game.betAmount * game.playerAmount).toFixed(2)}</h1>
        <h3>VALUE</h3>
      </Box>
      <Box className={classes.players}>
        {game.players.find(player => player.color === "red") ? (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(0deg)" }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "red").isBot
                  ? Logo
                  : game.players.find(player => player.color === "red").avatar
              }
              className={classes.avatar}
            />
            <span>
              {game.players.find(player => player.color === "red").username}
            </span>
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "red")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(0deg)" }}
            />
            <Avatar variant="rounded" className={classes.avatar} />
            <JoinBtn
              color="#ff4c4c"
              variant="contained"
              onClick={() => (!joining ? joinGame("red") : null)}
              disabled={joining}
            >
              {joining === "red"
                ? "Joining..."
                : `Join ($${
                    game.privateGame
                      ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                      : game.betAmount.toFixed(2)
                  })`}
            </JoinBtn>
          </Box>
        )}
        {game.players.find(player => player.color === "blue") ? (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(225deg)" }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "blue").isBot
                  ? Logo
                  : game.players.find(player => player.color === "blue").avatar
              }
              className={classes.avatar}
            />
            <span>
              {game.players.find(player => player.color === "blue").username}
            </span>
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "blue")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(225deg)" }}
            />
            <Avatar variant="rounded" className={classes.avatar} />
            <JoinBtn
              color="#297bf1"
              variant="contained"
              onClick={() => (!joining ? joinGame("blue") : null)}
              disabled={joining}
            >
              {joining === "blue"
                ? "Joining..."
                : `Join ($${
                    game.privateGame
                      ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                      : game.betAmount.toFixed(2)
                  })`}
            </JoinBtn>
          </Box>
        )}
      </Box>
      <Box className={classes.players}>
        {game.playerAmount === 2 ? undefined : game.players.find(
            player => player.color === "green"
          ) ? (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(115deg) brightness(2)" }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "green").isBot
                  ? Logo
                  : game.players.find(player => player.color === "green").avatar
              }
              className={classes.avatar}
            />
            <span>
              {game.players.find(player => player.color === "green").username}
            </span>
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "green")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(115deg) brightness(2)" }}
            />
            <Avatar variant="rounded" className={classes.avatar} />
            <JoinBtn
              color="#22e302"
              variant="contained"
              onClick={() => (!joining ? joinGame("green") : null)}
              disabled={joining}
            >
              {joining === "green"
                ? "Joining..."
                : `Join ($${
                    game.privateGame
                      ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                      : game.betAmount.toFixed(2)
                  })`}
            </JoinBtn>
          </Box>
        )}
        {game.playerAmount !== 4 ? undefined : game.players.find(
            player => player.color === "yellow"
          ) ? (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(66deg) brightness(2)" }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "yellow").isBot
                  ? Logo
                  : game.players.find(player => player.color === "yellow")
                      .avatar
              }
              className={classes.avatar}
            />
            <span>
              {game.players.find(player => player.color === "yellow").username}
            </span>
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "yellow")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupColor}
              alt="cupColor"
              style={{ filter: "hue-rotate(66deg) brightness(2)" }}
            />
            <Avatar variant="rounded" className={classes.avatar} />
            <JoinBtn
              color="#e3da1b"
              variant="contained"
              onClick={() => (!joining ? joinGame("yellow") : null)}
              disabled={joining}
            >
              {joining === "yellow"
                ? "Joining..."
                : `Join ($${
                    game.privateGame
                      ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                      : game.betAmount.toFixed(2)
                  })`}
            </JoinBtn>
          </Box>
        )}
      </Box>
      <Box className={classes.result}>
        {game.status === 2 && (
          <Box className={classes.waitingResult}>
            <ColorCircularProgress />
          </Box>
        )}
        {game.status === 3 ? (
          <Animation
            players={game.playerAmount}
            winner={getWinner(game.winningCup)}
          />
        ) : (
          <Waiting players={game.playerAmount} />
        )}
      </Box>
    </Box>
  );
};

Game.propTypes = {
  game: PropTypes.object.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Game);
