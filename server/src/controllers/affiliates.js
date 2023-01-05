// Require Dependencies
const User = require("../models/User");
const config = require("../config");

// Give affiliator his cut of wager
async function checkAndApplyAffiliatorCut(userId, houseRake) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: userId });

      // Find the affiliator
      const affiliator = await User.findOne({ _id: user._affiliatedBy });

      // If user has affiliator
      if (affiliator) {
        // Update document
        await User.updateOne(
          { _id: affiliator.id },
          {
            $inc: {
              affiliateMoney:
                houseRake * (config.games.affiliates.earningPercentage / 100),
            },
          }
        );

        // Resolve to continue successfully
        resolve();
      } else {
        // Resolve to continue successfully
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Export functions
module.exports = { checkAndApplyAffiliatorCut };
