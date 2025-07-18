const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const User = require('../models/User');

// Claim random points
router.post('/:userId', async (req, res) => {
  const userId = req.params.userId;

  const randomPoints = Math.floor(Math.random() * 10) + 1;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.totalPoints += randomPoints;
  await user.save();

  const claim = new Claim({ userId, pointsClaimed: randomPoints });
  await claim.save();

  res.json({
    message: `Claimed ${randomPoints} points`,
    user: { ...user._doc, pointsClaimed: randomPoints }
  });
});

// Claim history for user
router.get('/history/:userId', async (req, res) => {
  const claims = await Claim.find({ userId: req.params.userId }).sort({ timestamp: -1 });
  res.json(claims);
});

module.exports = router;
