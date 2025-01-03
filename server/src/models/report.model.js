const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Report";
const COLLECTION_NAME = "Reports";
const reportSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reson: {
      type: String,
      require: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      require: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  Report: model(DOCUMENT_NAME, reportSchema),
};
