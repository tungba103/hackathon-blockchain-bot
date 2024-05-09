const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  addressId: { type: String, required: true },
  aliasName: { type: String, required: true },
});

addressSchema.index({ addressId: 1, aliasName: 1 }, { unique: true });

const subscribePlanSchema = new Schema({
  planName: { type: String, required: true },
  addressLimit: { type: Number, required: true },
});

const userSchema = new Schema({
  telegramId: { type: String, required: true, unique: true },
  addresses: [addressSchema],
  subscribePlan: subscribePlanSchema,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
