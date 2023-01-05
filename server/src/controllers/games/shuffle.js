// Require Dependencies
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const mongoose = require("mongoose");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const {
  generatePrivateSeedHashPair,
  generateShuffleRandom,
} = require("../random");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const { getShuffleState } = require("../site-settings");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");

const User = require("../../models/User");
const ShuffleGame = require("../../models/ShuffleGame");

// Declare game state
const GAME_STATE = {
  _id: null,
  joinable: false,
  timeLeft: 0,
  winner: null,
  winningColor: null,
  players: [],
  currentlyPicking: 0,
  nextRoundPlayers: null,
  status: 1,
  privateSeed: null,
  privateHash: null,
  publicSeed: null,
  randomModule: 0,
  intervalId: null,
};

// Declare client animation (spin) length
const CLIENT_ANIMATION_LENGTH = 5000;

// Declare cup order
const CUP_ORDER = ["red", "blue", "green", "yellow", "pink"];

// Export state to external controllers
const getCurrentGame = () => ({
  ...GAME_STATE,
  privateSeed: null,
  intervalId: null,
});

// Get socket.io instance
const listen = io => {
  // Add previous game to history (database)
  const addCurrentGameToHistory = async () => {
    const game = { ...GAME_STATE };

    // Delete not needed props
    delete game.joinable;
    delete game.timeLeft;
    delete game.intervalId;

    try {
      // Push game to db
      const newGame = new ShuffleGame(game);

      // Save the new document
      await newGame.save();

      // Add to local history
    } catch (error) {
      console.log("Error while saving shuffle game to the database:", error);
    }
  };

  // Payout winner and start a new game
  const payoutWinner = async () => {
    try {
      // Calculate profit
      const profit = GAME_STATE.players
        .map(bet => bet.betAmount)
        .reduce((a, b) => a + b, 0);
      const houseRake = profit * config.games.shuffle.feePercentage;
      const feeMultiplier = 1 - config.games.shuffle.feePercentage;
      const wonAmount = profit * feeMultiplier;

      // Payout winner
      await User.updateOne(
        { _id: GAME_STATE.winner._id },
        {
          $inc: {
            wallet: Math.abs(wonAmount),
          },
        }
      );
      insertNewWalletTransaction(
        GAME_STATE.winner._id,
        Math.abs(wonAmount),
        "Shuffle win",
        { shuffleGameId: GAME_STATE._id }
      );

      console.log(
        colors.gray("Shuffle >> Game ended, winner"),
        GAME_STATE.winner.username,
        colors.gray("Profit:"),
        wonAmount,
        colors.gray("House edge amount:"),
        houseRake
      );

      // Update local wallet
      io.of("/shuffle")
        .to(String(GAME_STATE.winner._id))
        .emit("update-wallet", Math.abs(wonAmount));

      // Apply 0.5% rake to current race prize pool
      await checkAndApplyRakeToRace(houseRake * 0.005);

      // Apply user's rakeback if eligible
      await checkAndApplyRakeback(GAME_STATE.winner._id, houseRake);

      // Apply cut of house edge to user's affiliator
      await checkAndApplyAffiliatorCut(GAME_STATE.winner._id, houseRake);

      // Add to history and start new game
      addCurrentGameToHistory();
      startNewGame();
    } catch (error) {
      console.log("Error while payouting shuffle game:", error);
    }
  };

  // Pick the next round player
  const pickNextRound = async () => {
    // If all players have been picked already
    if (
      (GAME_STATE.players.length < 5 &&
        GAME_STATE.currentlyPicking > GAME_STATE.players.length) ||
      (GAME_STATE.players.length >= 5 && GAME_STATE.currentlyPicking > 5)
    ) {
      // End current game
      console.log(colors.gray("Shuffle >> Rolling final animation..."));
      io.of("/shuffle").emit(
        "game-rolled",
        GAME_STATE.winner,
        CUP_ORDER.indexOf(GAME_STATE.winningColor)
      );

      // Wait for animation
      setTimeout(() => {
        payoutWinner();
      }, CLIENT_ANIMATION_LENGTH);
    } else {
      console.log(
        colors.grey("Shuffle >> Picking cup number"),
        GAME_STATE.currentlyPicking
      );

      // Notify clients
      io.of("/shuffle").emit("picking-cup", GAME_STATE.currentlyPicking);

      try {
        // Get cup color
        const cup = CUP_ORDER[GAME_STATE.currentlyPicking - 1];

        // If we are picking winning cup, pick correct winner
        if (cup === GAME_STATE.winningColor) {
          console.log(
            colors.gray("Shuffle >> Picked"),
            GAME_STATE.winner.username,
            colors.gray("for"),
            cup,
            colors.gray("cup!")
          );

          // Add player to the next round and remove from players
          GAME_STATE.nextRoundPlayers[cup] = GAME_STATE.winner;

          // Move to the next spot
          GAME_STATE.currentlyPicking = GAME_STATE.currentlyPicking + 1;

          // Notify clients
          io.of("/shuffle").emit(
            "player-picked",
            GAME_STATE.winner,
            GAME_STATE.players,
            cup
          );

          // Wait for client animation
          setTimeout(() => {
            // Pick next round
            pickNextRound();
          }, CLIENT_ANIMATION_LENGTH);
        } else {
          // Filter out all already selected players
          const availablePlayers = GAME_STATE.players.filter(
            player =>
              player._id !== GAME_STATE.winner._id &&
              ![
                GAME_STATE.nextRoundPlayers &&
                  GAME_STATE.nextRoundPlayers.red &&
                  GAME_STATE.nextRoundPlayers.red._id,
                GAME_STATE.nextRoundPlayers &&
                  GAME_STATE.nextRoundPlayers.blue &&
                  GAME_STATE.nextRoundPlayers.blue._id,
                GAME_STATE.nextRoundPlayers &&
                  GAME_STATE.nextRoundPlayers.green &&
                  GAME_STATE.nextRoundPlayers.green._id,
                GAME_STATE.nextRoundPlayers &&
                  GAME_STATE.nextRoundPlayers.yellow &&
                  GAME_STATE.nextRoundPlayers.yellow._id,
                GAME_STATE.nextRoundPlayers &&
                  GAME_STATE.nextRoundPlayers.pink &&
                  GAME_STATE.nextRoundPlayers.pink._id,
              ].includes(player._id)
          );
          const player =
            availablePlayers[
              Math.floor(Math.random() * availablePlayers.length)
            ];

          // Pick random player
          console.log(
            colors.gray("Shuffle >> Picked"),
            player.username,
            colors.gray("for"),
            cup,
            colors.gray("cup!")
          );

          // Add player to the next round and remove from players
          GAME_STATE.nextRoundPlayers[cup] = player;

          // Move to the next spot
          GAME_STATE.currentlyPicking = GAME_STATE.currentlyPicking + 1;

          // Notify clients
          io.of("/shuffle").emit(
            "player-picked",
            player,
            GAME_STATE.players,
            cup
          );

          // Wait for client animation
          setTimeout(() => {
            // Pick next round
            pickNextRound();
          }, CLIENT_ANIMATION_LENGTH);
        }
      } catch (error) {
        console.log("Error while picking player for next round:", error);
      }
    }
  };

  // Pick players for next round (final game)
  const pickNextRoundPlayers = async () => {
    // Don't allow more bets
    GAME_STATE.joinable = false;

    console.log(colors.gray("Shuffle >> Picking players for next round..."));

    try {
      GAME_STATE.status = 3;
      GAME_STATE.currentlyPicking = 1;
      GAME_STATE.nextRoundPlayers = {};

      // Pick next round until all 5 players have been picked
      pickNextRound();
    } catch (error) {
      console.log(
        "There was an error while starting to pick next round players on shuffle:",
        error
      );
    }
  };

  // End current game
  const endCurrentShuffleGame = async () => {
    console.log(colors.gray("Shuffle >> Rolling current game"));

    // Get max ticket in the game
    const maxTicket = GAME_STATE.players.sort(
      (a, b) => b.tickets.max - a.tickets.max
    )[0];

    try {
      // Generate random data
      const randomData = await generateShuffleRandom(
        GAME_STATE._id,
        GAME_STATE.privateSeed,
        maxTicket ? maxTicket.tickets.max : 0
      );

      // Loop through players to find winner to the next round
      for (let index = 0; index < GAME_STATE.players.length; index++) {
        const player = GAME_STATE.players[index];

        // If player has winning ticket
        if (
          randomData.winningTicket >= player.tickets.min &&
          randomData.winningTicket <= player.tickets.max
        ) {
          console.log(
            colors.gray("Shuffle >> Round "),
            GAME_STATE._id,
            colors.gray("rolled, winner:"),
            player.username
          );

          // Update local object
          GAME_STATE.randomModule = randomData.module;
          GAME_STATE.publicSeed = randomData.publicSeed;
          GAME_STATE.winner = {
            ...player,
            winningTicket: randomData.winningTicket,
            randomModule: randomData.module,
          };
          GAME_STATE.winningColor =
            GAME_STATE.players.length < 5
              ? CUP_ORDER[
                  Math.floor(
                    Math.random() * Math.floor(GAME_STATE.players.length)
                  )
                ]
              : CUP_ORDER[Math.floor(Math.random() * CUP_ORDER.length)];

          // Pick next round
          pickNextRoundPlayers();
        }
      }
    } catch (error) {
      console.log("Couldn't end shuffle game:", error);

      // Notify clients that we had an error
      io.of("/shuffle").emit(
        "notify-error",
        "Our server couldn't connect to EOS Blockchain, retrying in 15s"
      );

      // Timeout to retry
      const timeout = setTimeout(() => {
        // Retry picking players
        endCurrentShuffleGame();

        return clearTimeout(timeout);
      }, 15000);
    }
  };

  // Add player to shuffle game
  const addPlayerToCurrentGame = async player => {
    // Calculate game total value
    const totalValue = parseFloat(
      GAME_STATE.players
        .map(bet => bet.betAmount)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    );

    // Generate tickets
    player.tickets = {
      min: totalValue * 100,
      max: totalValue * 100 + player.betAmount * 100 - 1,
    };
    player.winningPercentage =
      100 - ((totalValue - player.betAmount) / totalValue) * 100;

    // Add player to the game state
    GAME_STATE.players.push(player);

    // Update chance for every player
    GAME_STATE.players.forEach((player, i) => {
      // Calculate game total value
      const totalValue = parseFloat(
        GAME_STATE.players
          .map(bet => bet.betAmount)
          .reduce((a, b) => a + b, 0)
          .toFixed(2)
      );
      const chance = 100 - ((totalValue - player.betAmount) / totalValue) * 100;
      GAME_STATE.players[i].winningPercentage = chance;
    });

    // Emit to clients
    io.of("/shuffle").emit("new-player", player);
    io.of("/shuffle").emit("percentages-updated", GAME_STATE.players);

    // If there are 2 players start the game
    if (GAME_STATE.players.length === 2) {
      console.log(
        colors.gray("Shuffle >> Round"),
        GAME_STATE._id,
        colors.gray("started countdown!")
      );

      // Notify clients
      io.of("/shuffle").emit("countdown-started", GAME_STATE.timeLeft);

      // Start a new game interval
      GAME_STATE.status = 2;
      GAME_STATE.intervalId = setInterval(() => {
        // Decrement time left
        GAME_STATE.timeLeft -= 10;

        // Check if timer has reached 0
        if (GAME_STATE.timeLeft <= 0) {
          endCurrentShuffleGame();
          return clearInterval(GAME_STATE.intervalId);
        }
      }, 10);
    }
  };

  // Start a new game
  const startNewGame = async () => {
    // Generate pre-roll provably fair data
    const provablyData = await generatePrivateSeedHashPair();

    // Reset state
    GAME_STATE.joinable = true;
    GAME_STATE.status = 1;
    /**
     * Status List:
     *
     * 1 - Waiting for players
     * 2 - On Countdown
     * 3 - Picking next round players
     * 4 - Rolling
     * (5 - Ended)
     */
    GAME_STATE.timeLeft = config.games.shuffle.waitingTime;
    GAME_STATE.winner = null;
    GAME_STATE.winningColor = null;
    GAME_STATE.players = [];
    GAME_STATE.nextRoundPlayers = null;
    GAME_STATE.privateSeed = provablyData.seed;
    GAME_STATE.privateHash = provablyData.hash;
    GAME_STATE.publicSeed = null;
    GAME_STATE.randomModule = 0;
    GAME_STATE._id = mongoose.Types.ObjectId();

    // Clear game main interval
    clearInterval(GAME_STATE.intervalId);

    console.log(
      colors.gray("Shuffle >> Generated new game with the id"),
      GAME_STATE._id
    );

    // Emit to clients
    io.of("/shuffle").emit("new-round");
  };

  // Initially start a new game
  startNewGame();

  // Listen for new websocket connections
  io.of("/shuffle").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connnections
    socket.use(throttlerController(socket));

    // Authenticate websocket connection
    socket.on("auth", async token => {
      if (!token) {
        loggedIn = false;
        user = null;
        return socket.emit(
          "error",
          "No authentication token provided, authorization declined"
        );
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.authentication.jwtSecret);

        user = await User.findOne({ _id: decoded.user.id });
        if (user) {
          if (parseInt(user.banExpires) > new Date().getTime()) {
            // console.log("banned");
            loggedIn = false;
            user = null;
            return socket.emit("user banned");
          } else {
            loggedIn = true;
            socket.join(String(user._id));
            // socket.emit("notify-success", "Successfully authenticated!");
          }
        }
        // return socket.emit("alert success", "Socket Authenticated!");
      } catch (error) {
        loggedIn = false;
        user = null;
        return socket.emit("notify-error", "Authentication token is not valid");
      }
    });

    // Check for users ban status
    socket.use(async (packet, next) => {
      if (loggedIn && user) {
        try {
          const dbUser = await User.findOne({ _id: user.id });

          // Check if user is banned
          if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
            return socket.emit("user banned");
          } else {
            return next();
          }
        } catch (error) {
          return socket.emit("user banned");
        }
      } else {
        return next();
      }
    });

    /**
     * @description Join a current game
     *
     * @param {number} betAmount Bet amount
     */
    socket.on("join-game", async betAmount => {
      // Validate user input
      if (typeof betAmount !== "number" || isNaN(betAmount))
        return socket.emit("game-join-error", "Invalid Bet Amount Type!");
      if (!loggedIn)
        return socket.emit("game-join-error", "You are not logged in!");

      // Get shuffle enabled status
      const isEnabled = getShuffleState();

      // If shuffle is disabled
      if (!isEnabled) {
        return socket.emit(
          "game-join-error",
          "Shuffle gamemode is currently disabled! Contact admins for more information."
        );
      }

      // More validation on the bet value
      const { minBetAmount, maxBetAmount } = config.games.shuffle;
      if (
        parseFloat(betAmount.toFixed(2)) < minBetAmount ||
        parseFloat(betAmount.toFixed(2)) > maxBetAmount
      ) {
        return socket.emit(
          "game-join-error",
          `Your bet must be a minimum of ${minBetAmount} credits and a maximum of ${maxBetAmount} credits!`
        );
      }

      // Check if current game is joinable
      if (!GAME_STATE.joinable)
        return socket.emit("game-join-error", "Cannot join this game!");

      // If user has already joined this game
      if (GAME_STATE.players.map(player => player._id).includes(user.id))
        return socket.emit(
          "game-join-error",
          "You have already joined this game!"
        );

      try {
        // Get user from database
        const dbUser = await User.findOne({ _id: user.id });

        // If user has restricted bets
        if (dbUser.betsLocked) {
          return socket.emit(
            "game-join-error",
            "Your account has an betting restriction. Please contact support for more information."
          );
        }

        // If user can afford this bet
        if (dbUser.wallet < parseFloat(betAmount.toFixed(2))) {
          return socket.emit("game-join-error", "You can't afford this bet!");
        }

        // Remove bet amount from user's balance
        await User.updateOne(
          { _id: user.id },
          {
            $inc: {
              wallet: -Math.abs(parseFloat(betAmount.toFixed(2))),
              wager: Math.abs(parseFloat(betAmount.toFixed(2))),
              wagerNeededForWithdraw: -Math.abs(
                parseFloat(betAmount.toFixed(2))
              ),
            },
          }
        );
        insertNewWalletTransaction(
          user.id,
          -Math.abs(parseFloat(betAmount.toFixed(2))),
          "Shuffle play",
          { shuffleGameId: GAME_STATE._id }
        );

        // Update local wallet
        socket.emit(
          "update-wallet",
          -Math.abs(parseFloat(betAmount.toFixed(2)))
        );

        // Update user's race progress if there is an active race
        await checkAndEnterRace(
          user.id,
          Math.abs(parseFloat(betAmount.toFixed(2)))
        );

        // Contruct a new player object
        const player = {
          _id: user.id,
          username: user.username,
          avatar: user.avatar,
          betAmount: parseFloat(betAmount.toFixed(2)), // Convert two-decimal into float
          betId: uuid.v4(),
        };

        // Add player to the game
        addPlayerToCurrentGame(player);

        // Update client
        socket.emit("game-join-success");
      } catch (error) {
        console.log("Error while placing a shuffle bet:", error);
        return socket.emit(
          "game-join-error",
          "Your bet couldn't be placed: Internal server error, please try again later!"
        );
      }
    });
  });
};

// Export functions
module.exports = { listen, getCurrentGame };
