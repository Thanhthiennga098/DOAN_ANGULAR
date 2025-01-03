"use strict";

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const {
  badRequestError,
  AuthFailureError,
  NotFoundError,
} = require("../core/error.response");
const { findByEmail } = require("./user.service");
const { User } = require("../models/user.model");
const RolesUser = {
  USER: "USER",
  ADMIN: "ADMIN",
};

class AccessService {
  static singUp = async ({ userName, email, password }) => {
    const hodelUser = await User.findOne({ email }).lean();
    if (hodelUser) {
      throw new badRequestError("error user already rigisted");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      email,
      password: passwordHash,
      roles: [RolesUser.USER],
    });
    if (newUser) {
      const publicKey = crypto.randomBytes(64).toString(`hex`);
      const privateKey = crypto.randomBytes(64).toString(`hex`);
      const keyStore = await KeyTokenService.createKeyToken({
        userName: newUser.userName,
        userId: newUser._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      if (!keyStore) {
        throw new badRequestError("keyStore error");
      }
      const tokens = await createTokenPair(
        {
          userId: newUser._id,
          email,
          userName,
          avatar: newUser.avatar,
        },
        publicKey,
        privateKey
      );
      return {
        user: getInfoData({
          fill: ["_id", "userName", "email", "avatar"],
          object: newUser,
        }),
        tokens,
      };
    }
    return {
      data: null,
    };
  };
  static login = async ({ email, password }) => {
    const foundUser = await findByEmail({
      email,
    });
    console.log("foundUser", foundUser);
    if (!foundUser || foundUser.status !== "active") {
      throw new badRequestError("user not registered");
    }
    const { _id: userId, userName, avatar, roles } = foundUser;
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication Error");
    const publicKey = crypto.randomBytes(64).toString(`hex`);
    const privateKey = crypto.randomBytes(64).toString(`hex`);
    const tokens = await createTokenPair(
      {
        userId: userId,
        email: email,
        userName,
        avatar,
        role: roles,
      },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userName: foundUser.userName,
      privateKey,
      publicKey,
      userId: userId,
    });
    return {
      user: getInfoData({
        fill: ["_id", "userName", "email", "avatar"],
        object: foundUser,
      }),
      tokens,
    };
  };
  static Logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };
  static forgotPassword = async (payload) => {
    const foundUser = await User.findOne({ email: payload.email });
    if (!foundUser) throw new NotFoundError("User not found");
    const passwordHash = await bcrypt.hash(payload.password, 10);

    const updatePassword = await User.findByIdAndUpdate(
      foundUser._id,
      {
        password: passwordHash,
      },
      { new: true, select: "userName email _id avatar" }
    );
    return updatePassword;
  };
  static updateProfile = async (file, payload, user) => {
    const userData = User.findByIdAndUpdate(
      user.userId,
      {
        ...payload,
        avatar: file?.filename,
      },
      { new: true, select: "userName email _id avatar" }
    );
    return userData;
  };
}
module.exports = AccessService;
