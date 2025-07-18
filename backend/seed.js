const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const users = [
  { name: "Rahul" },
  { name: "Kamal" },
  { name: "Sanak" },
  { name: "Pritesh" },
  { name: "Rimy" },
  { name: "Krishu" },
  { name: "Thakur" },
  { name: "Mukku" },
  { name: "Capriin" },
  { name: "Rajput" }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany({});
  await User.insertMany(users);
  console.log("Users seeded");
  mongoose.disconnect();
});
