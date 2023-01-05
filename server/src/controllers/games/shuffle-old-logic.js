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
  generateShuffleRoundRandom,
} = require("../random");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");

const User = require("../../models/User");
const ShuffleGame = require("../../models/ShuffleGame");
const { random } = require("colors/safe");

// Declare game state
const GAME_STATE = {
  _id: null,
  joinable: false,
  timeLeft: 0,
  winner: null,
  players: [
    {
      _id: "1",
      username: "Mitch",
      avatar:
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/71/715c744b6c17570f84fd2031816ed0869e9d3b65_full.jpg",
      betAmount: 10,
      betId: "1",
      winningPercentage: 33.33,
      tickets: {
        min: 0,
        max: 999,
      },
    },
    {
      _id: "2",
      username: "TheBelovedSocks",
      avatar:
        "https://lh3.googleusercontent.com/a-/AOh14GjbeLMYkRlaV5bgLMhNuKT5z7ulQ3tKABils7L_Lw",
      betAmount: 10,
      betId: "2",
      winningPercentage: 33.33,
      tickets: {
        min: 1000,
        max: 1999,
      },
    },
    {
      _id: "3",
      username: "Stacker | @DISCO",
      avatar:
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/d9/d934c027612e986d265d0bc4757687f8cba564fe_full.jpg",
      betAmount: 10,
      betId: "3",
      winningPercentage: 33.33,
      tickets: {
        min: 2000,
        max: 2999,
      },
    },
  ],
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
const SPECIAL_ANIMATION_LENGTH = 3000;

// Declare cup order
const CUP_ORDER = ["red", "blue", "green", "yellow", "pink"];

// Export state to external controllers
const getCurrentGame = () => ({
  ...GAME_STATE,
  privateSeed: null,
  intervalId: null,
});

// Calculate winner from random data
const getWinningColor = async randomModule => {
  return new Promise((resolve, reject) => {
    if (randomModule < 17.6666667) {
      resolve("red");
    } else if (randomModule < 35.3333334) {
      resolve("blue");
    } else if (randomModule < 54) {
      resolve("green");
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

  // Pick the next round player
  const pickNextRound = async () => {
    // If all 5 players have been picked already
    if (GAME_STATE.currentlyPicking > 5) {
      // End current game
      // return endCurrentShuffleGame();
      console.log(colors.red("Shuffle >> PICKING WINNER CUP"));
      io.of("/shuffle").emit("rolling-game");
    } else {
      console.log(
        colors.grey("Shuffle >> Picking cup number"),
        GAME_STATE.currentlyPicking
      );
      // Notify clients
      io.of("/shuffle").emit("picking-cup", GAME_STATE.currentlyPicking);

      // Get max ticket in the game
      const maxTicket = GAME_STATE.players.sort(
        (a, b) => b.tickets.max - a.tickets.max
      )[0];

      try {
        // Generate random data
        const randomData = await generateShuffleRoundRandom(
          GAME_STATE._id,
          GAME_STATE.publicSeed,
          GAME_STATE.privateSeed,
          GAME_STATE.currentlyPicking,
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
            // Get cup color
            const cup = CUP_ORDER[GAME_STATE.currentlyPicking - 1];

            console.log(
              colors.gray("Shuffle >> Picked"),
              player.username,
              colors.gray("for"),
              cup,
              colors.gray("cup!")
            );

            // Construct a new winner object
            const winner = {
              ...player,
              module: randomData.module,
              winningTicket: randomData.winningTicket,
            };

            // Add player to the next round and remove from players
            GAME_STATE.nextRoundPlayers[cup] = winner;
            // GAME_STATE.players = GAME_STATE.players.filter(bet => bet._id !== player._id);

            // Move to the next spot
            GAME_STATE.currentlyPicking = GAME_STATE.currentlyPicking + 1;

            // Notify clients
            io.of("/shuffle").emit(
              "player-picked",
              randomData.module,
              randomData.winningTicket,
              winner,
              cup
            );

            // Wait for client animation
            setTimeout(() => {
              // Pick next round
              pickNextRound();
            }, CLIENT_ANIMATION_LENGTH);
          }
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
      // Generate random data
      const randomData = await generateShuffleRandom();

      // Update local object
      GAME_STATE.publicSeed = randomData.publicSeed;
      GAME_STATE.status = 3;
      GAME_STATE.currentlyPicking = 1;
      GAME_STATE.nextRoundPlayers = {};

      // Pick next round until all 5 players have been picked
      pickNextRound();
    } catch (error) {
      // Notify clients that we had an error
      io.of("/shuffle").emit(
        "notify-error",
        "Our server couldn't connect to EOS Blockchain, retrying in 15s"
      );

      // Timeout to retry
      const timeout = setTimeout(() => {
        // Retry picking players
        pickNextRoundPlayers();

        return clearTimeout(timeout);
      }, 15000);
    }
  };

  // End current game
  const endCurrentShuffleGame = async () => {
    console.log(colors.yellow("Roulette >> Rolling current game"));

    try {
      // Generate random data
      const randomData = await generateRouletteRandom(
        GAME_STATE._id,
        GAME_STATE.privateSeed,
        1
      );

      // Calculate winner
      const winningIndex = Math.floor(randomData.module);
      const winningMultiplier = ROULETTE_ORDER[winningIndex];
      const winningColor = await getWinningColor(winningMultiplier);

      // Update local object
      GAME_STATE.randomModule = randomData.module;
      GAME_STATE.publicSeed = randomData.publicSeed;
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

        // If it was a 7x or Mystery Cup, generate another round picking multiplier
        if (winningMultiplier === 7 || winningMultiplier === 0) {
          console.log(
            colors.yellow("Roulette >> Rolled special tile, rolling again...")
          );

          // Generate random data
          const secondRandomData = await generateRouletteRandom(
            GAME_STATE._id,
            GAME_STATE.privateSeed,
            2
          );

          // If it was 7x do a random multiplier roll
          if (winningMultiplier === 7) {
            // Calculate next multiplier
            const secondMultiplier =
              ROULETTE_ORDER[Math.floor(secondRandomData.module)];

            // Emit to clients
            io.of("/roulette").emit(
              "game-rolled",
              Math.floor(secondRandomData.module)
            );

            console.log(
              colors.yellow("Roulette >> Rolled"),
              secondMultiplier * winningMultiplier + "x",
              colors.yellow("on 7x!")
            );

            // Wait until client finishes animation
            const timeout = setTimeout(async () => {
              clearTimeout(timeout);

              io.of("/roulette").emit(
                "additional-multiplier-rolled",
                winningMultiplier * secondMultiplier
              );

              // Find players and payout all
              for (let index = 0; index < GAME_STATE.players.length; index++) {
                const player = GAME_STATE.players[index];

                // Calculate profit
                const profit =
                  player.betAmount * winningMultiplier * secondMultiplier;
                const houseRake = profit * config.games.roulette.feePercentage;
                const feeMultiplier = 1 - config.games.roulette.feePercentage;
                const wonAmount = profit * feeMultiplier;

                // Payout winner
                await User.updateOne(
                  { _id: player._id },
                  {
                    $inc: {
                      wallet: Math.abs(wonAmount),
                    },
                  }
                );

                // Update local wallet
                io.of("/roulette")
                  .to(player._id)
                  .emit("update-wallet", Math.abs(wonAmount));

                // Apply 0.5% rake to current race prize pool
                await checkAndApplyRakeToRace(houseRake * 0.005);

                // Apply user's rakeback if eligible
                await checkAndApplyRakeback(user.id, houseRake);

                // Apply cut of house edge to user's affiliator
                await checkAndApplyAffiliatorCut(user.id, houseRake);
              }

              // Wait for special tile animation
              setTimeout(() => {
                // Reset game
                addCurrentGameToHistory();
                startNewGame();
              }, SPECIAL_ANIMATION_LENGTH);
            }, CLIENT_ANIMATION_LENGTH);
          } else {
            // It was mystery cup, roll 2x, 3x or 4x
            const secondMultiplier = await getMysteryMultiplier(
              secondRandomData.module
            );

            io.of("/roulette").emit(
              "additional-multiplier-rolled",
              secondMultiplier
            );

            console.log(
              colors.yellow("Roulette >> Rolled"),
              secondMultiplier + "x",
              colors.yellow("on mystery!")
            );

            // Find players and payout all
            for (let index = 0; index < GAME_STATE.players.length; index++) {
              const player = GAME_STATE.players[index];

              // Calculate profit
              const profit = player.betAmount * secondMultiplier;
              const houseRake = profit * config.games.roulette.feePercentage;
              const feeMultiplier = 1 - config.games.roulette.feePercentage;
              const wonAmount = profit * feeMultiplier;

              // Payout winner
              await User.updateOne(
                { _id: player._id },
                {
                  $inc: {
                    wallet: Math.abs(wonAmount),
                  },
                }
              );

              // Update local wallet
              io.of("/roulette")
                .to(player._id)
                .emit("update-wallet", Math.abs(wonAmount));

              // Apply 0.5% rake to current race prize pool
              await checkAndApplyRakeToRace(houseRake * 0.005);

              // Apply user's rakeback if eligible
              await checkAndApplyRakeback(user.id, houseRake);

              // Apply cut of house edge to user's affiliator
              await checkAndApplyAffiliatorCut(user.id, houseRake);
            }

            // Wait for special tile animation
            setTimeout(() => {
              // Reset game
              addCurrentGameToHistory();
              startNewGame();
            }, SPECIAL_ANIMATION_LENGTH);
          }
        } else {
          // Find winners and payout
          for (let index = 0; index < GAME_STATE.players.length; index++) {
            const player = GAME_STATE.players[index];

            // If player won
            if (player.color === winningColor) {
              // Calculate profit
              const profit = player.betAmount * winningMultiplier;
              const houseRake = profit * config.games.roulette.feePercentage;
              const feeMultiplier = 1 - config.games.roulette.feePercentage;
              const wonAmount = profit * feeMultiplier;

              // Payout winner
              await User.updateOne(
                { _id: player._id },
                {
                  $inc: {
                    wallet: Math.abs(wonAmount),
                  },
                }
              );

              // Update local wallet
              io.of("/roulette")
                .to(player._id)
                .emit("update-wallet", Math.abs(wonAmount));

              // Apply 0.5% rake to current race prize pool
              await checkAndApplyRakeToRace(houseRake * 0.005);

              // Apply user's rakeback if eligible
              await checkAndApplyRakeback(user.id, houseRake);

              // Apply cut of house edge to user's affiliator
              await checkAndApplyAffiliatorCut(user.id, houseRake);
            }
          }

          // Reset game
          addCurrentGameToHistory();
          startNewGame();
        }
      }, CLIENT_ANIMATION_LENGTH);
    } catch (error) {
      console.log("Error while ending a suffle game:", error);
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

    // If there are 5 players start the game
    if (GAME_STATE.players.length === 5) {
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
          pickNextRoundPlayers();
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
    // GAME_STATE.players = []; FIXME:
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
