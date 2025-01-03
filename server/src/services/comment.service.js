"use strict";

const { NotFoundError } = require("../core/error.response");

const { Comment } = require("../models/comment.model");
const { Post } = require("../models/post.model");
const { paginate } = require("../utils/paginate");

class CommentService {
  static getCommentOffPost = async (postId) => {
    // Tìm bài viết theo ID
    const foundPost = await Post.findById(postId);
    if (!foundPost) {
      throw new NotFoundError({ message: "POST NOT FOUND" });
    }

    // Tìm danh sách các bình luận của bài viết
    const listComment = await Comment.find({ post: postId }).populate({
      path: "author", // Populate thông tin của tác giả
      select: "userName avatar", // Chỉ chọn các trường cần thiết
    });

    return listComment;
  };
  static deleteComment = async (commentId) => {
    if (!commentId) {
      throw new NotFoundError({ message: "COMMENT NOT FOUND" });
    }

    // Kiểm tra xem bình luận có tồn tại không
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError({ message: "COMMENT NOT FOUND" });
    }

    // Xóa bình luận khỏi bài đăng
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId }, // Xóa id bình luận khỏi danh sách bài đăng
    });

    // Nếu bình luận có con (nested comments), cần xóa các bình luận con
    await Comment.deleteMany({ parentComment: commentId });

    // Xóa chính bình luận
    await Comment.findByIdAndDelete(commentId);

    return { message: "Comment deleted successfully" };
  };
  static updateComment = async (commentId, content) => {
    if (!commentId) {
      throw new NotFoundError({ message: "COMMENT NOT FOUND" });
    }

    // Tìm bình luận theo ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError({ message: "COMMENT NOT FOUND" });
    }

    // Cập nhật nội dung bình luận
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId }, // Điều kiện tìm kiếm
      { content: content }, // Dữ liệu cần cập nhật
      { new: true } // Tùy chọn để trả về dữ liệu sau khi cập nhật
    );

    return {
      message: "Comment updated successfully",
      updatedComment: updatedComment,
    };
  };
  static getAllComment = async ({
    limit = 10,
    page = 1,
    options = { sort: { createdAt: -1 } },
    searchText = undefined,
    ...query
  }) => {
    return await paginate({
      model: Comment,
      limit,
      page,
      populate: [
        {
          path: "author",
          select: "userName avatar email",
        },
        {
          path: "post",
          select: "_id title content",
        },
      ],
      options,
      query,
      searchText,
      searchFields: ["content"],
      searchById: true,
    });
  };
}

module.exports = CommentService;
