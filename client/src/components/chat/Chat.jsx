import React, { useState, useEffect, Fragment } from "react";
import { chatSocket } from "../../services/websocket.service";
import { getChatData } from "../../services/api.service";
import { Box } from '@material-ui/core'
// Components
import Header from "./Header";
import Messages from "./Messages";
import Controls from "./Controls";

const Chat = () => {
  // Declare State
  const [loading, setLoading] = useState(false);
  const [usersOnline, setUsersOnline] = useState("---");
  const [chatMessages, setChatMessages] = useState([]);
  const [rain, setRain] = useState(null);
  const [trivia, setTrivia] = useState(null);

  // Update users online count
  const updateUsersOnline = newCount => {
    setUsersOnline(newCount);
  };

  // Rain server state changed
  const rainStateChanged = newState => {
    setRain(newState);
  };

  // Trivia server state changed
  const triviaStateChanged = newState => {
    setTrivia(newState);
  };

  // Add new chat message to the state
  const addMessage = message => {
    // Update state
    setChatMessages(state =>
      state.length > 29
        ? [...state.slice(1, state.length), message]
        : [...state, message]
    );
  };

  // Remove message from state
  const removeMessage = msgId => {
    // Update state
    setChatMessages(state => state.filter(message => message.msgId !== msgId));
  };

  // Fetch chat messages from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getChatData();

      // Update state
      setChatMessages(response.messages);
      setRain(response.rain);
      setTrivia(response.trivia);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while fetching chat messages:", error);
    }
  };

  // componentDidMount
  useEffect(() => {
    fetchData();

    // Listeners
    chatSocket.on("users-online", updateUsersOnline);
    chatSocket.on("new-chat-message", addMessage);
    chatSocket.on("remove-message", removeMessage);
    chatSocket.on("rain-state-changed", rainStateChanged);
    chatSocket.on("trivia-state-changed", triviaStateChanged);

    // componentDidUnmount
    return () => {
      // Remove listeners
      chatSocket.off("users-online", updateUsersOnline);
      chatSocket.off("new-chat-message", addMessage);
      chatSocket.off("remove-message", removeMessage);
      chatSocket.off("rain-state-changed", rainStateChanged);
      chatSocket.off("trivia-state-changed", triviaStateChanged);
    };
  }, []);

  return (
    <Fragment>
      <Box
        style={{
          borderRadius: 5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
        }}
      >
        <Header />
        <Messages loading={loading} chatMessages={chatMessages} usersOnline={usersOnline}  />
        <Controls rain={rain} trivia={trivia} />
      </Box>
    </Fragment>
  );
};

export default Chat;
