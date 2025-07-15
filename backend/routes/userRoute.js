const express = require('express');
const User = require('../models/gameUser');
const ClaimHistory = require('../models/claimHistory');

const router = express.Router();

// Add new user
router.post('/add', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const user = new User({ name, createdBy: userId });
    await user.save();

    global.io.emit('leaderboardUpdated');

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'User creation failed', error: err.message });
  }
});

// Get all users for a specific user (sorted by points and assign rank)
router.get('/all/:userId', async (req, res) => {
  try {
    const users = await User.find({ createdBy: req.params.userId }).sort({ points: -1 });

    const rankedUsers = users.map((user, index) => ({
      _id: user._id,
      name: user.name,
      points: user.points,
      rank: index + 1
    }));

    res.json(rankedUsers);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Claim random points
router.post('/claim/:playerId', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ _id: req.params.playerId, createdBy: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const pointsEarned = Math.floor(Math.random() * 10) + 1;
    user.points = (user.points || 0) + pointsEarned;
    await user.save();

    await ClaimHistory.create({
      playerId: user._id,
      userName: user.name,
      pointsEarned,
      userId: user.createdBy,
    });

    global.io.emit('leaderboardUpdated');

    res.json({ user, pointsEarned });
  } catch (err) {
    res.status(500).json({ message: 'Claim failed' });
  }
});

// Get users in reverse creation order (latest first)
router.get('/recent/:userId', async (req, res) => {
  try {
    const users = await User.find({ createdBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Get last 20 claim history entries
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await ClaimHistory.find({ userId })
      .sort({ claimedAt: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    console.error('History fetch failed:', err);
    res.status(500).json({ message: 'Failed to fetch claim history' });
  }
});

// Delete user by ID for specific logged-in user

router.delete('/delete/:id', async (req, res) => {
  try {
    const { userId } = req.body;

    // Delete user
    const deleted = await User.findOneAndDelete({ _id: req.params.id, createdBy: userId });
    if (!deleted) return res.status(404).json({ message: 'User not found or unauthorized' });

    // Also delete claim history of this player
    await ClaimHistory.deleteMany({ playerId: req.params.id });

    res.json({ message: 'User and related history deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});


module.exports = router;
