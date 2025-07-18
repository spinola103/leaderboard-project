const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  totalPoints: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
