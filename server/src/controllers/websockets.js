// Require Dependencies
const socketio = require("socket.io");
const chatController = require("./chat");
const cupsController = require("./games/cups");
const shuffleController = require("./games/shuffle");
const kingController = require("./games/king");
const rouletteController = require("./games/roulette");
const crashController = require("./games/crash");
// const exampleController = require("./games/example");

// Configure Socket.io
const startSocketServer = (server, app) => {
  try {
    // Main socket.io instance
    const io = socketio(server);

    // Make the socket connection accessible at the routes
    app.set("socketio", io);

    // Start listeners
    chatController.listen(io);
    cupsController.listen(io);
    shuffleController.listen(io);
    kingController.listen(io);
    rouletteController.listen(io);
    crashController.listen(io);
    // exampleController.listen(io);

    console.log("WebSocket >>", "Connected!");
  } catch (error) {
    console.log(`WebSocket ERROR >> ${error.message}`);

    // Exit current process with failure
    process.exit(1);
  }
};

// Export functions
module.exports = { startSocketServer };
