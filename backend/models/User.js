const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthDate: { type: Date, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  goal: { type: String },
  healthCondition: { type: String },
  activityLevel: { type: String },
  dietaryPreferences: { type: String },
  coffeeConsumption: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
