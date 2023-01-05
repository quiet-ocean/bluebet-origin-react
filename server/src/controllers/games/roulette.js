// Require Dependencies
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const mongoose = require("mongoose");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const {
  generatePrivateSeedHashPair,
  generateRouletteRandom,
  generateRouletteMysteryRandom,
  generateRouletteFirstRandom,
} = require("../random");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const { getRouletteState } = require("../site-settings");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");

const User = require("../../models/User");
const RouletteGame = require("../../models/RouletteGame");

// Declare game state
const GAME_STATE = {
  joinable: false,
  timeLeft: 0,
  winner: null,
  winningMultiplier: null,
  players: [],
  privateSeed: null,
  privateHash: null,
  publicSeed: null,
  randomModule: 0,
  _id: null,
  intervalId: null,
};

// Declare client animation (spin) length
const CLIENT_ANIMATION_LENGTH = 10000 + 2000;
const SPECIAL_ANIMATION_LENGTH = 3000;
const MYSTERY_ANIMATION_LENGTH = 3000;

// Declare roulette wheel order
const ROULETTE_ORDER = [
  10,
  1,
  2,
  1,
  2,
  1,
  20,
  1,
  2,
  3,
  1,
  0,
  1,
  10,
  2,
  1,
  3,
  2,
  1,
  2,
  1,
  2,
  1,
  3,
  40,
  1,
  2,
  1,
  2,
  1,
  3,
  2,
  1,
  20,
  1,
  2,
  1,
  3,
  1,
  2,
  10,
  1,
  2,
  1,
  3,
  1,
  2,
  3,
  1,
  2,
  3,
  1,
  2,
  1,
];

// Export state to external controllers
const getCurrentGame = () => ({
  ...GAME_STATE,
  privateSeed: null,
  intervalId: null,
});

// Calculate winner from random data
const getWinningColor = async winningMultiplier => {
  return new Promise((resolve, reject) => {
    if (winningMultiplier === 1) {
      resolve("yellow");
    } else if (winningMultiplier === 2) {
      resolve("blue");
    } else if (winningMultiplier === 3) {
      resolve("purple");
    } else if (winningMultiplier === 10) {
      resolve("green");
    } else if (winningMultiplier === 20) {
      resolve("red");
    } else if (winningMultiplier === 40) {
      resolve("pink");
    } else if (winningMultiplier === 0) {
      resolve("mystery");
    } else {
      reject(
        new Error("Couldn't calculate winner: Invalid multiplier amount!")
      );
    }
  });
};

