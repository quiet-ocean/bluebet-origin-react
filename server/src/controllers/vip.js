// Require Dependencies
const User = require("../models/User");
const config = require("../config");

// Get user vip level
function getVipLevelFromWager(wager) {
  return config.games.vip.levels
    .filter(level => wager >= level.wagerNeeded)
    .sort((a, b) => b.wagerNeeded - a.wagerNeeded)[0];
}

// Get user next vip level
function getNextVipLevelFromWager(wager) {
  return config.games.vip.levels
    .filter(level => wager < level.wagerNeeded)
    .sort((a, b) => a.wagerNeeded - b.wagerNeeded)[0];
}

// Check if user is eligible for rakeback
async function checkAndApplyRakeback(userId, houseRake) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: userId });

      // Find the corresponding level
      const currentLevel = await getVipLevelFromWager(user.wager);

      // Update document
      await User.updateOne(
        { _id: user.id },
        {
          $inc: {
            rakebackBalance:
              houseRake * (currentLevel.rakebackPercentage / 100),
          },
        }
      );

      // Resolve to continue successfully
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Export functions
module.exports = {
  getVipLevelFromWager,
  getNextVipLevelFromWager,
  checkAndApplyRakeback,
};
