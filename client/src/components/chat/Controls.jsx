import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import ReactGiphySearchbox from "react-giphy-searchbox";
import { chatSocket } from "../../services/websocket.service";

// MUI Components
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// Components
import ChatRulesModal from "../modals/ChatRulesModal";

// Icons
import GifIcon from "@material-ui/icons/Gif";

// Components
import Rain from "./Rain";
import Trivia from "./Trivia";

// Custom styles
const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    
  },
  input: {
    display: "flex",
    flexDirection: "column",
    background: "#101324",
    // background: "#11131f",
    paddingBottom: "1rem",
  },
  icon: {
    color: "#343a5b",
    marginLeft: "auto",
    fontSize: 15,
  },

  giphy: {
    background: "#2f3653",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    zIndex: 100,
    bottom: "4rem",
    left: "10rem",
    opacity: 1,
    pointerEvents: "all",
    transition: "opacity 0.25s ease",
    "& input": {
      background: "#0d1020",
      border: "none",
      color: "white",
      paddingLeft: 10,
      "&::placeholder": {
        color: "#2f3653",
      },
    },
  },
  removed: {
    background: "#2f3653",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    zIndex: 100,
    bottom: "4rem",
    left: "10rem",
    "& input": {
      background: "#0d1020",
      border: "none",
      color: "white",
      paddingLeft: 10,
      "&::placeholder": {
        color: "#2f3653",
      },
    },
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.25s ease",
  },
}));

// Custom styled component
const ChatInput = withStyles(theme => ({
  root: {
    background:"#0A0C1A",

    width: "100%",
    padding: "1rem",
    borderTop:" 2px solid #4d79ff",
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
      padding: 18,
      paddingLeft: 20,
    },
    "& div input": {
      color: "#57618d",
    },
    "& div": {
      background: "#0D1020",
    },
  },
}))(TextField);

// Custom styled component
const Send = withStyles({
  root: {
    marginTop:"1em",
    minWidth:"5em !important",
    minHeight:"4em !important",
    backgroundColor: "#4d79ff",
    borderColor: "#4F79FD",
    color: "white",
    // transform: "skew(-20deg)",
    // margin: "auto",
    // marginRight: "1rem",
    // marginLeft: "0",
    fontSize: 10,
    "&:hover": {
      background: "#3451a9",
    },
  },
})(Button);

// Custom styled component
const Emoji = withStyles({
  root: {
    color: "white",
    opacity: 0.25,
  },
})(GifIcon);

const Controls = ({  rain, trivia }) => {
  // Declare state
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const gifFunc = (data, open) => {
    // console.log(inputState);
    setOpen(open);
    setInput(data);
  };

  // TextField onKeyPress event handler
  const onKeyPress = e => {
    // If enter was pressed
    if (e.key === "Enter") {
      chatSocket.emit("send-chat-message", input);
      setInput("");
      return false;
    }
  };

  // Input onChange event handler
  const onChange = e => {
    setInput(e.target.value);
  };

  // Button onClick event handler
  const onClick = () => {
    chatSocket.emit("send-chat-message", input);
    setInput("");
  };

  // TextInput onFocus event handler
  const onFocus = () => {
    const agreed = Boolean(window.localStorage.getItem("chat-rules-agreed"));

    // If user hasn't agreed the rules on this device
    if (!agreed) {
      setModalVisible(state => !state);
      window.localStorage.setItem("chat-rules-agreed", "true");
    }
  };

  return (
    <div>
      {rain && rain.active && <Rain rain={rain} />}
      {trivia && trivia.active && <Trivia trivia={trivia} />}
      <ReactGiphySearchbox
        apiKey="1nPE3oK3S7byekhnHoLrwGEeqxB0R98B" // Required: get your on https://developers.giphy.com
        onSelect={item => gifFunc(item.images.downsized.url, !open)}
        wrapperClassName={open ? classes.giphy : classes.removed}
        poweredByGiphy={false}
      />
      <ChatRulesModal
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <Box className={classes.input} style={{position:"relative"}}>
        <ChatInput
          label="Type a message"
          variant="filled"
          onChange={onChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          value={input}
        />
        <div style={{position:"absolute",top:"15%",left:"60%",width:"28%"}}>
          <Box display="flex">

            <IconButton
              onClick={() => setOpen(!open)}
              color="primary"
              style={{ marginLeft: "auto" }}
            >
              <Emoji />
            </IconButton>
            <Send onClick={onClick} variant="contained" >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white" class="bi bi-send-fill" viewBox="0 0 10 10">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
</svg>
            </Send>
          </Box>
        </div>
      
      </Box>
    </div>
  );
};

export default Controls;
