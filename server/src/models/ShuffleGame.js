// Require Dependencies
const mongoose = require("mongoose");

// Setup ShuffleGame Schema
const ShuffleGameSchema = new mongoose.Schema({
  // Basic fields
  winner: Object,
  players: Array,
  nextRoundPlayers: Array,

  // Provably Fair fields
  privateSeed: String,
  privateHash: String,
  publicSeed: {
    type: String,
    default: null,
  },
  randomModule: {
    type: Number,
    default: null,
  },

  // When game was created
  created: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the new model
const ShuffleGame = (module.exports = mongoose.model(
  "ShuffleGame",
  ShuffleGameSchema
));
