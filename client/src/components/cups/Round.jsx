import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import { cupsSocket } from "../../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";

// Components
import Game from "./Game";

// import fakeBets from "../../libs/fakeBets";

const Round = ({ games }) => {
  // Declare State

  return (
    <div style={{ width: "100%" }}>
      {games.map(game => (
        <Game key={game._id} game={game} />
      ))}
    </div>
  );
};

Round.propTypes = {
  games: PropTypes.array.isRequired,
};

export default Round;
