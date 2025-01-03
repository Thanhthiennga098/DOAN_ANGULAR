"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { adminAuthentication } = require("../auth/authUtils");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get(
  "/user",
  adminAuthentication,
  asynchandler(userController.getAllUser)
);
router.post(
  "/user",
  adminAuthentication,
  asynchandler(userController.createNewUser)
);
router.put(
  "/user/:id",
  adminAuthentication,
  asynchandler(userController.updateUser)
);
router.put(
  "/user/lock/:id",
  adminAuthentication,
  asynchandler(userController.lockUser)
);
module.exports = router;
