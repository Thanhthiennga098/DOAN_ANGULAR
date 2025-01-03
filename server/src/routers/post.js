"use strict";
const express = require("express");
const postController = require("../controllers/post.controller");
const { asynchandler } = require("../helpers/asynchandler");
const { authentication, adminAuthentication } = require("../auth/authUtils");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const router = express.Router();

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình multer để lưu tệp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Sử dụng đường dẫn tuyệt đối
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file được lưu
  },
});

const upload = multer({ storage: storage });

// Cấu hình Express để phục vụ tệp tĩnh trong thư mục uploads
router.use("/uploads", express.static(uploadsDir));

// Định tuyến API để tải tệp
router.post(
  "/post",
  authentication,
  upload.array("images", 10),
  asynchandler(postController.createPost)
);

// Định tuyến để lấy tất cả bài đăng
router.get("/post", authentication, asynchandler(postController.getAllPOst));
router.get(
  "/user-post",
  authentication,
  asynchandler(postController.getUserPost)
);
router.post(
  "/post/:postId",
  authentication,
  upload.array("images", 10),
  asynchandler(postController.updatePost)
);

router.put(
  "/post-lock/:postId",
  authentication,
  asynchandler(postController.lockPost)
);

router.put(
  "/user-like-post/:postId",
  authentication,
  asynchandler(postController.userLikePost)
);
router.put(
  "/user-comment-post/:postId",
  authentication,
  asynchandler(postController.userCommentPost)
);
router.delete(
  "/post/:postId",
  authentication,
  asynchandler(postController.deletePost)
);
router.get(
  "/admin-post",
  adminAuthentication,
  asynchandler(postController.getAllPOstByAdmin)
);
router.delete(
  "/admin-post/:postId",
  adminAuthentication,
  asynchandler(postController.adminDeletePost)
);
module.exports = router;
