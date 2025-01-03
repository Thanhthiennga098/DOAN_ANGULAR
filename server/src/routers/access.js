"use strict";
const express = require("express");
const accessController = require("../controllers/access.controller");
const { asynchandler } = require("../helpers/asynchandler");
const { authentication } = require("../auth/authUtils");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, "../uploads/avatar");
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
router.use("/uploads/avatar", express.static(uploadsDir));

// signUp
router.post("/user/register", asynchandler(accessController.singUp));

//signIn
router.post("/user/login", asynchandler(accessController.login));

router.post(
  "/user/forgot-password",
  asynchandler(accessController.forgotPassword)
);

router.post(
  "/user/profile",
  authentication,
  upload.single("avatar", 10),
  asynchandler(accessController.updateProfile)
);

// authentication
router.post(
  "/user/logout",
  authentication,
  asynchandler(accessController.logout)
);

module.exports = router;
