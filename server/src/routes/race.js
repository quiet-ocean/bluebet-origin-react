// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const config = require("../config");

const Race = require("../models/Race");
const RaceEntry = require("../models/RaceEntry");

/**
 * @route   GET /api/race/
 * @desc    Get current race information
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    // Get active race from database
    const activeRace = await Race.findOne({ active: true });

    // If there is an active race
    if (activeRace) {
      // Get top 10 players
      const topTen = await RaceEntry.find({ _race: activeRace.id })
        .sort({ value: -1 })
        .limit(10)
        .populate("_user", ["avatar", "username"]);

      return res.json({
        active: true,
        activeRace,
        topTen,
        prizeDistribution: config.games.race.prizeDistribution,
      });
    } else {
      return res.json({ active: false });
    }
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/race/me
 * @desc    Get your current race progress
 * @access  Private
 */
router.get("/me", validateJWT, async (req, res, next) => {
  try {
    // Get active race from database
    const activeRace = await Race.findOne({ active: true });

    // If there is an active race
    if (activeRace) {
      // Get user's entry
      const existingEntry = await RaceEntry.findOne({
        _user: req.user.id,
        _race: activeRace.id,
      });

      // Get all race entries
      const allEntrys = await RaceEntry.find({ _race: activeRace.id }).sort({
        value: -1,
      });

      return res.json({
        active: true,
        myPosition: existingEntry
          ? allEntrys.map(entry => String(entry._user)).indexOf(req.user.id) + 1
          : -1,
        myProgress: existingEntry
          ? parseFloat(existingEntry.value.toFixed(2))
          : -1,
      });
    } else {
      return res.json({ active: false });
    }
  } catch (error) {
    return next(error);
  }
});
