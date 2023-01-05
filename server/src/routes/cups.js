// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const config = require("../config");

const CupsGame = require("../models/CupsGame");

/**
 * @route   GET /api/cups/
 * @desc    Get active cups games
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    // Get active games
    const criteria = { status: 1, privateGame: false };
    const games = await CupsGame.find(criteria)
      .sort({ created: -1 })
      .select({ privateSeed: 0 });

    return res.json(games);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/cups/me
 * @desc    Get user's private games
 * @access  Private
 */
router.get("/me", validateJWT, async (req, res, next) => {
  try {
    // Get user's private games
    const ownCriteria = {
      status: 1,
      privateGame: true,
      _creator: req.user.id,
    };
    const ownPrivateGames = await CupsGame.find(ownCriteria)
      .sort({ created: -1 })
      .select({ privateSeed: 0 })
      .lean();

    // Map to differenciate from normal games
    const mapper = item => ({
      ...item,
      ownPrivateGame: true,
      inviteLink: `${config.site.frontend.productionUrl}/cups/private/${item.inviteCode}`,
    });

    return res.json(ownPrivateGames.map(mapper));
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/cups/private/:inviteCode
 * @desc    Get private game from invite code
 * @access  Public
 */
router.get("/private/:inviteCode", async (req, res, next) => {
  try {
    // Get active games
    const criteria = {
      status: 1,
      privateGame: true,
      inviteCode: req.params.inviteCode,
    };
    const game = await CupsGame.findOne(criteria).select({ privateSeed: 0 });

    // If game was not found
    if (!game) {
      res.status(400);
      return next(
        new Error("Couldn't find an active game with that invite code!")
      );
    } else {
      return res.json(game);
    }
  } catch (error) {
    return next(error);
  }
});
