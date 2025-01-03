"use strict";
//
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    avatar: { type: String },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inActive"],
      default: "active",
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  User: model(DOCUMENT_NAME, userSchema),
};
