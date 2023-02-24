import React, { Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";
import Countdown from "react-countdown";

// MUI Components
import Box from "@material-ui/core/Box";
import { useEffect } from "react";
import Rocket from "../../assets/Rocket.webp";
import CrashBG from '../../assets/crash-game-bg.webp'

// Custom Styled Componen
const Cup = withStyles({
  root: {
    position: "relative",

    display: "flex",
    width: "100%",
    height: "100%",
    // backgroundImage: "url('../../assets/graph.png')",
    backgroundRepeat: 'no-repeat',
    backgroundImage: "url('/crash-game-bg.png')",
    backgroundSize: "100% 100%",
    paddingBottom: 16,
    // "&::after": {
    //   content: "''",
    //   position: "absolute",
    //   left: "50%",
    //   bottom: "-18px",
    //   transform: "translateX(-50%)",
    //   width: "80%",
    //   height: "20px",
    //   backgroundColor: "#4263cb",
    //   borderBottomLeftRadius: 20,
    //   borderBottomRightRadius: 20,
    //   zIndex: -1,
    //   transition: "background-color 0.2s linear",
    // },


    "& .svg-y": {
      position: "absolute",
      width: "100%",
      height: "100%",
      stroke: "#4d79ff",
      strokeWidth: "3px",
    },
    "& .mid": {
      position: "absolute",
      top: "0%",
      left: "0%",

      strokeDasharray: "1250",
      strokeDashoffset: "1250",


      // width: "100%",
      // height: "17.2vw",
      // minHeight: 215,
      // maxHeight: 380,
      // clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
      // backgroundColor: "rgba(52, 113, 255, 0.6)",
      // overflow: "hidden",
      // transition: "background-color 0.2s linear",

      // position: "absolute",
      // left: "-40px",
      // top: 0,
      // width: "calc(85% + 40px)",
      // height: 330,
      // clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
      // backgroundColor: "rgba(77, 121, 255, 0.15)",
      // transition: "background-color 0.2s linear",
      // "&::after": {
      //   content: "''",
      //   position: "absolute",
      //   left: "0",
      //   bottom: "-20px",
      //   width: "100%",
      //   height: "20px",
      //   backgroundColor: "#4263cb",
      //   borderBottomLeftRadius: 20,
      //   borderBottomRightRadius: 20,
      //   transition: "background-color 0.2s linear",
      // },

      //   "& .water": {
      //     position: "absolute",
      //     bottom: 0,
      //     height: "100%",
      //     width: "100%",
      //     overflow: "hidden",
      //     transition: "height 0.4s linear",
      //     "& div": {
      //       position: "absolute",
      //       bottom: "15%",
      //       left: "50%",
      //       marginLeft: -500,
      //       marginBottom: -1025,
      //       width: 1000,
      //       height: 1025,
      //       borderRadius: "40%",
      //       backgroundColor: "#4263cb",
      //       zIndex: -1,
      //       transition: "background-color 0.2s linear, bottom 1s linear",
      //       animation: "$water 15s linear infinite",
      //     },
      //   },
      // },
      // "& .topBar": {
      //   position: "absolute",
      //   height: 15,
      //   width: "85%",
      //   left: "50%",
      //   top: 25,
      //   backgroundColor: "rgba(39, 66, 150, 0.55)",
      //   transform: "translateX(-50%) translateY(-50%)",
      //   borderRadius: 30,
      //   transition: "background-color 0.2s linear",
      // },
      // "& .midBar": {
      //   position: "absolute",
      //   height: 15,
      //   width: "72.5%",
      //   left: "50%",
      //   top: 50,
      //   backgroundColor: "rgba(39, 66, 150, 0.55)",
      //   transform: "translateX(-50%) translateY(-50%)",
      //   borderRadius: 30,
      //   transition: "background-color 0.2s linear",
      // },
      // "& .bottomBar": {
      //   position: "absolute",
      //   height: 15,
      //   width: "45%",
      //   left: "50%",
      //   bottom: -15,
      //   backgroundColor: "rgba(39, 66, 150, 0.55)",
      //   transform: "translateX(-50%) translateY(-50%)",
      //   borderRadius: 30,
      //   zIndex: 1,
      //   transition: "background-color 0.2s linear",
      // },
      // "& .top": {
      //   position: "absolute",
      //   height: 25,
      //   width: "19.3vw",
      //   minWidth: 255,
      //   maxWidth: 420,
      //   left: "50%",
      //   top: -25,
      //   backgroundColor: "#e3e3e3",
      //   transform: "translateX(-50%)",
      //   borderRadius: 30,
      //   "&::before": {
      //     content: "''",
      //     position: "absolute",
      //     left: 0,
      //     bottom: 0,
      //     width: "92.5%",
      //     height: "100%",
      //     backgroundColor: "#F4F4F4",
      //     borderRadius: 30,
      //   },
    },

    "& .animation-play": {
      animation: "$dash  8s linear forwards 1",
      animationPlayState: "running",
    },
    "& .animation-stop": {
      animation: "none",
    },
    "& .animation-play2": {
      animation: "$x 5.75s linear forwards 1",
      animationPlayState: "running",
    },

    "&.crashed": {
      backgroundColor: "#ff7b7b",
      opacity: "0.1",
      // "&::after": {

      // },
      "& .mid2": {
        animation: "none",
      },
      "& .mid": {
        animation: "none",
        strokeDasharray: "1250",
        strokeDashoffset: "1250",

        "& .shade": {
          // backgroundColor: "rgba(255, 77, 77, 0.15)",
        },

        // "& .water": {
        //   "& div": {
        //     backgroundColor: "#ff7b7b",
        //   },
        // },
      },
      // "& .topBar": {
      //   backgroundColor: "rgba(142, 54, 54, 0.55)",
      // },
      // "& .midBar": {
      //   backgroundColor: "rgba(142, 54, 54, 0.55)",
      // },
      // "& .bottomBar": {
      //   backgroundColor: "rgba(142, 54, 54, 0.55)",
      // },
    },
    "& .marker": {
      offsetPath: " path('M 2 98 Q 68 89 85 20 ')",
      border:"1px solid red",
      position: "absolute",
      transform: "rotatez(45deg) ",
    },
  },
  // "@keyframes water": {
  //   from: { transform: "rotate(0deg)" },
  //   to: { transform: "rotate(360deg)" },
  // },
  "@keyframes dash": {
    to: {
      strokeDashoffset: 0,
    },
  },
  "@keyframes x": {
    to: {
      transform: "rotateZ(58deg)",
      offsetDistance: "100%",
    },
  },
  "@keyframes y": {
    to: {},
  },

  "@keyframes move1": {
    to: {
      offsetDistance: "100%",
    },
  },
})(Box);

const useStyles = makeStyles({
  meta: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    textAlign: "center",
  },
  payout: {
    color: "#fff",
    fontSize: "3.125rem",
    fontWeight: "700",
    userSelect: "none",
    lineHeight: 1,
  },
  profit: {
    color: "#fff",
    fontSize: "1.85rem",
    fontWeight: "600",
    userSelect: "none",
    lineHeight: 1,
    marginTop: 3,
    transition: "color 0.4s ease",
    "&.cashed": {
      color: "#6afe43",
    },
  },
});

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

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return "In Progress";
  } else {
    // Render a countdown
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
};

