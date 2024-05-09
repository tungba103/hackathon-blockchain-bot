const mongoose = require('mongoose');
const User = require('../models/user.model');

class DbService {
  connection;
  async connect() {
    mongoose.set('strictQuery', true);
    this.connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected');
  }

  async getUserByTelegramId(telegramId) {
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = await User.create({
        telegramId,
        subscribePlan: {
          planName: 'Free',
          addressLimit: 5,
        },
        addresses: [],
      });
    }
    return user;
  }

  async getUserAddresses(userId) {
    const user = await User.findById(userId);
    return user ? user.addresses : null;
  }

  async createNewAddress(userId, addressId, aliasName) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.addresses.length >= user.subscribePlan.addressLimit) {
      throw new Error('Address limit exceeded');
    }

    const duplicate = user.addresses.find((addr) => addr.addressId === addressId && addr.aliasName === aliasName);
    if (duplicate) {
      throw new Error('Duplicate address');
    }

    user.addresses.push({ addressId, aliasName });
    await user.save();
    return user.addresses;
  }
}

module.exports = new DbService();
