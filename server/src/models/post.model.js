const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxLength: 200,
    },
    content: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    CategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inActive"],
      default: "active",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  Post: model(DOCUMENT_NAME, postSchema),
};
