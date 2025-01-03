"use strict";

const { NotFoundError } = require("../core/error.response");
const { Comment } = require("../models/comment.model");
const { Post } = require("../models/post.model");
const { Report } = require("../models/report.model");
const { paginate } = require("../utils/paginate");

class PostService {
  static createPost = async (req, user) => {
    const { title, content } = req.body;
    const images = req.files || []; // Đảm bảo `images` luôn là một mảng
    const imageFilenames = images.map((image) => image.filename); // Trích xuất chỉ `filename`
    const newPost = await Post.create({
      title,
      content,
      images: imageFilenames,
      author: user.userId,
    });
    return {
      post: newPost,
    };
  };
  static updatePost = async (req, user) => {
    const { postId } = req.params;
    const { noUpdateImage } = req.body;
    const foundPost = await Post.find({ _id: postId, author: user.userId });
    if (!foundPost) throw new NotFoundError("Post not found");
    const images = req.files || []; // Đảm bảo `images` luôn là một mảng
    const imageFilenames = images.map((image) => image.filename); // Trích xuất chỉ `filename`
    let updatedPost;
    if (noUpdateImage === "1") {
      updatedPost = await Post.findByIdAndUpdate(
        { _id: postId },
        { ...req.body },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        { _id: postId },
        { ...req.body, images: imageFilenames },
        { new: true }
      );
    }
    return {
      post: updatedPost,
    };
  };
  static lockPost = async (req, user) => {
    const { postId } = req.params;
    const foundPost = await Post.findOne({ _id: postId });
    if (!foundPost) throw new NotFoundError("Post not found");
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      {
        status: foundPost.status === "active" ? "inActive" : "active",
      },
      { new: true }
    );
    return {
      post: updatedPost,
    };
  };
  static deletePost = async (req) => {
    const { postId } = req.params;
    const foundPost = await Post.findOne({
      _id: postId,
      author: req.user.userId,
    });
    if (!foundPost) {
      throw new NotFoundError("Post not found");
    }
    const deletePost = await Post.findByIdAndDelete(
      { _id: postId },
      { new: true }
    );
    return {
      post: deletePost,
    };
  };
  static adminDeletePost = async (req) => {
    const { postId } = req.params;
    const foundPost = await Post.findOne({
      _id: postId,
    });
    if (!foundPost) {
      throw new NotFoundError("Post not found");
    }
    const deletePost = await Post.findByIdAndDelete(
      { _id: postId },
      { new: true }
    );
    return {
      post: deletePost,
    };
  };
  static userLikePost = async (user, postId) => {
    // Tìm bài viết theo ID
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Kiểm tra xem người dùng đã thích bài viết chưa
    const isLiked = post.likes.some(
      (id) => id.toString() === user.userId.toString()
    );

    if (isLiked) {
      // Nếu đã thích, bỏ thích (sử dụng $pull để xóa user từ mảng likes)
      await Post.updateOne({ _id: postId }, { $pull: { likes: user.userId } });
    } else {
      // Nếu chưa thích, thêm user vào mảng likes (sử dụng $push để thêm user)
      await Post.updateOne({ _id: postId }, { $push: { likes: user.userId } });
    }

    // Tìm lại bài viết đã được cập nhật để trả về
    const updatedPost = await Post.findById(postId);

    return {
      post: updatedPost,
    };
  };
  static userCommentPost = async (user, postId, data) => {
    // Tìm bài viết theo ID
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Tạo một bình luận mới
    const newComment = new Comment({
      content: data.content,
      author: user.userId,
      post: postId,
      parent: data.parent || null, // Nếu có bình luận trả lời
    });

    // Lưu bình luận mới vào cơ sở dữ liệu
    await newComment.save();

    // Sử dụng $push để thêm bình luận vào mảng comments của bài viết
    await Post.updateOne(
      { _id: postId },
      { $push: { comments: newComment._id } }
    );

    // Tìm lại bài viết đã được cập nhật và populate các bình luận
    const updatedPost = await Post.findById(postId).populate("comments");

    return {
      post: updatedPost,
    };
  };

  static getAllPost = async (
    { currentPage = 1, limit = 10, searchText = "" },
    user
  ) => {
    const skip = (+currentPage - 1) * limit;

    // Lấy danh sách bài viết và tác giả, thêm điều kiện lọc nếu có searchText
    const query = {
      status: "active",
      ...(searchText
        ? {
            $or: [
              { title: { $regex: searchText, $options: "i" } }, // Lọc theo title
              { content: { $regex: searchText, $options: "i" } }, // Lọc theo content
            ],
          }
        : {}),
    };
    const listPost = await Post.find(query)
      .populate("author", "userName email avatar") // Populate thông tin tác giả
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query); // Lọc countDocuments theo searchText nếu có

    // Thêm thông tin `liked` và `totalComment` cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      listPost.map(async (post) => {
        // Kiểm tra trạng thái liked
        const isLiked = post.likes.some(
          (like) => like.toString() === user.userId.toString()
        );

        // Đếm tổng số bình luận của bài viết
        const totalComment = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          liked: isLiked, // Trạng thái like
          totalComment, // Tổng số bình luận
        };
      })
    );

    return {
      totalItems: totalPosts,
      currentPage: +currentPage,
      totalPages: Math.ceil(totalPosts / limit),
      posts: postsWithAdditionalInfo,
    };
  };
  static getAllPOstByAdmin = async (
    { currentPage = 1, limit = 10, searchText = "" },
    user
  ) => {
    const skip = (+currentPage - 1) * limit;
    const query = searchText
      ? {
          $or: [
            { title: { $regex: searchText, $options: "i" } },
            { content: { $regex: searchText, $options: "i" } },
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$_id" }, // Chuyển _id sang chuỗi
                  regex: searchText, // Biểu thức regex
                  options: "i", // Tùy chọn không phân biệt hoa thường
                },
              },
            },
          ],
        }
      : {};
    const listPost = await Post.find(query)
      .populate("author", "userName email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalPosts = await Post.countDocuments(query);
    const postsWithAdditionalInfo = await Promise.all(
      listPost.map(async (post) => {
        const isLiked = post.likes.some(
          (like) => like.toString() === user.userId.toString()
        );
        const totalComment = await Comment.countDocuments({ post: post._id });
        const totalReport = await Report.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          liked: isLiked,
          totalComment,
          totalReport,
        };
      })
    );

    return {
      totalItems: totalPosts,
      currentPage: +currentPage,
      totalPages: Math.ceil(totalPosts / limit),
      posts: postsWithAdditionalInfo,
    };
  };
  static getUserPost = async ({ currentPage = 1, limit = 10 }, user) => {
    const skip = (+currentPage - 1) * limit;

    // Lấy danh sách bài viết và tác giả
    const listPost = await Post.find({ author: user.userId })
      .populate("author", "userName email avatar") // Populate thông tin tác giả
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    // Thêm thông tin `liked` và `totalComment` cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      listPost.map(async (post) => {
        // Kiểm tra trạng thái liked
        const isLiked = post.likes.some(
          (like) => like.toString() === user.userId.toString()
        );

        // Đếm tổng số bình luận của bài viết
        const totalComment = await Comment.countDocuments({ post: post._id });

        return {
          ...post.toObject(),
          liked: isLiked, // Trạng thái like
          totalComment, // Tổng số bình luận
        };
      })
    );

    return {
      totalItems: totalPosts,
      currentPage: +currentPage,
      totalPages: Math.ceil(totalPosts / limit),
      posts: postsWithAdditionalInfo,
    };
  };
}
module.exports = PostService;
