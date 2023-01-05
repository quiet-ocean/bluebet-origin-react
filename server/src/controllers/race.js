// Require Dependencies
const Race = require("../models/Race");
const RaceEntry = require("../models/RaceEntry");
const User = require("../models/User");

// Enter an active race (if there is currently one active)
async function checkAndEnterRace(userId, amount) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get active race
      const activeRace = await Race.findOne({ active: true });

      // If there is an active race
      if (activeRace) {
        // Get user
        const user = await User.findOne({ _id: userId });

        // If user doesn't exist
        // or isn't allowed to participate
        if (!user || user.rank > 1) {
          // Resolve to successfully continue
          return resolve();
        }

        // Get exising race entry
        const exisitingEntry = await RaceEntry.findOne({
          _user: userId,
          _race: activeRace.id,
        });

        // If user has existing entry
        if (exisitingEntry) {
          // Update entry
          await RaceEntry.updateOne(
            { _id: exisitingEntry.id },
            { $inc: { value: amount } }
          );

          // Resolve to successfully continue
          resolve();
        } else {
          // Create new entry
          const newEntry = new RaceEntry({
            // How much user has contributed to this race
            value: amount,

            // Who owns this entry
            _user: userId,

            // What race is this entry for
            _race: activeRace.id,
          });

          // Save new entry
          await newEntry.save();

          // Resolve to successfully continue
          resolve();
        }
      } else {
        // Resolve to successfully continue
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Increment active race prize by rake% (if there is currently one active)
async function checkAndApplyRakeToRace(rakeValue) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get active race
      const activeRace = await Race.findOne({ active: true });

      // If there is an active race
      if (activeRace) {
        // Update and increment race prize
        await Race.updateOne(
          { _id: activeRace.id },
          { $inc: { prize: rakeValue } }
        );
        // Resolve to successfully continue
        resolve();
      } else {
        // Resolve to successfully continue
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Export functions
module.exports = { checkAndEnterRace, checkAndApplyRakeToRace };
