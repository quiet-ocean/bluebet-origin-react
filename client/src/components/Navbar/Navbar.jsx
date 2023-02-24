import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { NavLink as Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Skeleton from "@material-ui/lab/Skeleton";

// Icons
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import ContactSupport from "@material-ui/icons/ContactSupport";
import ControlCamera from "@material-ui/icons/ControlCamera";
import FlashOnIcon from "@material-ui/icons/FlashOn";
// import StarIcon from "@material-ui/icons/Star";

// Modals
import Market from "../modals/MarketModal";
import Help from "../modals/HelpModal";
import Deposit from "../modals/DepositModal";
import Vip from "../modals/VIPModal";
import Coupon from "../modals/CouponModal";
import Free from "../modals/FreeModal";

// Assets
import cup from "../../assets/cup.png";
import spin from "../../assets/roll.png";
import king from "../../assets/king.png";
import shuffle from "../../assets/shuffle.png";
import crash from "../../assets/crash.png";
import logo from '../../assets/blue-bet-logo.png'

const useStyles = makeStyles(theme => ({
  root: {
    background: "#080B19",
    display: "flex",
    width: "100%",
    boxShadow: "none",
    padding: "1rem 1rem",
    position: "fixed",
    zIndex: 10,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%",
    },
    "& .MuiToolbar-gutters": {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },
  },
  menu: {
    color: "#424863",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
    },
  },
  active: {
    "& > button": {
      height: "3rem",
      width: "5rem",
      backgroundColor: "#4F79FD",
      borderColor: "#4F79FD",
      color: "white",
      // transform: "skew(-20deg)",
      marginRight: 20,
      "& img": {
        opacity: "1 !important",
      },
    },
  },
  reverse: {
    // transform: "skew(20deg)",
    textTransform: "capitalize",
    display: "flex",
    "& .crash": {
      height: 35,
    },
  },
  notactive: {
    textDecoration: "none",
    "& > button": {
      width: "5rem",
      height: "3rem",
      borderColor: "#313548",
      color: "#313548",
      // transform: "skew(-20deg)",
      marginRight: 20,
      [theme.breakpoints.down("sm")]: {
        width: "4rem",
        marginRight: 5,
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        // transform: "skew(20deg)",
      },
    },
  },
  sub: {
    textDecoration: "none",
    "& > button": {
      width: "6rem",
      height: "3rem",
      borderColor: "#313548",
      color: "#313548",
      transform: "skew(-20deg)",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
        marginRight: 5,
      },
      "& .makeStyles-reverse-231": {
        [theme.breakpoints.down("lg")]: {
          display: "none",
        },
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "skew(20deg)",
        [theme.breakpoints.down("lg")]: {
          marginRight: 0,
        },
      },
    },
  },
  free: {
    textDecoration: "none",
    "& > button": {
      width: "7rem",
      height: "3rem",
      color: "#ffd027",
      textShadow: "0px 0px 20px #ffd027",
      transform: "skew(-20deg)",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
        marginRight: 5,
      },
      "& .makeStyles-reverse-231": {
        [theme.breakpoints.down("lg")]: {
          display: "none",
        },
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "skew(20deg)",
        [theme.breakpoints.down("lg")]: {
          marginRight: 0,
        },
      },
    },
  },
  subActive: {
    textDecoration: "none",
    "& > button": {
      width: "6rem",
      height: "3rem",
      borderColor: "#313548",
      color: "#4e7afd",
      textShadow: "0px 0px 30px",
      transform: "skew(-20deg)",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
        marginRight: 5,
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        transform: "skew(20deg)",
        [theme.breakpoints.down("lg")]: {
          marginRight: 0,
        },
      },
    },
  },
  balance: {
    display: "flex",
    flexDirection: "column",
    background: "#111427",
    transform: "skew(-15deg)",
    marginLeft: "auto",
    padding: "0.5rem 5rem 0.5rem 1.5rem",
    borderRadius: "0.25rem",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& span": {
      color: "#4c4f61",
      textTransform: "uppercase",
      fontSize: 8,
    },
  },
  price: {
    fontSize: 15,
  },
  plus: {
    position: "absolute",
    background: "#84C46D",
    padding: "0.25rem 0.3rem",
    right: "-1rem",
    top: "0.75rem",
    minWidth: 30,
    "&:hover": {
      background: "#59ba6e",
    },
    "& span": {
      color: "white",
    },
  },
  pfp: {
    transform: "skew(-15deg)",
    marginLeft: "2rem",
    background: "#181B2B",
    padding: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
    },
  },
  controls: {
    marginTop: 20,
  },
  right: {
    display: "flex",
    marginLeft: "auto",
  },
  create: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
    color: "white",
    transform: "skew(-20deg)",
    marginRight: 20,
  },
  multiplier: {
    backgroundColor: "#181B2B",
    borderColor: "#181B2B",
    color: "white",
    transform: "skew(-20deg)",
    marginRight: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    transform: "skew(-20deg)",
  },
  modal: {
    "& div > div": {
      background: "#171a32",
      color: "#fff",
    },
  },
  rightMenu: {
    "& > .MuiPaper-root ": {
      backgroundColor: "#1d2342",
      color: "#fff",
      width: "10rem",
      top: "4rem !important",
      right: "3rem !important",
      left: "auto !important",
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  desktop: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  mobileNav: {
    display: "flex",
    position: "fixed",
    bottom: 0,
  },
  steam: {
    textTransform: "capitalize",
    width: "7.5rem",
    background: "linear-gradient(45deg, #081232, #3d3f64)",
    color: "white",
    marginLeft: "auto",
    "&:hover": {
      background: "linear-gradient(45deg, #081232, #3d3f64)",
    },
  },
  google: {
    textTransform: "capitalize",
    width: "7.5rem",
    background: "linear-gradient(45deg, #4f79fd, #4fc5fd)",
    color: "white",
    marginLeft: "1rem",
    "&:hover": {
      background: "linear-gradient(45deg, #4f79fd, #4fc5fd)",
    },
  },
  login: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    "& > button": {
      height: 40,
    },
    "& > h5": {
      marginRight: 20,
      fontWeight: 200,
      color: "#454872",
    },
  },
  noLink: {
    textDecoration: "none",
  },
}));

