const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
const commentSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  Comment: model(DOCUMENT_NAME, commentSchema),
};
