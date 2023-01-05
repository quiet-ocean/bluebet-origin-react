// Require Dependencies
const { getMaintenanceState } = require("../controllers/site-settings");

// Middleware to check maintenance status
const checkMaintenance = async (req, res, next) => {
  // Get toggle status
  const isMaintenance = getMaintenanceState();

  // If site is on maintenance
  if (isMaintenance) {
    res.status(503);
    return next(new Error("Cups.gg is currently on maintenance!"));
  } else {
    return next();
  }
};

// Export middlewares
module.exports = { checkMaintenance };
