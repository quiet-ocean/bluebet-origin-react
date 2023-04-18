import { withStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%",
    marginBottom: "3em",
    // paddingLeft: "13%",
    // paddingRight: "13%",
    // paddingTop: 30,
    
    paddingTop: 0,
    paddingBottom: 120,
    // marginTop: 12,
    [theme.breakpoints.up('sm')]: {
      padding: '0 92px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px',
    },
    [theme.breakpoints.down("xs")]: {
      paddingTop: 25,
    },
    "& > div > div": {
      justifyContent: "space-around",
    },
  },
  container: {
    maxWidth: 1500,
    padding: '0px !important',
    
  },
  //
  vipBar: {
    padding: "2.5em 1em 2.5em 1em",
    marginLeft: "5%",
    width: "90%",
    height: "4em",
    backgroundColor: "#121420",
    position: "",
    borderRadius: "5px",
  },
  vipBarMini: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0A0C1A",
    position: "relative",
    zIndex: 1000,
    paddingTop: "5px",
    textAlign: "center",
    color: "#FFFFFF",
    "&::after": {
      borderRadius: "5px",
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      width: "50%",
      height: "100%",
      backgroundColor: "#3f51b5",
      zIndex: -100,
    },
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
  vipTitle: {
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "4rem",
    color: "white",
    "& > span": {
      color: "#507afd",
    },
  },
  progressbox: {
    margin: "0 1rem",
    marginTop: "-1.2rem",
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
    "& span": {
      position: "absolute",
      top: "-6%",
      left: "97%",
      width: "5%",
      height: "auto",
      background: "url('../assests/Crown.webp')",
      backgroundSize: "100% 100%",
      zIndex: 1000,
      "& img": {
        width: "100%",
        height: "auto",
      },
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
    maxWidth: "56rem",
    alignItems: "center",
    justifyContent: "flex-end",
    // maskImage: "linear-gradient(240deg,rgba(0,0,0,1) 34%,rgba(0,0,0,0))",
    overflow: "hidden",
  },
  game: {
    display: "flex",
    width: "66%",
    height: "64vh",
    position: 'relative',
    [theme.breakpoints.down("xs")]: {
      height: "auto",
      width: "100%",
    },
  },
  game1: {
    display: "flex",
    width: "30%",
    // height: "68vh",
    [theme.breakpoints.down("xs")]: {
      height: "auto",
      width: "100%",
    },
  },
  cup: {
    // padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: 400,
    margin: "auto",
    position: "relative",
    overflow: "hidden",
    background: "#0A0C1A",
    // backgroundImage: "url('/crash-game-bg.png)",
    // backgroundSize: "contain",
    // borderRadius: 8,
    borderRadius: 5,    
    transition: "1s ease",
  },
  gameInfo: {
    position: "absolute",
    top: 7.5,
    left: 10,
    color: "#4b5064",
    fontSize: 12,
    fontWeight: 700,
    zIndex: 10,
    "& span": {
      display: "flex",
      alignItems: "center",
      "& svg": {
        marginRight: 4,
      },
    },
  },
  maxProfit: {
    position: "absolute",
    top: 7.5,
    right: 10,
    color: "#4b5064",
    fontSize: 12,
    fontWeight: 700,
    zIndex: 10,
    "& span": {
      display: "flex",
      alignItems: "center",
      "& svg": {
        marginRight: 4,
      },
    },
  },
  placeBet: {
    // background: "#111429",
    // borderBottomRightRadius: 5,
    borderRadius: 5,
    // borderBottomLeftRadius: 5,
    // marginTop: "1.5rem",
    background: "#0A0C1A",
    // height: "33vh",
    "& button": {
      color: "white",
      transition: "0.25s ease",
      opacity: 0.75,
      padding: "0.2em",
      "&:hover": {
        textShadow: "0px 0px 10px",
        opacity: 1,
      },
    },
  },
  inputIcon: {
    color: "#4d79ff",
    background: "transparent !important",
  },
  progress: {
    background: "#0f101a !important",
    height: "2.5rem",
    borderRadius: "0.25rem",
    // transform: "skew(-20deg)",
    position: "relative",
    marginTop: "-5px",

    "& > div": {
      background:
        "-webkit-linear-gradient( 0deg, rgb(79,121,253) 0%, rgb(110,145,255) 100%) !important",
    },
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "#292E41",
    // padding: "16px 14px 0",
    lineHeight: 1,
  },
  splitTitle: {
    display: "inline-block",
    fontSize: 14,
    fontWeight: 600,
    color: "#292E41",
    // padding: "16px 14px 0",
    lineHeight: 1,
    // width: "50%",
  },
  contain: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  multiplier2: {
    minWidth: "2em",
    backgroundColor: "transparent",
    borderColor: "transparent",
    border: "none",
    position: "absolute",
    marginTop: "0.3em",
    left: "65%",
    color: "white",
    // transform: "skew(-20deg)",
    // marginRight: 5,
    // marginBottom: "0.5rem",
    // marginTop: "0.5rem",
    height: "65%",
  },
  multiplier1: {
    minWidth: "2em",
    backgroundColor: "transparent",
    borderColor: "transparent",
    border: "none",
    position: "absolute",
    marginTop: "0.3em",
    height: "65%",
    left: "83%",
    color: "white",
    // transform: "skew(-20deg)",
    marginRight: 5,
  },
  betCont: {
    display: "flex",
    width: "100%",
    // marginLeft: "5.5%",
    // marginRight: "5.5%",
    flexDirection: "column",
    position: "relative",
    // justifyContent: "center",
    // alignItems: "center",
    // flexWrap: "wrap",
    // margin: "auto",
    padding: "0.5rem 0 0",
  },
  cashoutCont: {
    display: "inline-flex",
    width: "50%",
    justifyContent: "flex-start",
    alignItems: "center",
    // paddingLeft: 10,
    padding: "0.5rem 0 1.25rem",
  },
  autoCont: {
    display: "inline-flex",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    padding: "0.5rem 0 1.25rem",
  },
  reverse: {
    // transform: "skew(15deg)",
    // fontSize: "0.8em",
    fontSize: 14,
  },
  bet: {
    // minWidth: "90%",
    width: '100%',
    // marginLeft: "5%",
    fontSize: 14,
    padding: "0.5em !important",
    backgroundColor: "#4d79ff",
    borderColor: "#FF4D4D",
    color: "white",
    // transform: "skew(-20deg)",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#4f79fd",
    },
  },
  cashout: {
    minWidth: "100%",
    backgroundColor: "#f44336",
    borderColor: "#f44336",
    color: "white",
    // transform: "skew(-20deg)",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#f44336",
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(244, 67, 54, 0.4)",
      color: "white",
    },
  },
  betControl: {
    padding: '8px 12px 0 12px',
    '& > p': {
      fontWeight: 400,
    }
  },
  liveBetsWrapper: {
    [theme.breakpoints.up('sm')]: {
      padding: '0 92px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 16px',
    },
  }
}));

export default useStyles
