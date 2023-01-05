// Require Dependencies
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const {
  generatePrivateSeedHashPair,
  generateKingRandom,
  generateKingRoundRandom,
} = require("../random");
const { verifyRecaptchaResponse } = require("../recaptcha");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const { getKingState } = require("../site-settings");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");

const User = require("../../models/User");
const KingGame = require("../../models/KingGame");

// Cup order in the frontend
const FIRST_CUP = "green";
const SECOND_CUP = "red";
const THIRD_CUP = "blue";

// Client animation length in ms
const CLIENT_ANIMATION_LENGTH = 3000;

// Calculate winner from random data
const getWinningCup = async randomModule => {
  return new Promise(resolve => {
    resolve(
      randomModule < 10 ? FIRST_CUP : randomModule < 20 ? SECOND_CUP : THIRD_CUP
    );
  });
};

// Calculate from round numbers who's turn it is
const getCurrentTurn = async roundNumber => {
  return new Promise(resolve => {
    const user = roundNumber % 2 === 0 ? "opponent" : "creator";
    resolve(user);
  });
};

// Get socket.io instance
const listen = io => {
  // Generate game's data
  const startKingGame = async gameId => {
    try {
      // Get game from DB
      const game = await KingGame.findOne({ _id: gameId });

      // Generate random data
      const randomData = await generateKingRandom(game.id, game.privateSeed);

      // Update document
      await KingGame.updateOne(
        { _id: gameId },
        { $set: { publicSeed: randomData.publicSeed } }
      );

      // Generate first round
      generateNewRound(gameId);
    } catch (error) {
      console.log("Error while starting game", gameId, error);
      io.of("/king").emit(
        "notify-error",
        `There was an error while starting game ${gameId}! Re-trying in 15 seconds...`
      );

      // Wait 15 seconds and try again
      setTimeout(() => {
        startKingGame(gameId);
      }, 15000);
    }
  };

  // Check if user haven't picked a cup and auto-choose
  const checkAndAutoChoose = async (gameId, currentRoundNumber) => {
    try {
      // Get current game from db
      const game = await KingGame.findOne({ _id: gameId });

      // If round isn't active anymore
      if (game.status !== 2) return;

      // If round has changed
      if (game.roundNumber !== currentRoundNumber) return;

      // Get auto-choose round
      const round = game.rounds.find(
        round => round.roundNumber === currentRoundNumber
      );

      // If current round has been already played
      if (!round || round.played) return;

      console.log(
        colors.magenta("King >> Auto-choosing for game"),
        gameId,
        colors.magenta("for round"),
        round.roundNumber
      );

      // Get current turn
      const currentTurn = await getCurrentTurn(currentRoundNumber);

      // Get player who plays currently
      const player =
        currentTurn === "creator"
          ? String(game._creator)
          : String(game._opponent);

      // Get winning cup
      const winningCup = await getWinningCup(round.randomModule);

      // Choose first cup and see if it won
      await KingGame.updateOne(
        { _id: gameId, "rounds.roundNumber": currentRoundNumber },
        {
          $inc: { roundNumber: 1 },
          $set: {
            status: 3,
            "rounds.$.played": true,
            "rounds.$.won": winningCup === FIRST_CUP,
          },
        }
      );

      // Notify user
      io.of("/king")
        .to(player)
        .emit(
          "round-result",
          gameId,
          FIRST_CUP,
          winningCup,
          winningCup === FIRST_CUP
        );

      // Wait for client animation
      const to = setTimeout(() => {
        clearTimeout(to);
        // Generate a new round
        generateNewRound(gameId);
      }, CLIENT_ANIMATION_LENGTH);
    } catch (error) {
      console.log("Error while auto-choosing:", error);
    }
  };

  // Generate new round and end game if winner is found
  const generateNewRound = async gameId => {
    try {
      // Get game from db
      const game = await KingGame.findOne({ _id: gameId });

      // Update game to loading status
      await KingGame.updateOne({ _id: gameId }, { $set: { status: 3 } });
      io.of("/king").emit("game-updated", {
        _id: gameId,
        status: 3,
        roundNumber: game.roundNumber,
      });

      // If game has more than 2 rounds played,
      // there is a possibility to lose.
      // Also check that both players have played
      // on the last "round"
      if (game.roundNumber > 2 && game.roundNumber % 2 !== 0) {
        // Check last 2 round result
        const lastRound = game.rounds.find(
          round => round.roundNumber === game.roundNumber - 1
        );
        const beforeLastRound = game.rounds.find(
          round => round.roundNumber === game.roundNumber - 2
        );

        // If both did win or both did lose
        if (lastRound.won === beforeLastRound.won) {
          // Generate new round
          const roundRandom = await generateKingRoundRandom(
            game.publicSeed,
            game.privateSeed,
            game.roundNumber,
            gameId
          );

          // Construct new round
          const newRound = {
            roundNumber: game.roundNumber,
            played: false,
            won: false,
            randomModule: roundRandom.module,
          };

          // Update document
          await KingGame.updateOne(
            { _id: gameId },
            {
              $set: {
                status: 2,
                nextAutoChoose:
                  Date.now() + config.games.king.autoChooseTimeout,
              },
              $push: { rounds: newRound },
            }
          );

          io.of("/king").emit("new-round", {
            _id: game.id,
            autoChooseTimeout: config.games.king.autoChooseTimeout,
          });

          // Set a timeout for the auto-choose
          const autoChoose = setTimeout(() => {
            clearTimeout(autoChoose);
            // Check if user haven't picked a cup
            checkAndAutoChoose(game.id, game.roundNumber);
          }, config.games.king.autoChooseTimeout);
        } else {
          // Calculate game winner
          const gameWinner = await getCurrentTurn(
            lastRound.won ? lastRound.roundNumber : beforeLastRound.roundNumber
          );
          const winnerId =
            gameWinner === "creator" ? game._creator : game._opponent;

          // Update document
          await KingGame.updateOne(
            { _id: game.id },
            {
              $set: {
                _winner: winnerId,
                status: 4,
              },
            }
          );

          // Calculate profit
          const profit = game.betAmount * 2;
          const houseRake = profit * config.games.king.feePercentage;
          const feeMultiplier = 1 - config.games.king.feePercentage;
          const wonAmount = profit * feeMultiplier;

          console.log(
            colors.magenta("King >> Game"),
            game.id,
            colors.magenta("ended, winner:"),
            winnerId,
            colors.magenta("Profit:"),
            wonAmount,
            colors.magenta("House edge amount:"),
            houseRake
          );

          // Payout winner
          await User.updateOne(
            { _id: winnerId },
            {
              $inc: {
                wallet: Math.abs(wonAmount),
              },
            }
          );
          insertNewWalletTransaction(
            winnerId,
            Math.abs(wonAmount),
            "King game win",
            { kingGameId: game.id }
          );

          // Update local wallet
          io.of("/king")
            .to(String(winnerId))
            .emit("update-wallet", Math.abs(wonAmount));

          io.of("/king")
            .to(String(winnerId))
            .emit(
              "notify-success",
              "Your opponent chose wrong last round, you won!"
            );

          // Apply 0.5% rake to current race prize pool
          await checkAndApplyRakeToRace(houseRake * 0.005);

          // Notify clients
          io.of("/king").emit("game-updated", {
            _id: game.id,
            status: 4,
            _winner: String(winnerId),
          });
        }
      } else {
        // Generate new round
        const roundRandom = await generateKingRoundRandom(
          game.publicSeed,
          game.privateSeed,
          game.roundNumber,
          gameId
        );

        // Construct new round
        const newRound = {
          roundNumber: game.roundNumber,
          played: false,
          won: false,
          randomModule: roundRandom.module,
        };

        // Update document
        await KingGame.updateOne(
          { _id: gameId },
          {
            $set: {
              status: 2,
              nextAutoChoose: Date.now() + config.games.king.autoChooseTimeout,
            },
            $push: { rounds: newRound },
          }
        );

        io.of("/king").emit("new-round", {
          _id: game.id,
          autoChooseTimeout: config.games.king.autoChooseTimeout,
        });

        // Set a timeout for the auto-choose
        const autoChoose = setTimeout(() => {
          clearTimeout(autoChoose);
          // Check if user haven't picked a cup
          checkAndAutoChoose(game.id, game.roundNumber);
        }, config.games.king.autoChooseTimeout);
      }
    } catch (error) {
      console.log("Error while generating new round", gameId, error);
      io.of("/king").emit(
        "notify-error",
        `There was an error while generating new round for game ${gameId}! Re-trying in 15 seconds...`
      );

      // Wait 15 seconds and try again
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        generateNewRound(gameId);
      }, 15000);
    }
  };

  // Listen for new websocket connections
  io.of("/king").on("connection", socket => {
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
     * @description Create a new king game
     *
     * @param {number} betAmount Bet amount
     * @param {boolean} private Whether this is a private game
     * @param {number} costMultiplier How much is paid for the opponents (0 < costMultiplier < 1)
     */
    socket.on("create-new-game", async (betAmount, private, costMultiplier) => {
      // Validate user input
      if (typeof betAmount !== "number" || isNaN(betAmount))
        return socket.emit("game-creation-error", "Invalid Bet Amount Type!");
      if (
        typeof costMultiplier !== "number" ||
        isNaN(costMultiplier) ||
        parseFloat(costMultiplier.toFixed(2)) > 1 ||
        parseFloat(costMultiplier.toFixed(2)) < 0
      )
        return socket.emit(
          "game-creation-error",
          "Invalid Cost multiplier type!"
        );
      if (typeof private !== "boolean")
        return socket.emit(
          "game-creation-error",
          "Invalid Private toggle type!"
        );
      if (!loggedIn)
        return socket.emit("game-creation-error", "You are not logged in!");

      // Get king enabled status
      const isEnabled = getKingState();

      // If king is disabled
      if (!isEnabled) {
        return socket.emit(
          "game-creation-error",
          "King gamemode is currently disabled! Contact admins for more information."
        );
      }

      // More validation on the bet value
      const { minBetAmount, maxBetAmount } = config.games.king;
      if (
        parseFloat(betAmount.toFixed(2)) < minBetAmount ||
        parseFloat(betAmount.toFixed(2)) > maxBetAmount
      ) {
        return socket.emit(
          "game-creation-error",
          `Your bet must be a minimum of ${minBetAmount} credits and a maximum of ${maxBetAmount} credits!`
        );
      }

      try {
        // Get user from database
        const dbUser = await User.findOne({ _id: user.id });

        // If user has restricted bets
        if (dbUser.betsLocked) {
          return socket.emit(
            "game-creation-error",
            "Your account has an betting restriction. Please contact support for more information."
          );
        }

        // If it's an private game
        if (private) {
          const gamePrice =
            parseFloat(betAmount.toFixed(2)) +
            parseFloat(betAmount.toFixed(2)) *
              parseFloat(costMultiplier.toFixed(2));

          // If user can afford this bet
          if (dbUser.wallet < gamePrice) {
            return socket.emit(
              "game-creation-error",
              "You can't afford this bet!"
            );
          }

          const newGame = new KingGame();

          // Remove bet amount from user's balance
          await User.updateOne(
            { _id: user.id },
            {
              $inc: {
                wallet: -Math.abs(gamePrice),
                wager: Math.abs(gamePrice),
                wagerNeededForWithdraw: -Math.abs(gamePrice),
              },
            }
          );
          insertNewWalletTransaction(
            user.id,
            -Math.abs(gamePrice),
            "King game creation",
            { kingGameId: newGame.id }
          );

          // Update local wallet
          socket.emit("update-wallet", -Math.abs(gamePrice));

          // Update user's race progress if there is an active race
          await checkAndEnterRace(user.id, Math.abs(gamePrice));

          // Generate pre-roll provably fair data
          const provablyData = await generatePrivateSeedHashPair();

          // Create unique invite code for this game
          const inviteCode = uuid.v4();

          // Create new document
          // Basic fields
          newGame.betAmount = parseFloat(betAmount.toFixed(2));
          newGame.privateGame = true;
          newGame.costMultiplier = parseFloat(costMultiplier.toFixed(2)); // How many percentage of the joining cost does the creator pay (only for private games)
          newGame.inviteCode = inviteCode; // Custom invite link (only for private games)

          // Provably Fair fields
          newGame.privateSeed = provablyData.seed;
          newGame.privateHash = provablyData.hash;

          // UserID of who created this game
          newGame._creator = user.id;

          // Save the document
          await newGame.save();

          // Create invite link for this game
          const inviteLink = `${config.site.frontend.productionUrl}/king/private/${inviteCode}`;

          // Construct a object without seed
          const parsedGame = {
            ...newGame.toObject(),
            ownPrivateGame: true,
            inviteLink,
            _creator: {
              avatar: user.avatar,
              username: user.username,
              _id: user.id,
            },
          };
          delete parsedGame.privateSeed;

          // Notify client
          socket.emit("new-king-game", parsedGame);
          socket.emit("private-game-created", inviteLink);
          socket.emit("notify-success", "Successfully created a new game!");

          console.log(
            colors.magenta("King >> Created a new game"),
            newGame.id,
            colors.magenta("worth"),
            `$${parseFloat(betAmount.toFixed(2))}.`,
            colors.magenta("Private:"),
            private
          );
        } else {
          // If user can afford this bet
          if (dbUser.wallet < parseFloat(betAmount.toFixed(2))) {
            return socket.emit(
              "game-creation-error",
              "You can't afford this bet!"
            );
          }

          const newGame = new KingGame();

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
            "King game creation",
            { kingGameId: newGame.id }
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

          const houseEdge =
            Math.abs(parseFloat(betAmount.toFixed(2))) *
            config.games.king.feePercentage;

          // Apply user's rakeback if eligible
          await checkAndApplyRakeback(user.id, houseEdge);

          // Apply cut of house edge to user's affiliator
          await checkAndApplyAffiliatorCut(user.id, houseEdge);

          // Generate pre-roll provably fair data
          const provablyData = await generatePrivateSeedHashPair();

          // Create new document
          // Basic fields
          newGame.betAmount = parseFloat(betAmount.toFixed(2));
          newGame.privateGame = false;
          newGame.costMultiplier = 0; // How many percentage of the joining cost does the creator pay (only for private games)
          newGame.inviteCode = null; // Custom invite link (only for private games)

          // Provably Fair fields
          newGame.privateSeed = provablyData.seed;
          newGame.privateHash = provablyData.hash;

          // UserID of who created this game
          newGame._creator = user.id;

          // Save the document
          await newGame.save();

          // Construct a object without seed
          const parsedGame = {
            ...newGame.toObject(),
            _creator: {
              avatar: user.avatar,
              username: user.username,
              _id: user.id,
            },
          };
          delete parsedGame.privateSeed;

          // Notify clients
          io.of("/king").emit("new-king-game", parsedGame);
          socket.emit("notify-success", "Successfully created a new game!");

          console.log(
            colors.magenta("King >> Created a new game"),
            newGame.id,
            colors.magenta("worth"),
            `$${parseFloat(betAmount.toFixed(2))}.`,
            colors.magenta("Private:"),
            private
          );
        }
      } catch (error) {
        console.log("Error while creating king game:", error);
        return socket.emit(
          "game-creation-error",
          "Your bet couldn't be placed: Internal server error, please try again later!"
        );
      }
    });

    /**
     * @description Join a king game
     *
     * @param {string} gameId The game's GameID
     * @param {string} recaptchaResponse Required if game type is private
     */
    socket.on("join-game", async (gameId, recaptchaResponse) => {
      // Validate user input
      if (typeof gameId !== "string" || gameId.length !== 24)
        return socket.emit("game-join-error", gameId, "Invalid GameID Type!");
      if (!loggedIn)
        return socket.emit("game-join-error", gameId, "You are not logged in!");

      // Get king enabled status
      const isEnabled = getKingState();

      // If king are disabled
      if (!isEnabled) {
        return socket.emit(
          "game-join-error",
          "King gamemode is currently disabled! Contact admins for more information."
        );
      }

      try {
        // Get user from database
        const dbUser = await User.findOne({ _id: user.id });

        // If user has restricted bets
        if (dbUser.betsLocked) {
          return socket.emit(
            "game-join-error",
            gameId,
            "Your account has an betting restriction. Please contact support for more information."
          );
        }

        // Find game from DB that user is taking part in
        const game = await KingGame.findOne({ _id: gameId, status: 1 });

        // If this game exists
        if (!game) {
          return socket.emit(
            "game-join-error",
            gameId,
            "Couldn't find an active game with that GameID!"
          );
        }

        // If player created this game
        if (String(game._creator) === user.id) {
          return socket.emit(
            "game-join-error",
            gameId,
            "You can't join your own game!"
          );
        }

        // Check if this is an private game
        if (game.privateGame) {
          // Verify reCaptcha response
          const valid = await verifyRecaptchaResponse(recaptchaResponse);

          // If captcha wasn't valid
          if (!valid) {
            return socket.emit(
              "game-join-error",
              gameId,
              "Your captcha wasn't valid, please try again later!"
            );
          }

          // Calculate bet amount
          const betAmount =
            game.betAmount - game.betAmount * game.costMultiplier;

          // Check if user can afford this bet
          if (dbUser.wallet < betAmount) {
            return socket.emit(
              "game-join-error",
              gameId,
              "You can't afford this bet!"
            );
          }

          // Remove bet amount from user's balance
          await User.updateOne(
            { _id: user.id },
            {
              $inc: {
                wallet: -Math.abs(betAmount),
                wager: Math.abs(betAmount),
                wagerNeededForWithdraw: -Math.abs(betAmount),
              },
            }
          );
          insertNewWalletTransaction(
            user.id,
            -Math.abs(betAmount),
            "King game join",
            { kingGameId: game.id }
          );

          // Update local wallet
          socket.emit("update-wallet", -Math.abs(betAmount));

          // Update user's race progress if there is an active race
          await checkAndEnterRace(user.id, Math.abs(betAmount));

          const houseEdge =
            Math.abs(parseFloat(betAmount.toFixed(2))) *
            config.games.king.feePercentage;

          // Apply user's rakeback if eligible
          await checkAndApplyRakeback(user.id, houseEdge);

          // Apply cut of house edge to user's affiliator
          await checkAndApplyAffiliatorCut(user.id, houseEdge);
        } else {
          // Check if user can afford this bet
          if (dbUser.wallet < game.betAmount) {
            return socket.emit(
              "game-join-error",
              gameId,
              "You can't afford this bet!"
            );
          }

          // Remove bet amount from user's balance
          await User.updateOne(
            { _id: user.id },
            {
              $inc: {
                wallet: -Math.abs(game.betAmount),
                wager: Math.abs(game.betAmount),
                wagerNeededForWithdraw: -Math.abs(game.betAmount),
              },
            }
          );
          insertNewWalletTransaction(
            user.id,
            -Math.abs(game.betAmount),
            "King game join",
            { kingGameId: game.id }
          );

          // Update local wallet
          socket.emit("update-wallet", -Math.abs(game.betAmount));

          // Update user's race progress if there is an active race
          await checkAndEnterRace(user.id, Math.abs(game.betAmount));

          const houseEdge =
            Math.abs(parseFloat(betAmount.toFixed(2))) *
            config.games.king.feePercentage;

          // Apply user's rakeback if eligible
          await checkAndApplyRakeback(user.id, houseEdge);

          // Apply cut of house edge to user's affiliator
          await checkAndApplyAffiliatorCut(user.id, houseEdge);
        }

        // Construct a new player object
        const _opponent = {
          avatar: user.avatar,
          username: user.username,
          _id: user.id,
        };

        // Update document to disable joining
        await KingGame.updateOne(
          { _id: game.id },
          {
            $set: { status: 3, _opponent: user.id },
            $inc: { roundNumber: 1 },
          }
        );

        // Notify clients
        socket.emit("game-join-success", game.id);
        io.of("/king").emit("game-joined", { _id: game.id, _opponent });

        // Start the game (get public seed)
        startKingGame(game.id);
      } catch (error) {
        console.log("Error while joining king game:", error);
        return socket.emit(
          "game-join-error",
          gameId,
          "Your bet couldn't be placed: Internal server error, please try again later!"
        );
      }
    });

    /**
     * @description Make your move when it's your turn
     *
     * @param {string} gameId The game's GameID
     * @param {string} color What coloured cup to choose (green, red or blue)
     */
    socket.on("make-move", async (gameId, color) => {
      // Validate user input
      if (typeof gameId !== "string" || gameId.length !== 24)
        return socket.emit("move-making-error", gameId, "Invalid GameID Type!");
      if (
        typeof color !== "string" ||
        !["green", "red", "blue"].includes(color)
      )
        return socket.emit(
          "move-making-error",
          gameId,
          "Invalid Cup Color Type!"
        );
      if (!loggedIn)
        return socket.emit(
          "move-making-error",
          gameId,
          "You are not logged in!"
        );

      try {
        // Find game from DB that user is taking part in
        const game = await KingGame.findOne({
          _id: gameId,
          status: 2,
          $or: [{ _creator: user.id }, { _opponent: user.id }],
        });

        // If this game exists
        if (!game) {
          return socket.emit(
            "move-making-error",
            gameId,
            "Couldn't find an active game with that GameID!"
          );
        }

        // Flag to check who's turn it is
        const userSide =
          String(game._creator) === user.id ? "creator" : "opponent";
        const whosTurn = await getCurrentTurn(game.roundNumber);

        // Check if it's not this player's turn
        if (userSide !== whosTurn) {
          return socket.emit(
            "move-making-error",
            gameId,
            "Please wait for the opponent to make their move!"
          );
        }

        // Get current round
        const currentRound = game.rounds.find(
          round => round.roundNumber === game.roundNumber
        );

        // If round is bugged for some reason
        if (!currentRound || currentRound.played) {
          return socket.emit(
            "move-making-error",
            gameId,
            "Couldn't find the current round! If this error persists, contact site admins"
          );
        }

        // Get winning cup
        const winningCup = await getWinningCup(currentRound.randomModule);

        // Choose first cup and see if it won
        await KingGame.updateOne(
          { _id: game.id, "rounds.roundNumber": game.roundNumber },
          {
            $inc: { roundNumber: 1 },
            $set: {
              status: 3,
              "rounds.$.played": true,
              "rounds.$.won": winningCup === color,
            },
          }
        );

        // Notify user
        socket.emit(
          "round-result",
          game.id,
          color,
          winningCup,
          winningCup === color
        );

        // Wait for client animation
        const to = setTimeout(() => {
          clearTimeout(to);
          // Generate a new round
          generateNewRound(gameId);
        }, CLIENT_ANIMATION_LENGTH);
      } catch (error) {
        console.log("Error while making king game move:", error);
        return socket.emit(
          "move-making-error",
          gameId,
          "Your move couldn't be made: Internal server error, please try again later!"
        );
      }
    });
  });
};

// Export functions
module.exports = { listen };
