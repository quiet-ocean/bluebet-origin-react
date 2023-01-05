// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const moment = require("moment");

const User = require("../../../models/User");
const CryptoTransaction = require("../../../models/CryptoTransaction");
const CupsGame = require("../../../models/CupsGame");
const ShuffleGame = require("../../../models/ShuffleGame");
const CrashGame = require("../../../models/CrashGame");
const KingGame = require("../../../models/KingGame");
const RouletteGame = require("../../../models/RouletteGame");

// Sum all values together
const sumReducer = (a, b) => a + b;

// Map documents to group by days
const mapToWeekDays = (
  documentsArray,
  countField,
  createdField,
  countAmountOnly,
  gamemode
) => {
  const week = Array(7)
    .fill()
    .map((empty, index) => moment().day(index + 1));

  // Decalre variables to hold our mapping
  const labels = [];
  const data = [];

  // Loop through each day of the week
  for (let dayIndex = 0; dayIndex < week.length; dayIndex++) {
    const date = week[dayIndex];

    // Keep track of total sum
    let total = 0;

    // Loop through each document
    for (
      let documentIndex = 0;
      documentIndex < documentsArray.length;
      documentIndex++
    ) {
      const document = documentsArray[documentIndex];

      // Declare variables to keep time
      const startOfTheDay = moment(date).startOf("day").valueOf();
      const endOfTheDay = moment(date).endOf("day").valueOf();
      const created = new Date(document[createdField]).getTime();

      // If document was created this day
      if (created >= startOfTheDay && created <= endOfTheDay) {
        // If we are counting games
        if (gamemode) {
          // Switch from gamemode
          switch (gamemode) {
            default:
            case "cups":
              total += document.betAmount * document.playerAmount;
              break;
            case "king":
              total += document.betAmount * 2;
              break;
            case "shuffle":
              total += document.players
                .map(player => player.betAmount)
                .reduce(sumReducer, 0);
              break;
            case "roulette":
              total += document.players
                .map(player => player.betAmount)
                .reduce(sumReducer, 0);
              break;
            case "crash":
              total += Object.values(document.players)
                .map(player => player.betAmount)
                .reduce(sumReducer, 0);
              break;
            case "transactions":
              if (document.type === "deposit") {
                total += document[countField];
              } else if (document.type === "withdraw") {
                total -= document[countField];
              }
              break;
          }
        } else {
          // If we only count amounts
          if (countAmountOnly) {
            total++;
          } else {
            total += document[countField];
          }
        }
      }
    }

    // Append date data
    labels.push(date.format("ll"));
    data.push(total);
  }

  return { labels, data };
};

/**
 * @route   GET /api/external/v1/statistics/dashboard
 * @desc    Get statistical data for dashboard
 * @access  Private
 */
