import React from "react";
import Box from "@material-ui/core/Box";
import { withStyles, makeStyles } from "@material-ui/core";

//Assets
import wheelImg from "../../assets/wheel.svg"
import { useState, useEffect } from "react";

const Wheel = withStyles({
    root: {
        height: '125%',
        background: `url(${wheelImg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: props => props.result,
    },
})(Box)

const Paused = ({ rotate }) => {

    return (
        <span style={{ positon: 'absolute', bottom: '-5rem', height: '100%', width: '100%' }}>
            <Wheel rotate={rotate} />
        </span>
    );
};

export default Paused;