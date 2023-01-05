// Require Dependencies
const mongoose = require("mongoose");
const SchemaTypes = mongoose.SchemaTypes;

// Setup KingGame Schema
const KingGameSchema = new mongoose.Schema({
  // Basic fields
  betAmount: Number, // User bet amount
  privateGame: Boolean, // Whether this is a private game
  costMultiplier: Number, // How many percentage of the joining cost does the creator pay (only for private games)
  inviteCode: String, // Custom invite code (only for private games)

  // Provably Fair fields
  privateSeed: String,
  privateHash: String,
  publicSeed: {
    type: String,
    default: null,
  },

  // What round is currently being played (0 = waiting)
  roundNumber: {
    type: Number,
    default: 0,
  },

  // Every round object that has been played
  rounds: {
    type: Array,
    default: [],
    /**
     * Every round will contain:
     *
     * - Who played that round
     * - Did he win or lose
     * - Module for that result
     */
  },

  // UserID of the player who won
  _winner: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    default: null,
  },

  // UserID of who created this game
  _creator: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },

  // UserID of who joined this game
  _opponent: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },

  // Game status
  status: {
    type: Number,
    default: 1,
    /**
     * Status list:
     *
     * 1 = Waiting for players
     * 2 = Active (playing/playable)
     * 3 = Rolling next round
     * 4 = Ended
     */
  },

  // When will the next auto-choose take place
  // Unix time (ms)
  nextAutoChoose: {
    type: Number,
    default: 0,
  },

  // When game was created
  created: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the new model
const KingGame = (module.exports = mongoose.model("KingGame", KingGameSchema));