// Calculate winner from random data
const getMysteryMultiplier = async randomModule => {
  return new Promise((resolve, reject) => {
    if (randomModule <= 55) {
      resolve(2);
    } else if (randomModule <= 75) {
      resolve(3);
    } else if (randomModule <= 87.5) {
      resolve(4);
    } else if (randomModule <= 95) {
      resolve(5);
    } else if (randomModule <= 98) {
      resolve(6);
    } else if (randomModule <= 100) {
      resolve(7);
    } else {
      reject(new Error("Couldn't calculate winner: Invalid module!"));
    }
  });
};

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
      const newGame = new RouletteGame(game);

      // Save the new document
      await newGame.save();

      // Add to local history
      io.of("/roulette").emit("add-game-to-history", {
        privateSeed: game.privateSeed,
        privateHash: game.privateHash,
        publicSeed: game.publicSeed,
        randomModule: game.randomModule,
        winner: game.winner,
        _id: newGame._id,
      });
    } catch (error) {
      console.log("Error while saving roulette game to the database:", error);
    }
  };

  // End current game
  const endCurrentRouletteGame = async () => {
    // Don't allow more bets
    GAME_STATE.joinable = false;

    console.log(colors.yellow("Roulette >> Rolling current game"));

    try {
      // Generate random data
      const firstRandomData = await generateRouletteFirstRandom();
      const randomData = await generateRouletteRandom(
        GAME_STATE._id,
        GAME_STATE.privateSeed,
        firstRandomData.publicSeed,
        1
      );

      // Calculate winner
      // const winningIndex = 11;
      const winningIndex = Math.floor(randomData.module);
      const winningMultiplier = ROULETTE_ORDER[winningIndex];
      const winningColor = await getWinningColor(winningMultiplier);

      // Update local object
      GAME_STATE.randomModule = randomData.module;
      GAME_STATE.publicSeed = firstRandomData.publicSeed;
      GAME_STATE.winner = winningColor;

      console.log(
        colors.yellow("Roulette >> Game"),
        GAME_STATE._id,
        colors.yellow("rolled, winning color:"),
        `${winningColor} (${winningMultiplier}x)`
      );

      // Emit to clients
      io.of("/roulette").emit("game-rolled", winningIndex, winningMultiplier);

      // Wait until client finishes animation
      const timeout = setTimeout(async () => {
        clearTimeout(timeout);

        // If it was a Mystery Cup, generate another round picking multiplier
        if (winningMultiplier === 0) {
          console.log(
            colors.yellow("Roulette >> Rolled special tile, rolling again...")
          );

          // Generate mystery multiplier
          const mysteryRandomData = await generateRouletteMysteryRandom(
            GAME_STATE._id,
            GAME_STATE.privateSeed,
            GAME_STATE.publicSeed,
            2
          );

          // Calculate mystery multiplier (2-7x)
          const mysteryMultiplier = await getMysteryMultiplier(
            mysteryRandomData.module
          );

          io.of("/roulette").emit(
            "additional-multiplier-rolled",
            mysteryMultiplier
          );

          // Wait until client finishes mystery animation
          setTimeout(async () => {
            // Generate random data for reroll
            const secondRandomData = await generateRouletteRandom(
              GAME_STATE._id,
              GAME_STATE.privateSeed,
              GAME_STATE.publicSeed,
              3
            );

            // Calculate next multiplier
            const secondMultiplier =
              ROULETTE_ORDER[Math.floor(secondRandomData.module)] !== 0
                ? ROULETTE_ORDER[Math.floor(secondRandomData.module)]
                : 1;
            const secondWinningColor = await getWinningColor(secondMultiplier);

            // Emit to clients
            io.of("/roulette").emit(
              "special-game-rolled",
              Math.floor(secondRandomData.module)
            );

            console.log(
              colors.yellow("Roulette >> Rolled"),
              secondMultiplier +
                "x (" +
                mysteryMultiplier +
                "x, " +
                mysteryRandomData.module +
                "%) =",
              secondMultiplier * mysteryMultiplier + "x",
              colors.yellow("on mystery cup!")
            );

            // Wait until client finishes animation
            const timeout = setTimeout(async () => {
              clearTimeout(timeout);

              io.of("/roulette").emit(
                "multiplier-rolled",
                mysteryMultiplier * secondMultiplier
              );

              // Find winners and payout
              for (let index = 0; index < GAME_STATE.players.length; index++) {
                const player = GAME_STATE.players[index];

                // If player won
                if (player.color === secondWinningColor) {
                  // Calculate profit
                  const profit =
                    player.betAmount * mysteryMultiplier * secondMultiplier;
                  const houseRake =
                    profit * config.games.roulette.feePercentage;
                  const wonAmount = player.betAmount + profit;

                  // Payout winner
                  await User.updateOne(
                    { _id: player._id },
                    {
                      $inc: {
                        wallet: Math.abs(wonAmount),
                      },
                    }
                  );
                  insertNewWalletTransaction(
                    player._id,
                    Math.abs(wonAmount),
                    "Roulette win",
                    { rouletteGameId: GAME_STATE._id }
                  );

                  console.log(
                    colors.yellow("Roulette >> Paid"),
                    wonAmount.toFixed(2),
                    colors.yellow("to"),
                    player.username
                  );

                  // Update local wallet
                  io.of("/roulette")
                    .to(player._id)
                    .emit("update-wallet", Math.abs(wonAmount));

                  // Apply 0.5% rake to current race prize pool
                  await checkAndApplyRakeToRace(houseRake * 0.005);

                  // Apply user's rakeback if eligible
                  await checkAndApplyRakeback(player._id, houseRake);

                  // Apply cut of house edge to user's affiliator
                  await checkAndApplyAffiliatorCut(player._id, houseRake);
                }
              }

              // Update multiplier
              GAME_STATE.winningMultiplier =
                mysteryMultiplier * secondMultiplier;

              // Wait for tile animation
              setTimeout(() => {
                // Reset game
                addCurrentGameToHistory();
                startNewGame();
              }, SPECIAL_ANIMATION_LENGTH);
            }, CLIENT_ANIMATION_LENGTH);
          }, MYSTERY_ANIMATION_LENGTH);
        } else {
          // Play animation on client
          io.of("/roulette").emit("multiplier-rolled", winningMultiplier);

          // Find winners and payout
          for (let index = 0; index < GAME_STATE.players.length; index++) {
            const player = GAME_STATE.players[index];

            // If player won
            if (player.color === winningColor) {
              // Calculate profit
              const profit = player.betAmount * winningMultiplier;
              const houseRake = profit * config.games.roulette.feePercentage;
              const wonAmount = player.betAmount + profit;

              // Payout winner
              await User.updateOne(
                { _id: player._id },
                {
                  $inc: {
                    wallet: Math.abs(wonAmount),
                  },
                }
              );
              insertNewWalletTransaction(
                player._id,
                Math.abs(wonAmount),
                "Roulette win",
                { rouletteGameId: GAME_STATE._id }
              );

              console.log(
                colors.yellow("Roulette >> Paid"),
                wonAmount.toFixed(2),
                colors.yellow("to"),
                player.username
              );

              // Update local wallet
              io.of("/roulette")
                .to(player._id)
                .emit("update-wallet", Math.abs(wonAmount));

              // Apply 0.5% rake to current race prize pool
              await checkAndApplyRakeToRace(houseRake * 0.005);

              // Apply user's rakeback if eligible
              await checkAndApplyRakeback(player._id, houseRake);

              // Apply cut of house edge to user's affiliator
              await checkAndApplyAffiliatorCut(player._id, houseRake);
            }
          }

          // Update multiplier
          GAME_STATE.winningMultiplier = winningMultiplier;

          // Wait for tile animation
          setTimeout(() => {
            // Reset game
            addCurrentGameToHistory();
            startNewGame();
          }, SPECIAL_ANIMATION_LENGTH);
        }
      }, CLIENT_ANIMATION_LENGTH);
    } catch (error) {
      console.log("Error while ending a roulette game:", error);

      // Notify clients that we had an error
      io.of("/roulette").emit(
        "notify-error",
        "Our server couldn't connect to EOS Blockchain, retrying in 15s"
      );

      // Timeout to retry
      const timeout = setTimeout(() => {
        // Retry ending the game
        endCurrentRouletteGame();

        return clearTimeout(timeout);
      }, 15000);
    }
  };

  // Start a new game
  const startNewGame = async () => {
    // Generate pre-roll provably fair data
    const provablyData = await generatePrivateSeedHashPair();

    // Reset state
    GAME_STATE.joinable = true;
    GAME_STATE.timeLeft = config.games.roulette.waitingTime;
    GAME_STATE.winner = null;
    GAME_STATE.winningMultiplier = null;
    GAME_STATE.players = [];
    GAME_STATE.privateSeed = provablyData.seed;
    GAME_STATE.privateHash = provablyData.hash;
    GAME_STATE.publicSeed = null;
    GAME_STATE.randomModule = 0;
    GAME_STATE._id = mongoose.Types.ObjectId();

    // Clear game main interval
    clearInterval(GAME_STATE.intervalId);

    console.log(
      colors.yellow("Roulette >> Generated new game with the id"),
      GAME_STATE._id
    );

    // Emit to clients
    io.of("/roulette").emit(
      "new-round",
      config.games.roulette.waitingTime,
      GAME_STATE._id,
      GAME_STATE.privateHash
    );

    // Start a new game interval
    GAME_STATE.intervalId = setInterval(() => {
      // Decrement time left
      GAME_STATE.timeLeft -= 10;

      // Check if timer has reached 0
      if (GAME_STATE.timeLeft <= 0) {
        endCurrentRouletteGame();
        return clearInterval(GAME_STATE.intervalId);
      }
    }, 10);
  };

  // Initially start a new game
  startNewGame();

  // Listen for new websocket connections
  io.of("/roulette").on("connection", socket => {
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
     * @param {string} color What color to bet on
     * @param {number} betAmount Bet amount
     */
    socket.on("join-game", async (color, betAmount) => {
      // Validate user input
      if (
        typeof color !== "string" ||
        !["red", "blue", "yellow", "green", "purple", "pink"].includes(color)
      )
        return socket.emit("game-join-error", "Invalid Color Type!");
      if (typeof betAmount !== "number" || isNaN(betAmount))
        return socket.emit("game-join-error", "Invalid Bet Amount Type!");
      if (!loggedIn)
        return socket.emit("game-join-error", "You are not logged in!");

      // Get roulette enabled status
      const isEnabled = getRouletteState();

      // If roulette is disabled
      if (!isEnabled) {
        return socket.emit(
          "game-join-error",
          "Wheel gamemode is currently disabled! Contact admins for more information."
        );
      }

      // More validation on the bet value
      const { minBetAmount, maxBetAmount } = config.games.roulette;
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
          "Roulette play",
          { rouletteGameId: GAME_STATE._id }
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
          color,
          betAmount: parseFloat(betAmount.toFixed(2)), // Convert two-decimal into float
          betId: uuid.v4(),
        };

        // Add player to state
        GAME_STATE.players.push(player);

        // Notify clients
        io.of("/roulette").emit("new-player", player);
        return socket.emit("game-join-success");
      } catch (error) {
        console.log("Error while placing a roulette bet:", error);
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
