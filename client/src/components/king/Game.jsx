import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { kingSocket } from "../../services/websocket.service";
import Countdown from "react-countdown";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import EnemyCup from "./EnemyCup";
import Provably from "../modals/king/ProvablyModal";
import PrivateGameModal from "../modals/king/PrivateGameModal";
import PrivateGameJoinModal from "../modals/PrivateGameJoinModal";

// Icons
import CasinoIcon from "@material-ui/icons/Casino";
import LinkIcon from "@material-ui/icons/Link";

// Assets
import vs from "../../assets/vs.png";
import green from "../../assets/greenKing.png";
import blue from "../../assets/blueKing.png";
import red from "../../assets/redKing.png";

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
    position: "relative",
    height: "10rem",
    width: "100%",
    marginBottom: 10,
    border: "1px solid #111729",
    borderRadius: 5,
  },
  provably: {
    background: "#111729",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
    width: "3rem",
    borderRadius: "5px 0 0 5px",
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
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    alignItems: "flex-start",
    marginLeft: "3rem",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      marginLeft: "1rem",
      marginBottom: "1rem",
      justifyContent: "flex-end",
    },
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
    alignItems: "flex-start",
    justifyContent: "space-around",
    [theme.breakpoints.down("xs")]: {
      alignItems: "center",
      width: "100%",
      margin: "0 1rem",
    },
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      margin: "0 1rem",
      alignItems: "center",
    },
  },
  player: {
    display: "flex",
    color: "white",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
    "& img": {
      height: "auto",
    },
    "& span": {
      marginLeft: "1rem",
      marginRight: "1rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  result: {
    background: "#070A15",
    width: "30%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  avatar: {
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
  vs: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 2rem",
  },
  waitTitle: {
    color: "white",
    position: "absolute",
    fontSize: 15,
    margin: 0,
    textAlign: "center",
  },
  winnerOverlay: {
    position: "absolute",
    zIndex: 10,
    height: "100%",
    width: "100%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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
    "& .MuiButton-label": {
      marginRight: 0,
    },
    "& .MuiTouchRipple-root": {
      marginRight: 0,
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
const Ball = withStyles({
  root: {
    width: 10,
    height: 10,
    background: "white",
    borderRadius: "100%",
    position: "absolute",
    transition: "0.25s ease",
    top: props => props.top,
    left: props => props.left,
    zIndex: 0,
  },
})(Box);

// Custom Styled Component
const Play = withStyles({
  root: {
    height: 64,
    width: 80,
    top: props => (props.picked ? -20 : 0),
    padding: "0 10px",
    transition: "0.25s ease",
    cursor: "pointer",
    position: "relative",
    background: props => props.bg,
    pointerEvents: props => props.events,
    backgroundSize: "contain !important",
    backgroundPosition: "center !important",
    backgroundRepeat: "no-repeat !important",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
})(Box);

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

// Renderer callback with condition
const renderer = ({ seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return "Choosing automatically...";
  } else {
    // Render a countdown
    return `${seconds}s`;
  }
};

const Game = ({ game, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [top, setTop] = useState(80);
  const [left, setLeft] = useState(null);
  const [joining, setJoining] = useState(false);
  const [moving, setMoving] = useState(false);
  const [chosenCup, setChosenCup] = useState(null);
  const [provablyModalVisible, setProvablyModalVisible] = useState(false);
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  // Round rolled, show animation
  const roundResult = (gameId, cupChosen, winningCup, didWin) => {
    if (gameId !== game._id) return;

    // Update state
    setMoving(false);
    setChosenCup(cupChosen);

    // Declare additional selectors
    const cups = ["green", "red", "blue"];
    const positions = ["50px", "auto", "213px"];

    // // If user won
    // if (didWin) {
    //   // Move ball down
    //   setTop(100);
    // }

    setTop(100);
    // Move ball under the right cup
    setLeft(positions[cups.indexOf(winningCup)]);
  };

  // Join a king game
  const joinGame = () => {
    // If this is a private game
    if (game.privateGame) {
      setJoinModalVisible(true);
    } else {
      setJoining(true);
      kingSocket.emit("join-game", game._id);
    }
  };

  // Captcha value changed (completed)
  const captchaOnChange = response => {
    setJoining(true);
    kingSocket.emit("join-game", game._id, response);
  };

  // Make a move in the game
  const onClick = e => {
    if (moving) return;

    // Update state
    setMoving(true);

    console.log("Moving a cup:", moving);

    const cup = e.target.dataset.cup;
    kingSocket.emit("make-move", game._id, cup);
  };

  // Calculate from round numbers who's turn it is
  const getCurrentTurn = () =>
    game.roundNumber % 2 === 0 ? "opponent" : "creator";

  // New round started, reset variables
  const newRound = gameId => {
    if (gameId !== game.id) return;
    setChosenCup(null);
  };

  // componentDidMount
  useEffect(() => {
    // Error while joining a game
    const joinError = (gameId, msg) => {
      if (gameId !== game._id) return;
      setJoining(false);
      addToast(msg, { appearance: "error" });
      setJoinModalVisible(false);
    };

    // Error while making a move
    const moveError = (gameId, msg) => {
      if (gameId !== game._id) return;
      setMoving(false);
      addToast(msg, { appearance: "error" });
    };

    // Success joining a game
    const joinSuccess = gameId => {
      if (gameId !== game._id) return;
      setJoining(false);
      setJoinModalVisible(false);
      addToast("Successfully joined a game!", { appearance: "success" });
    };

    // Polyfill to work out why this is not working out
    const notifySuccess = (gameId, msg) => {
      if (gameId !== game._id) return;
      addToast(msg, { appearance: "success" });
    };

    // Listeners
    kingSocket.on("game-join-error", joinError);
    kingSocket.on("game-join-success", joinSuccess);
    kingSocket.on("move-making-error", moveError);
    kingSocket.on("round-result", roundResult);
    kingSocket.on("new-round", newRound);
    kingSocket.on("notify-success", notifySuccess);

    // componentDidUnmount
    return () => {
      // Remove listeners
      kingSocket.off("game-join-error", joinError);
      kingSocket.off("game-join-success", joinSuccess);
      kingSocket.off("move-making-error", moveError);
      kingSocket.off("round-result", roundResult);
      kingSocket.off("new-round", newRound);
      kingSocket.off("notify-success", notifySuccess);
    };
    // eslint-disable-next-line
  }, [addToast]);

  // When new round is generated, reset choosings
  useEffect(() => {
    setChosenCup(null);
  }, [game]);

  return (
    <Box
      className={classes.round}
      style={game.ownPrivateGame ? { border: "1px solid #4f79fd" } : {}}
    >
      {game.privateGame && (
        <PrivateGameJoinModal
          loading={joining}
          open={joinModalVisible}
          handleClose={() => setJoinModalVisible(state => !state)}
          onChange={captchaOnChange}
        />
      )}
      {game.status === 4 && (
        <Box className={classes.winnerOverlay}>
          <h4>Winner:</h4>
          <Box className={classes.player}>
            <Avatar
              src={
                game._winner &&
                (game._winner === game._creator._id
                  ? game._creator.avatar
                  : game._opponent.avatar)
              }
              variant="rounded"
              className={classes.avatar}
            />
            <span>
              {game._winner &&
                (game._winner === game._creator._id
                  ? game._creator.username
                  : game._opponent.username)}
            </span>
          </Box>
        </Box>
      )}
      <Provably
        game={game}
        handleClose={() => setProvablyModalVisible(state => !state)}
        open={provablyModalVisible}
      />
      {game.ownPrivateGame && (
        <PrivateGameModal
          open={privateGameModalVisible}
          handleClose={() => setPrivateGameModalVisible(state => !state)}
          link={game.inviteLink}
        />
      )}
      <Box
        className={classes.provably}
        style={
          game.status === 4 ? { opacity: 0.4, transition: "all 0.3s ease" } : {}
        }
      >
        <IconButton
          onClick={() => setProvablyModalVisible(state => !state)}
          color="primary"
        >
          <CasinoIcon />
        </IconButton>
        {game.ownPrivateGame && (
          <IconButton
            onClick={() => setPrivateGameModalVisible(state => !state)}
            color="primary"
          >
            <LinkIcon />
          </IconButton>
        )}
      </Box>
      <Box
        className={classes.value}
        style={
          game.status === 4 ? { opacity: 0.4, transition: "all 0.3s ease" } : {}
        }
      >
        <h1>${(game.betAmount * 2).toFixed(2)}</h1>
        <h3>VALUE</h3>
      </Box>
      <Box
        className={classes.players}
        style={
          game.status === 4 ? { opacity: 0.4, transition: "all 0.3s ease" } : {}
        }
      >
        {game._creator === null ? (
          <Box className={classes.player}>
            <Avatar variant="rounded" className={classes.avatar} />
            <JoinBtn
              color="#4f79fd"
              variant="contained"
              onClick={() => joinGame()}
            >
              Join
            </JoinBtn>
          </Box>
        ) : (
          <Box className={classes.player}>
            <Avatar
              src={game._creator.avatar}
              variant="rounded"
              className={classes.avatar}
            />
            <span>{game._creator.username}</span>
          </Box>
        )}
      </Box>
      {game.status === 4 ? (
        <Fragment />
      ) : game.status === 1 ? (
        <Box className={classes.result}>
          <EnemyCup />
        </Box>
      ) : getCurrentTurn() === "creator" ? (
        game.status === 3 || moving ? (
          <Box className={classes.result}>
            <ColorCircularProgress className={classes.waitTitle} />
            <EnemyCup opacity={0.2} />
          </Box>
        ) : user && game._creator._id === user._id ? (
          <Box className={classes.result}>
            <Ball left={left} top={top} />
            <Play
              data-cup="green"
              events="all"
              style={
                chosenCup === "green"
                  ? { top: "-1rem" }
                  : chosenCup
                  ? { top: "-0.5rem" }
                  : {}
              }
              bg={`url(${green})`}
              onClick={onClick}
            />
            <Play
              data-cup="red"
              events="all"
              style={
                chosenCup === "red"
                  ? { top: "-1rem" }
                  : chosenCup
                  ? { top: "-0.5rem" }
                  : {}
              }
              bg={`url(${red})`}
              onClick={onClick}
            />
            <Play
              data-cup="blue"
              events="all"
              style={
                chosenCup === "blue"
                  ? { top: "-1rem" }
                  : chosenCup
                  ? { top: "-0.5rem" }
                  : {}
              }
              bg={`url(${blue})`}
              onClick={onClick}
            />
          </Box>
        ) : (
          <Box className={classes.result}>
            <h2 className={classes.waitTitle}>
              Opponents turn...
              <br />
              <Countdown
                key={game.nextAutoChoose}
                date={game.nextAutoChoose}
                renderer={renderer}
              />
            </h2>
            <EnemyCup opacity={0.2} />
          </Box>
        )
      ) : getCurrentTurn() === "opponent" ? ( // Opponent's turn (not this side's)
        user && game._creator._id === user._id ? ( // Not your turn
          <Box className={classes.result}>
            <EnemyCup />
          </Box>
        ) : user && game._opponent && game._opponent._id === user._id ? ( // Your turn on the other side
          <Box className={classes.result}>
            <h2 className={classes.waitTitle}>
              Your turn!
              <br />
              Time left before auto-choose:
              <br />
              <Countdown
                key={game.nextAutoChoose}
                date={game.nextAutoChoose}
                renderer={renderer}
              />
            </h2>
            <EnemyCup opacity={0.2} />
          </Box>
        ) : (
          <Box className={classes.result}>
            <EnemyCup />
          </Box>
        )
      ) : (
        <Box className={classes.result}>
          <EnemyCup />
        </Box>
      )}
      <Box
        className={classes.vs}
        style={
          game.status === 4 ? { opacity: 0.4, transition: "all 0.3s ease" } : {}
        }
      >
        <img src={vs} alt="vs" />
      </Box>
      <Box
        className={classes.players}
        style={
          game.status === 4 ? { opacity: 0.4, transition: "all 0.3s ease" } : {}
        }
      >
        {game._opponent ? (
          <Box className={classes.player}>
            <Avatar
              src={game._opponent.avatar}
              variant="rounded"
              className={classes.avatar}
            />
            <span>{game._opponent.username}</span>
          </Box>
        ) : (
          <Box className={classes.player}>
            <Avatar variant="rounded" className={classes.avatar} />
            <JoinBtn
              color="#4f79fd"
              variant="contained"
              onClick={() => joinGame()}
            >
              {joining
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
      {game.status === 4 ? (
        <Fragment />
      ) : game.status === 1 ? (
        <Box className={classes.result}>
          <h2 className={classes.waitTitle}>Waiting for Opponent</h2>
          <EnemyCup opacity={0.2} />
        </Box>
      ) : getCurrentTurn() === "opponent" ? ( // Opponent's turn
        game.status === 3 || moving ? ( // Loading data
          <Box className={classes.result}>
            <ColorCircularProgress className={classes.waitTitle} />
            <EnemyCup opacity={0.2} />
          </Box>
        ) : user && game._opponent._id === user._id ? ( // Your turn
          <Box className={classes.result}>
            <Ball left={left} top={top} />
            <Play
              data-cup="green"
              events="all"
              bg={`url(${green})`}
              onClick={onClick}
            />
            <Play
              data-cup="red"
              data-round={game.roundID}
              events="all"
              bg={`url(${red})`}
              onClick={onClick}
            />
            <Play
              data-cup="blue"
              data-round={game.roundID}
              events="all"
              bg={`url(${blue})`}
              id={game.roundID}
              onClick={onClick}
            />
          </Box>
        ) : (
          // Not your turn
          <Box className={classes.result}>
            <h2 className={classes.waitTitle}>
              Opponents turn...
              <br />
              <Countdown
                key={game.nextAutoChoose}
                date={game.nextAutoChoose}
                renderer={renderer}
              />
            </h2>
            <EnemyCup opacity={0.2} />
          </Box>
        )
      ) : getCurrentTurn() === "creator" ? ( // Creator's turn (not this side's)
        user && game._opponent && game._opponent._id === user._id ? ( // Not your turn
          <Box className={classes.result}>
            <EnemyCup />
          </Box>
        ) : user && game._creator._id === user._id ? ( // Your turn on the other side
          <Box className={classes.result}>
            <h2 className={classes.waitTitle}>
              Your turn!
              <br />
              Time left before auto-choose:
              <br />
              <Countdown
                key={game.nextAutoChoose}
                date={game.nextAutoChoose}
                renderer={renderer}
              />
            </h2>
            <EnemyCup opacity={0.2} />
          </Box>
        ) : (
          <Box className={classes.result}>
            <EnemyCup />
          </Box>
        )
      ) : (
        <Box className={classes.result}>
          <EnemyCup />
        </Box>
      )}
    </Box>
  );
};

Game.propTypes = {
  game: PropTypes.object.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Game);
