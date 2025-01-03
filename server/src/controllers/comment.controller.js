"use strict";

const commentService = require("../services/comment.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class CommentController {
  getCommentOffPost = async (req, res, next) => {
    const { postId } = req.params;
    new SuccessResponse({
      data: await commentService.getCommentOffPost(postId),
    }).send(res);
  };
  getAllComment = async (req, res, next) => {
    new SuccessResponse({
      data: await commentService.getAllComment(req.query),
    }).send(res);
  };
  deleteComment = async (req, res, next) => {
    const { commnetId } = req.params;
    new SuccessResponse({
      data: await commentService.deleteComment(commnetId),
    }).send(res);
  };
  updateComment = async (req, res, next) => {
    const { commnetId } = req.params;
    const { content } = req.body;
    new SuccessResponse({
      data: await commentService.updateComment(commnetId, content),
    }).send(res);
  };
}
module.exports = new CommentController();
