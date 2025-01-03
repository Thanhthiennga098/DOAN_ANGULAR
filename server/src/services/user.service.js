"use strict";

const { NotFoundError, badRequestError } = require("../core/error.response");
const { User } = require("../models/user.model");
const { paginate } = require("../utils/paginate");
const bcrypt = require("bcrypt");

const findByEmail = async ({
  email,
  seclect = {
    name: 1,
    email: 1,
    password: 1,
    status: 1,
    roles: 1,
    userName: 1,
    avatar: 1,
  },
}) => {
  return await User.findOne({ email: email }).select(seclect).lean();
};
class UserService {
  static getALlUser = async ({
    limit = 10,
    page = 1,
    options = { sort: { createdAt: -1 } },
    searchText = undefined,
    ...query
  }) => {
    return await paginate({
      model: User,
      limit,
      page,
      projection: {
        _id: 1,
        userName: 1,
        email: 1,
        avatar: 1,
        roles: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
      },
      options,
      query,
      searchText,
      searchFields: ["email", "userName"],
    });
  };
  static createNewUser = async (payload) => {
    if (!payload.email || !payload.userName || !payload.password)
      throw new NotFoundError("Missing data");
    const foundUser = await User.findOne({ email: payload.email });
    if (foundUser?.email) throw new badRequestError("User exit");
    const passwordHash = await bcrypt.hash(payload.password, 10);
    return await User.create({
      email: payload.email,
      userName: payload.userName,
      password: passwordHash,
      roles: payload.roles || ["USER"],
    });
  };
  static updateUser = async (payload, id) => {
    if (!payload.email || !payload.userName)
      throw new NotFoundError("Missing data");
    const foundUser = await User.findOne({ email: payload.email });
    if (!foundUser) throw new NotFoundError("User not found");
    return await User.findOneAndUpdate(
      { _id: id },
      {
        ...payload,
      }
    );
  };
  static lockUser = async (id) => {
    const foundUser = await User.findOne({ _id: id });
    if (!foundUser) throw new NotFoundError("User not found");
    return await User.findOneAndUpdate(
      { _id: id },
      {
        status: foundUser.status === "active" ? "inActive" : "active",
      }
    );
  };
}
module.exports = { findByEmail, UserService };