const renderText = ({ payout, gameState, startTime }) => {
  return (
    <>
      {gameState === GAME_STATES.InProgress && `${payout.toFixed(2)}x`}
      {
        gameState === GAME_STATES.Starting && <Fragment>
                <div>
                  <div>
                    <Countdown
                      key={startTime}
                      date={startTime}
                      renderer={renderer}
                    />
                  </div>
                  <div style={{
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}>
                    Starting...
                  </div>
                </div>
              </Fragment>
      }
      {gameState === GAME_STATES.Over && `Crashed`}
    </>
  )
}

const CupAnimation = ({ loading, payout, ownBet, gameState, startTime }) => {
  const classes = useStyles();
  // console.log(loading, payout, ownBet, gameState)
  console.log(gameState)
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Cup
        className={ `${gameState === GAME_STATES.Over ? "crashed" : "running"}`}
      >
        <svg
          className="svg-y"
          fill="transparent"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >

          <path
            d="M 5 98 Q 70 90 88 15" //350/95
            vectorEffect="non-scaling-stroke"
            fill="transparent"
            stroke="#4d79ff"
            className={`${
              gameState === GAME_STATES.InProgress
                ? "animation-play mid"
                : "animation-stop mid"
            }`}
            style={{ position: "absolute" }}
          />
          <image width="15" height="15" y="-15" x="0" href={Rocket} className={`${
              gameState === GAME_STATES.InProgress
                ? "animation-play2 marker"
                : "animation-stop marker"
            }`}/>
        </svg>


        {/* <div className="water"> */}
        <div
          style={{
            bottom:
              gameState === GAME_STATES.InProgress
                ? `${(payout / 100) * 95 + 15}%`
                : "15%",
          }}
        ></div>
        {/* </div> */}

        {/* <div className="top"></div>
        <div className="topBar"></div>
        <div className="midBar"></div>
        <div className="bottomBar"></div> */}
      </Cup>
      <div className={classes.meta}>
        <div className={classes.payout}>
          {/* {loading ? "Loading" : `${payout.toFixed(2)}x`} */}
          {loading && `loading`}
          {!loading && renderText({ payout, gameState, startTime })}
          {/* {gameState === GAME_STATES.InProgress && `${payout.toFixed(2)}x`} */}
        </div>
        {(gameState === GAME_STATES.InProgress ||
          gameState === GAME_STATES.Over) &&
          ownBet && (
            <div
              className={`${classes.profit} ${
                ownBet.status === BET_STATES.CashedOut ? "cashed" : ""
              }`}
            >
              +$
              {ownBet.status === BET_STATES.Playing
                ? parseCommasToThousands(
                    cutDecimalPoints((ownBet.betAmount * payout).toFixed(7))
                  )
                : parseCommasToThousands(
                    cutDecimalPoints(ownBet.winningAmount.toFixed(7))
                  )}
            </div>
          )}
      </div>
    </div>
  );
};

export default CupAnimation;