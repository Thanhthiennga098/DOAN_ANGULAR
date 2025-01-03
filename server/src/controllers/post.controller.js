"use strict";

const PostService = require("../services/post.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class PostController {
  createPost = async (req, res, next) => {
    new CREATED({
      data: await PostService.createPost(req, req.user),
    }).send(res);
  };
  getAllPOst = async (req, res, next) => {
    new SuccessResponse({
      message: "Get ALl Post!",
      data: await PostService.getAllPost(req.query, req.user),
    }).send(res);
  };
  getAllPOstByAdmin = async (req, res, next) => {
    new SuccessResponse({
      message: "Get ALl Post!",
      data: await PostService.getAllPOstByAdmin(req.query, req.user),
    }).send(res);
  };
  getUserPost = async (req, res, next) => {
    new SuccessResponse({
      message: "Get User Post!",
      data: await PostService.getUserPost(req.query, req.user),
    }).send(res);
  };
  updatePost = async (req, res, next) => {
    console.log("req asdasd", req.body);
    new SuccessResponse({
      message: "update Post!",
      data: await PostService.updatePost(req, req.user),
    }).send(res);
  };
  lockPost = async (req, res, next) => {
    new SuccessResponse({
      message: "update status Post!",
      data: await PostService.lockPost(req, req.user),
    }).send(res);
  };
  deletePost = async (req, res, next) => {
    new SuccessResponse({
      message: "delete Post!",
      data: await PostService.deletePost(req),
    }).send(res);
  };
  adminDeletePost = async (req, res, next) => {
    new SuccessResponse({
      message: "delete Post!",
      data: await PostService.adminDeletePost(req),
    }).send(res);
  };
  userLikePost = async (req, res, next) => {
    const { postId } = req.params;
    new SuccessResponse({
      message: "update like Post!",
      data: await PostService.userLikePost(req.user, postId),
    }).send(res);
  };
  userCommentPost = async (req, res, next) => {
    const { postId } = req.params;
    new SuccessResponse({
      message: "update like Post!",
      data: await PostService.userCommentPost(req.user, postId, req.body),
    }).send(res);
  };
}
module.exports = new PostController();
