const mongoose = require('mongoose');

const claimHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The account owner
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'GameUser', required: true }, 
  userName: { type: String, required: true },
  pointsEarned: { type: Number, required: true },
  claimedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClaimHistory', claimHistorySchema);
