const mongoose = require('mongoose');

const gameUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
}, { timestamps: true });

module.exports = mongoose.model('GameUser', gameUserSchema);
