import React, { Fragment } from "react";
import PropTypes from "prop-types";

// Components
import Opponent from "./Opponent";

// Assets
import green from "../../assets/greenKing.png";
import blue from "../../assets/blueKing.png";
import red from "../../assets/redKing.png";

const EnemyCup = ({ opacity }) => {
  return (
    <Fragment>
      <Opponent
        style={opacity ? { opacity } : {}}
        events="none"
        bg={`url(${green})`}
      />
      <Opponent
        style={opacity ? { opacity } : {}}
        events="none"
        bg={`url(${red})`}
      />
      <Opponent
        style={opacity ? { opacity } : {}}
        events="none"
        bg={`url(${blue})`}
      />
    </Fragment>
  );
};

EnemyCup.propTypes = {
  opacity: PropTypes.number,
};

export default EnemyCup;
