import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { getSiteSchema } from "./services/api.service";
import { makeStyles } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import { ToastProvider } from "react-toast-notifications";
import EventHandler from "./EventHandler";

// MUI Components
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";

// Components
import { AppBar } from "./components/appbar/";
import Footer from "./components/Footer";
import NotFound from "./components/404.jsx";
import Chat from "./components/chat/Chat";
import MobileNav from "./components/MobileNav";
import Preloader from "./Preloader";

// Views
import Cups from "./views/Cups";
import Affiliates from "./views/Affiliates";
import Profile from "./views/Profile";
import Roulette from "./views/Roulette";
import { Crash } from "./views/Crash/";
import King from "./views/King";
import Shuffle from "./views/Shuffle";
import Race from "./views/Race";
import Login from "./views/Login";
import Terms from "./views/Terms";
import Fair from "./views/Fair";
import Banned from "./views/Banned";
import History from "./views/History";

import AffiliatesRedirect from "./views/AffiliatesRedirect";

import Maintenance from "./views/Maintenance";

// App Metadata
import metadata from "./metadata.json";
import { BreadCrumbs } from "./components/BreadCrumbs";

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    background: "#111429",
    display: "flex",
    minHeight: "100vh",
    position: "relative",
  },
  drawerPaper: {
    display: "flex",
    overflow: "visible",
    flexDirection: "column",
    // background: "#0B0D1C",
    background: '#111429',
    position: "relative",
    whiteSpace: "nowrap",
    width: 300,
    borderRight: "none",
    // top: "80px",
    height: "100%",
    maxHeight: "100%",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  mobileDrawer: {
    padding: 2,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    background: "#0B0D1C",
    position: "absolute",
    whiteSpace: "nowrap",
    width: "100%",
    borderRight: "none",
    height: "100vh",
    maxHeight: "100%",
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 85,
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  paper: {
    padding: 2,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  backdrop: {
    zIndex: 1500,
    background: "#1d2030",
    color: "#4F79FD",
  },
  chat: {
    position: "absolute",
    bottom: "1.25rem",
    left: "1rem",
    color: "white",
    zIndex: 10000,
    background: "#4f79fd",
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
    "&:focus": {
      background: "#4f79fd",
    },
    "&:active": {
      background: "#4f79fd",
    },
  },
}));

const App = () => {
  const classes = useStyles();

  // Declare state
  const [open] = useState(true);
  const [mobileChat, setMobile] = useState(false);

  // Site settings
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  // Fetch site schema from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const schema = await getSiteSchema();

      // If maintenance is enabled
      if (schema.maintenanceEnabled) {
        setMaintenance(true);
      }

      setLoading(false);
    } catch (error) {
      // If site is on maintenance
      if (error.response && error.response.status === 503) {
        setMaintenance(true);
        setLoading(false);
      } else {
        console.log(error);
        window.location.reload();
      }
    }
  };

  // Parse build info from metadata
  const parseBuildInfo = () => {
    const buildId = metadata.build;
    const buildNumber =
      buildId.split("@").length > 1 ? buildId.split("@")[1] : "Unknown";
    console.log("[BUILD] Current build number:", buildNumber);
  };

  // componentDidMount
  useEffect(() => {
    console.warn(
      '%cStop!\n%cThis is a browser feature intended only for developers. If someone told you to copy and paste something here to get a "new feature" or "hack" someone\'s account, it is a scam and will give them access to your account.\r%cSee https://en.wikipedia.org/wiki/Self-XSS for more information.',
      "font-weight: bold; font-size: 35px; color: red;",
      "color: black; margin-top: 1rem;",
      "color: black; margin-top: 1rem;"
    );
    store.dispatch(loadUser());
    fetchData();
    parseBuildInfo();
  }, []);

  return maintenance ? (
    <Maintenance />
  ) : loading ? (
    <Preloader />
  ) : (
    <Provider store={store}>
      <Router>
        <ToastProvider
          placement={"bottom-right"}
          autoDismiss={true}
          autoDismissTimeout={4000}
        >
          <EventHandler />
          <div className={classes.root}>
            <CssBaseline />

            <main className={classes.content}>
              <AppBar />
              <MobileNav mobileChat={mobileChat} setMobile={setMobile} />

              <Box height="5rem" />
              <Switch>
                <Redirect exact from="/" to="crash" />

                <Route exact path="/cups" component={Cups} />
                <Route
                  exact
                  path="/cups/private/:inviteCode"
                  component={Cups}
                />

                <Route exact path="/shuffle" component={Shuffle} />

                <Route exact path="/profile" component={Profile} />
                <Route exact path="/affiliates" component={Affiliates} />
                <Route exact path="/roulette" component={Roulette} />
                <Route exact path="/crash" component={Crash} />
                <Route exact path="/race" component={Race} />
                <Route exact path="/terms" component={Terms} />
                <Route exact path="/fair" component={Fair} />
                <Route exact path="/banned" component={Banned} />
                <Route exact path="/history" component={History} />

                <Route
                  exact
                  path="/a/:affiliateCode"
                  component={AffiliatesRedirect}
                />

                <Route exact path="/login/:provider?" component={Login} />

                <Route exact path="*" component={NotFound} />
              </Switch>

              <Footer />
            </main>
            <Drawer
              variant="permanent"
              classes={{
                paper: mobileChat ? classes.mobileDrawer : classes.drawerPaper,
              }}
              open={open}
            >
              <Box style={{ paddingTop: 80, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Chat />
              </Box>
            </Drawer>
          </div>
        </ToastProvider>
      </Router>
    </Provider>
  );
};

export default App;
