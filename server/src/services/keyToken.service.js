"use strict";
const { Types } = require("mongoose");
const { Keytoken } = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userName,
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const fill = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await Keytoken.findOneAndUpdate(fill, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  static removeKeyById = async (id) => {
    return await Keytoken.deleteOne(id);
  };
  static findByUserId = async (userId) => {
    return await Keytoken.findOne({ user: new Types.ObjectId(userId) }).lean();
  };

  static deleteKeyById = async (userId) => {
    return await Keytoken.deleteOne({
      user: new Types.ObjectId(userId),
    }).lean();
  };

  static findAndUpdate = async (tokens, refreshToken) => {
    return await Keytoken.findOneAndUpdate(
      { refreshToken: refreshToken },
      {
        $set: { refreshToken: tokens.refreshToken },
        $addToSet: { refreshTokenUsed: refreshToken },
      },
      { new: true }
    );
  };
}
module.exports = KeyTokenService;
