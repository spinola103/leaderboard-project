const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ADD new user
router.post('/', async (req, res) => {
  const { name, avatar } = req.body;
  const user = new User({ name, avatar });
  await user.save();
  res.status(201).json(user);
});

// GET leaderboard (sorted)
router.get('/leaderboard', async (req, res) => {
  const leaderboard = await User.find().sort({ totalPoints: -1 });
  res.json(leaderboard);
});

module.exports = router;
