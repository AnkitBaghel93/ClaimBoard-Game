const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
      resetPasswordToken: String,
      resetPasswordExpires: Date,

    // 🧠 Add these two fields for password reset functionality
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
