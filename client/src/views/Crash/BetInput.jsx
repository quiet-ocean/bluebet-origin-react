import { withStyles, makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core';

const BetInput = withStyles({
  root: {
    // transform: "skew(-20deg)",
    // marginRight: 10,
    // maxWidth: 130,
    // minWidth: 100,
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
      // transform: "skew(20deg)",
    },
    "& div input": {
      color: "#fff",
      padding: "0.5rem 0.25rem",
      // transform: "skew(20deg)",
    },
    "& div": {
      background: "#171A28",
      // background: "#1e234a",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);

export default BetInput
