// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { check, validationResult } = require("express-validator");
const {
  toggleMaintenance,
  getMaintenanceState,
  toggleLogin,
  getLoginState,
  toggleDeposits,
  getDepositState,
  toggleWithdraws,
  getWithdrawState,
  toggleCups,
  getCupsState,
  toggleShuffle,
  getShuffleState,
  toggleKing,
  getKingState,
  toggleRoulette,
  getRouletteState,
  toggleCrash,
  getCrashState,
} = require("../../../controllers/site-settings");

/**
 * @route   GET /api/external/v1/controls/
 * @desc    Get toggle states
 * @access  Private
 */
router.get("/", async (req, res) => {
  return res.json({
    maintenanceEnabled: getMaintenanceState(),
    loginEnabled: getLoginState(),
    depositsEnabled: getDepositState(),
    withdrawsEnabled: getWithdrawState(),
    gamesEnabled: {
      cupsEnabled: getCupsState(),
      shuffleEnabled: getShuffleState(),
      kingEnabled: getKingState(),
      rouletteEnabled: getRouletteState(),
      crashEnabled: getCrashState(),
    },
  });
});

/**
 * @route   POST /api/external/v1/controls/toggle-state
 * @desc    Toggle states on the site
 * @access  Private
 */
router.post(
  "/toggle-state",
  [
    check("name", "Toggle name is required")
      .isString()
      .isIn([
        "maintenance",
        "login",
        "deposit",
        "withdraw",
        "cups",
        "shuffle",
        "king",
        "roulette",
        "crash",
      ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Switch from possible toggles
    switch (name) {
      case "maintenance":
      default:
        // Toggle maintenance status
        toggleMaintenance();

        return res.json({
          currentState: getMaintenanceState(),
        });
      case "login":
        // Toggle login status
        toggleLogin();

        return res.json({
          currentState: getLoginState(),
        });
      case "deposit":
        // Toggle deposit status
        toggleDeposits();

        return res.json({
          currentState: getDepositState(),
        });
      case "withdraw":
        // Toggle withdraw status
        toggleWithdraws();

        return res.json({
          currentState: getWithdrawState(),
        });
      case "cups":
        // Toggle cups status
        toggleCups();

        return res.json({
          currentState: getCupsState(),
        });
      case "shuffle":
        // Toggle shuffle status
        toggleShuffle();

        return res.json({
          currentState: getShuffleState(),
        });
      case "king":
        // Toggle king status
        toggleKing();

        return res.json({
          currentState: getKingState(),
        });
      case "roulette":
        // Toggle maintenance status
        toggleRoulette();

        return res.json({
          currentState: getRouletteState(),
        });
      case "crash":
        // Toggle maintenance status
        toggleCrash();

        return res.json({
          currentState: getCrashState(),
        });
    }
  }
);
