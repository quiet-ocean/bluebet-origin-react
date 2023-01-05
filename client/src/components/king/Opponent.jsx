import { withStyles } from "@material-ui/core/styles";

// MUI Components
import Box from "@material-ui/core/Box";

// Custom Styled Component
export default withStyles({
  root: {
    height: 64,
    width: 80,
    top: 0,
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
