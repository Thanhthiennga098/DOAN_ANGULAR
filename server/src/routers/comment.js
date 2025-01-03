"use strict";
const express = require("express");
const commentController = require("../controllers/comment.controller");
const { asynchandler } = require("../helpers/asynchandler");
const { authentication, adminAuthentication } = require("../auth/authUtils");

const router = express.Router();

router.get(
  "/comment/:postId",
  authentication,
  asynchandler(commentController.getCommentOffPost)
);
router.delete(
  "/comment/:commnetId",
  authentication,
  asynchandler(commentController.deleteComment)
);
router.put(
  "/comment/:commnetId",
  authentication,
  asynchandler(commentController.updateComment)
);
router.get(
  "/comment",
  adminAuthentication,
  asynchandler(commentController.getAllComment)
);
// admin

module.exports = router;