router.get("/dashboard", async (req, res, next) => {
  try {
    // Get today's date
    const today = moment().startOf("day");
    const yesterday = moment().add(-1, "days");
    const firstDayOfTheWeek = moment().day(1);
    const firstDayOfNextWeek = moment().day(7);

    // // Get all users registered
    const allUsers = await User.find();
    // Get all users registered today
    const usersToday = await User.find({ created: { $gte: today } });
    // Get all users registered yesterday
    const usersYesterday = await User.find({
      created: { $gte: yesterday, $lt: today },
    });
    // Get all users registered this week
    const usersThisWeek = await User.find({
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();
    // Get parsed graph statistics
    const weeklyUsersGraphData = mapToWeekDays(
      usersThisWeek,
      "_id",
      "created",
      true
    );

    // Compile user statistics
    const userStatistics = {
      totalValueToday: allUsers.length,
      isRising: usersToday.length > usersYesterday.length,
      graphData: weeklyUsersGraphData,
    };

    // // Get all withdraws
    // const allWithdraws = await CryptoTransaction.find({ type: "withdraw" });
    // Get withdraws today
    const withdrawsToday = await CryptoTransaction.find({
      type: "withdraw",
      created: { $gte: today },
    }).lean();
    // Get withdraws yesterday
    const withdrawsYesterday = await CryptoTransaction.find({
      type: "withdraw",
      created: { $gte: yesterday, $lt: today },
    });
    // Get withdraws from this week
    const withdrawsThisWeek = await CryptoTransaction.find({
      type: "withdraw",
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();
    // Get parsed graph statistics
    const weeklyWithdrawsGraphData = mapToWeekDays(
      withdrawsThisWeek,
      "siteValue",
      "created",
      false
    );

    // Compile withdraw statistics
    const withdrawStatistics = {
      totalValueToday: withdrawsToday
        .map(trx => trx.siteValue)
        .reduce(sumReducer, 0),
      isRising:
        withdrawsToday.map(trx => trx.siteValue).reduce(sumReducer, 0) >
        withdrawsYesterday.map(trx => trx.siteValue).reduce(sumReducer, 0),
      graphData: weeklyWithdrawsGraphData,
    };

    // // Get all deposits
    // const allDeposits = await CryptoTransaction.find({ type: "deposit" });
    // Get deposits today
    const depositsToday = await CryptoTransaction.find({
      type: "deposit",
      created: { $gte: today },
    }).lean();
    // Get deposits yesterday
    const depositsYesterday = await CryptoTransaction.find({
      type: "deposit",
      created: { $gte: yesterday, $lt: today },
    });
    // Get deposits from this week
    const depositsThisWeek = await CryptoTransaction.find({
      type: "deposit",
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();
    // Get parsed graph statistics
    const weeklyDepositsGraphData = mapToWeekDays(
      depositsThisWeek,
      "siteValue",
      "created",
      false
    );

    // Compile deposit statistics
    const depositStatistics = {
      totalValueToday: depositsToday
        .map(trx => trx.siteValue)
        .reduce(sumReducer, 0),
      isRising:
        depositsToday.map(trx => trx.siteValue).reduce(sumReducer, 0) >
        depositsYesterday.map(trx => trx.siteValue).reduce(sumReducer, 0),
      graphData: weeklyDepositsGraphData,
    };

    // Get cups games today
    const cupsGamesToday = await CupsGame.find({
      created: { $gte: today },
    }).lean();
    // Get cups games yesterday
    const cupsGamesYesterday = await CupsGame.find({
      created: { $gte: yesterday, $lt: today },
    }).lean();
    // Get cups games from this week
    const cupsGamesThisWeek = await CupsGame.find({
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();

    // Get shuffle games today
    const shuffleGamesToday = await ShuffleGame.find({
      created: { $gte: today },
    }).lean();
    // Get shuffle games yesterday
    const shuffleGamesYesterday = await ShuffleGame.find({
      created: { $gte: yesterday, $lt: today },
    }).lean();
    // Get shuffle games from this week
    const shuffleGamesThisWeek = await ShuffleGame.find({
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();

    // Get king games today
    const kingGamesToday = await KingGame.find({
      created: { $gte: today },
    }).lean();
    // Get king games yesterday
    const kingGamesYesterday = await KingGame.find({
      created: { $gte: yesterday, $lt: today },
    }).lean();
    // Get king games from this week
    const kingGamesThisWeek = await KingGame.find({
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();

    // Get roulette games today
    const rouletteGamesToday = await RouletteGame.find({
      created: { $gte: today },
    }).lean();
    // Get roulette games yesterday
    const rouletteGamesYesterday = await RouletteGame.find({
      created: { $gte: yesterday, $lt: today },
    }).lean();
    // Get roulette games from this week
    const rouletteGamesThisWeek = await RouletteGame.find({
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();

    // Get crash games today
    const crashGamesToday = await CrashGame.find({
      created: { $gte: today },
    }).lean();
    // Get crash games yesterday
    const crashGamesYesterday = await CrashGame.find({
      created: { $gte: yesterday, $lt: today },
    }).lean();
    // Get crash games from this week
    const crashGamesThisWeek = await CrashGame.find({
      created: {
        $gte: firstDayOfTheWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();

    // Compile games statistics
    const gamesStatistics = {
      cups: {
        totalValueToday: cupsGamesToday
          .map(game => game.betAmount * game.playerAmount)
          .reduce(sumReducer, 0),
        isRising:
          cupsGamesToday
            .map(game => game.betAmount * game.playerAmount)
            .reduce(sumReducer, 0) >
          cupsGamesYesterday
            .map(game => game.betAmount * game.playerAmount)
            .reduce(sumReducer, 0),
        graphData: mapToWeekDays(
          cupsGamesThisWeek,
          "betAmount",
          "created",
          false,
          "cups"
        ),
      },
      shuffle: {
        totalValueToday: shuffleGamesToday
          .map(game =>
            game.players.map(player => player.betAmount).reduce(sumReducer, 0)
          )
          .reduce(sumReducer, 0),
        isRising:
          shuffleGamesToday
            .map(game =>
              game.players.map(player => player.betAmount).reduce(sumReducer, 0)
            )
            .reduce(sumReducer, 0) >
          shuffleGamesYesterday
            .map(game =>
              game.players.map(player => player.betAmount).reduce(sumReducer, 0)
            )
            .reduce(sumReducer, 0),
        graphData: mapToWeekDays(
          shuffleGamesThisWeek,
          "betAmount",
          "created",
          false,
          "shuffle"
        ),
      },
      roulette: {
        totalValueToday: rouletteGamesToday
          .map(game =>
            game.players.map(player => player.betAmount).reduce(sumReducer, 0)
          )
          .reduce(sumReducer, 0),
        isRising:
          rouletteGamesToday
            .map(game =>
              game.players.map(player => player.betAmount).reduce(sumReducer, 0)
            )
            .reduce(sumReducer, 0) >
          rouletteGamesYesterday
            .map(game =>
              game.players.map(player => player.betAmount).reduce(sumReducer, 0)
            )
            .reduce(sumReducer, 0),
        graphData: mapToWeekDays(
          rouletteGamesThisWeek,
          "betAmount",
          "created",
          false,
          "roulette"
        ),
      },
      crash: {
        totalValueToday: crashGamesToday
          .map(game =>
            Object.values(game.players)
              .map(player => player.betAmount)
              .reduce(sumReducer, 0)
          )
          .reduce(sumReducer, 0),
        isRising:
          crashGamesToday
            .map(game =>
              Object.values(game.players)
                .map(player => player.betAmount)
                .reduce(sumReducer, 0)
            )
            .reduce(sumReducer, 0) >
          crashGamesYesterday
            .map(game =>
              Object.values(game.players)
                .map(player => player.betAmount)
                .reduce(sumReducer, 0)
            )
            .reduce(sumReducer, 0),
        graphData: mapToWeekDays(
          crashGamesThisWeek,
          "betAmount",
          "created",
          false,
          "crash"
        ),
      },
    };

    // Get parsed graph statistics
    const weeklyProfitGraphData = mapToWeekDays(
      [...depositsThisWeek, ...withdrawsThisWeek],
      "siteValue",
      "created",
      false,
      "transactions"
    );

    // Compile profit statistics
    const profitStatistics = {
      totalValueToday:
        depositsToday.map(deposit => deposit.siteValue).reduce(sumReducer, 0) -
        withdrawsToday
          .map(withdraw => withdraw.siteValue)
          .reduce(sumReducer, 0),
      isRising:
        depositsToday.map(deposit => deposit.siteValue).reduce(sumReducer, 0) -
          withdrawsToday
            .map(withdraw => withdraw.siteValue)
            .reduce(sumReducer, 0) >
        depositsYesterday
          .map(deposit => deposit.siteValue)
          .reduce(sumReducer, 0) -
          withdrawsYesterday
            .map(withdraw => withdraw.siteValue)
            .reduce(sumReducer, 0),
      graphData: weeklyProfitGraphData,
    };

    // Construct and combile statistics
    const compiledStatistics = {
      userStatistics,
      profitStatistics,
      withdrawStatistics,
      depositStatistics,
      gamesStatistics,
    };

    // Return all statistics combined
    return res.json(compiledStatistics);
  } catch (error) {
    return next(error);
  }
});