const Navbar = ({ isAuthenticated, isLoading, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const [openMarket, setOpenMarket] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openVip, setOpenVip] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mbAnchorEl, setMbAnchorEl] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState(null);
  const open = Boolean(anchorEl);
  const openMobile = Boolean(mbAnchorEl);

  // If user has clicked affiliate link
  useEffect(() => {
    // Get affiliate code from localStorage
    const storageCode = localStorage.getItem("affiliateCode");

    // If user is logged in
    if (!isLoading && isAuthenticated && storageCode) {
      // Remove item from localStorage
      localStorage.removeItem("affiliateCode");

      setOpenFree(true);
      setAffiliateCode(storageCode);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar variant="dense" className={classes.desktop}>
        <img src={logo} alt="" height="46px" style={{marginLeft: '-4px', marginRight: '12px'}}/>
        <Market
          handleClose={() => setOpenMarket(!openMarket)}
          open={openMarket}
        />
        <Help handleClose={() => setOpenHelp(!openHelp)} open={openHelp} />
        <Deposit
          handleClose={() => setOpenDeposit(!openDeposit)}
          open={openDeposit}
        />
        <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
        <Coupon
          handleClose={() => setOpenCoupon(!openCoupon)}
          open={openCoupon}
        />
        <Free
          // handleClose={() => setOpenFree(!openFree)}
          handleClose = {() => console.log('free')}
          open={openFree}
          code={affiliateCode}
        />

        <Link
          exact
          activeClassName={classes.active}
          className={classes.notactive}
          to="/crash"
        >
          <Button size="large" color="primary" variant="outlined">
            <span className={classes.reverse}>
              <img className="crash" src={crash} alt="crash" />
            </span>
          </Button>
        </Link>

        <Link
          exact
          activeClassName={classes.active}
          className={classes.notactive}
          to="/cups"
        >
          <Button size="large" color="primary" variant="outlined">
            <span className={classes.reverse}>
              <img src={cup} alt="cup" />
            </span>
          </Button>
        </Link>

        <Link
          exact
          activeClassName={classes.active}
          className={classes.notactive}
          to="/shuffle"
        >
          <Button size="large" color="primary" variant="outlined">
            <span className={classes.reverse}>
              <img src={shuffle} alt="shuffle" />
            </span>
          </Button>
        </Link>

        <Link
          exact
          activeClassName={classes.active}
          className={classes.notactive}
          to="/roulette"
        >
          <Button size="large" color="primary" variant="outlined">
            <span className={classes.reverse}>
              <img src={spin} alt="spin" />
            </span>
          </Button>
        </Link>

        {isAuthenticated && user && (
          <span className={classes.sub}>
            <Button
              onClick={() => setOpenMarket(!openMarket)}
              size="small"
              startIcon={<ShoppingCart />}
              color="primary"
            >
              <span className={classes.reverse}>Market</span>
            </Button>
          </span>
        )}

        <span className={classes.sub}>
          <Button
            onClick={() => setOpenHelp(!openHelp)}
            size="small"
            startIcon={<ContactSupport />}
            color="primary"
          >
            <span className={classes.reverse}>Help</span>
          </Button>
        </span>

        {isAuthenticated && user && (
          <Link
            exact
            activeClassName={classes.subActive}
            className={classes.sub}
            to="/affiliates"
          >
            <Button size="small" startIcon={<ControlCamera />} color="primary">
              <span className={classes.reverse}>Affiliates</span>
            </Button>
          </Link>
        )}

        <Link
          exact
          activeClassName={classes.subActive}
          className={classes.sub}
          to="/race"
        >
          <Button size="small" startIcon={<FlashOnIcon />} color="primary">
            <span className={classes.reverse}>Race</span>
          </Button>
        </Link>

        {/* {isAuthenticated && user && (
          <span className={classes.sub}>
            <Button
              onClick={() => setOpenCoupon(!openCoupon)}
              size="small"
              startIcon={<StarIcon />}
              color="primary"
            >
              <span className={classes.reverse}>Coupon</span>
            </Button>
          </span>
        )} */}

        {isLoading ? (
          <div className={classes.login}>
            <Skeleton
              height={36}
              width={120}
              animation="wave"
              variant="rect"
              style={{ marginRight: "1rem" }}
            />
            <Skeleton height={36} width={120} animation="wave" variant="rect" />
          </div>
        ) : isAuthenticated && user ? (
          <div className={classes.login}>
            <Box className={classes.balance}>
              <Box className={classes.reverse} flexDirection="column">
                <Box component="span">Balance</Box>
                <Box className={classes.price}>
                  $
                  {parseCommasToThousands(
                    cutDecimalPoints(user.wallet.toFixed(7))
                  )}
                </Box>
              </Box>
              <Button
                onClick={() => setOpenDeposit(!openDeposit)}
                variant="contained"
                className={classes.plus}
              >
                +
              </Button>
            </Box>

            <Box className={classes.pfp}>
              <Link exact to="/profile">
                <Avatar variant="rounded" src={user.avatar} />
              </Link>
            </Box>

            <IconButton
              onClick={event => setAnchorEl(event.currentTarget)}
              edge="start"
              className={classes.menu}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              open={open}
              onClose={() => setAnchorEl(null)}
              className={classes.rightMenu}
            >
              <Link exact to="/profile" className={classes.link}>
                <MenuItem onClose={() => setAnchorEl(null)}>Profile</MenuItem>
              </Link>
              <Link exact to="/history" className={classes.link}>
                <MenuItem onClose={() => setAnchorEl(null)}>History</MenuItem>
              </Link>
              <MenuItem
                onClick={() => setOpenCoupon(!openCoupon)}
                onClose={() => setAnchorEl(null)}
              >
                Coupon
              </MenuItem>
              <MenuItem
                onClick={() => setOpenVip(!openVip)}
                onClose={() => setAnchorEl(null)}
              >
                VIP
              </MenuItem>
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  onClick={() => setOpenFree(!openFree)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  Free $0.5
                </MenuItem>{" "}
              </Box>
              <MenuItem
                onClick={() => logout()}
                onClose={() => setAnchorEl(null)}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div className={classes.login}>
            <Link to="/login/steam" className={classes.noLink}>
              <Button className={classes.steam} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-steam-symbol"
                ></i>
                Steam
              </Button>
            </Link>
            <Link to="/login/google" className={classes.noLink}>
              <Button className={classes.google} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-google"
                ></i>
                Google
              </Button>
            </Link>
          </div>
        )}
      </Toolbar>

      <Toolbar className={classes.mobile}>
        {isLoading ? (
          <div className={classes.login}>
            <Skeleton
              height={36}
              width={120}
              animation="wave"
              variant="rect"
              style={{ marginRight: "1rem" }}
            />
            <Skeleton height={36} width={120} animation="wave" variant="rect" />
          </div>
        ) : isAuthenticated && user ? (
          <div style={{ display: "flex", width: "100%" }}>
            <Box className={classes.balance}>
              <Box className={classes.reverse} flexDirection="column">
                <Box component="span">Balance</Box>
                <Box className={classes.price}>
                  $
                  {parseCommasToThousands(
                    cutDecimalPoints(user.wallet.toFixed(7))
                  )}
                </Box>
              </Box>
              <Button
                onClick={() => setOpenDeposit(!openDeposit)}
                variant="contained"
                className={classes.plus}
              >
                +
              </Button>
            </Box>
            <IconButton
              onClick={event => setMbAnchorEl(event.currentTarget)}
              edge="start"
              className={classes.menu}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Box className={classes.pfp}>
              <Link exact to="/profile">
                <Avatar variant="rounded" src={user.avatar} />
              </Link>
            </Box>
            <Menu
              open={openMobile}
              onClose={() => setMbAnchorEl(null)}
              className={classes.rightMenu}
            >
              <Link exact to="/profile" className={classes.link}>
                {" "}
                <MenuItem onClose={() => setMbAnchorEl(null)}>
                  Profile
                </MenuItem>{" "}
              </Link>
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  onClick={() => setOpenVip(!openVip)}
                  onClose={() => setAnchorEl(null)}
                >
                  VIP
                </MenuItem>{" "}
              </Box>
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  onClick={() => setOpenMarket(!openMarket)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  Market
                </MenuItem>{" "}
              </Box>
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  onClick={() => setOpenHelp(!openHelp)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  Help
                </MenuItem>{" "}
              </Box>
              <Link exact to="/affiliates" className={classes.link}>
                {" "}
                <MenuItem onClose={() => setMbAnchorEl(null)}>
                  Affiliates
                </MenuItem>{" "}
              </Link>
              <Link exact to="/race" className={classes.link}>
                {" "}
                <MenuItem onClose={() => setMbAnchorEl(null)}>
                  Race
                </MenuItem>{" "}
              </Link>
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  onClick={() => setOpenCoupon(!openCoupon)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  Coupon
                </MenuItem>{" "}
              </Box>
              <Link exact to="/logout" className={classes.link}>
                {" "}
                <MenuItem
                  onClick={() => logout()}
                  onClose={() => setMbAnchorEl(null)}
                >
                  Logout
                </MenuItem>{" "}
              </Link>
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  onClick={() => setOpenFree(!openFree)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  Free $0.5
                </MenuItem>{" "}
              </Box>
            </Menu>
          </div>
        ) : (
          <div className={classes.login}>
            <Link to="/login/steam" className={classes.noLink}>
              <Button className={classes.steam} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-steam-symbol"
                ></i>
                Steam
              </Button>
            </Link>
            <Link to="/login/google" className={classes.noLink}>
              <Button className={classes.google} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-google"
                ></i>
                Google
              </Button>
            </Link>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Navbar);
