import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CopyBlock, nord } from "react-code-blocks";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// Import code samples
import pfCodeSamples from "../pfCodeSamples";
import { useState } from "react";

// Custom Styles
const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    // overflow: "auto",
    padding: "2rem 0",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    color: "#373e6f",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      // fontSize: 50,
      margin: "0 0 2rem 0",
      color: "#4b547f",
    },
    "& b": {
      color: "#4b547f",
    },
  },
  openBtn: {
    color: "white",
    border: "none",
    fontFamily: "inherit",
    padding: ".4rem .6rem",
    borderRadius: ".2rem",
    marginLeft: "1rem",
    backgroundColor: "#6E92FD",
    cursor: "pointer",
    transition: "all .3s ease",
    "&:hover": {
      background: "#4f68b3",
    },
  },
});

const Fair = () => {
  // Declare State
  const classes = useStyles();
  const [open, setOpen] = useState({
    cups: false,
    crash: false,
    shuffle: false,
    roulette: false,
  });

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <h1>Provably Fair</h1>
        <section>
          <b>How can I Know that a game is fair?</b>
          <p>
            For each game we use an EOS Blockchain's Block that has been
            generated after all players have joined. We use that block's unique
            ID as our games "public seed". That means we cannot know the outcome
            of the game before it has rolled.
          </p>
        </section>
        <section>
          <b>Verifying Cups Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.cups ? (
              <ProvablyCodeBlock text={pfCodeSamples.cups} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, cups: !state.cups }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <section>
          <b>Verifying Shuffle Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.shuffle ? (
              <ProvablyCodeBlock text={pfCodeSamples.shuffle} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, shuffle: !state.shuffle }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <section>
          <b>Verifying Crash Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each round:
            {open.crash ? (
              <ProvablyCodeBlock text={pfCodeSamples.crash} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, crash: !state.crash }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <section>
          <b>Verifying Roulette Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.roulette ? (
              <ProvablyCodeBlock text={pfCodeSamples.roulette} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, roulette: !state.roulette }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
      </Container>
    </Box>
  );
};

const ProvablyCodeBlock = ({ text }) => {
  return (
    <CopyBlock
      text={text}
      language="javascript"
      showLineNumbers={false}
      theme={nord}
      wrapLines
    />
  );
};

export default Fair;
