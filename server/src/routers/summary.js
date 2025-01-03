"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { adminAuthentication, authentication } = require("../auth/authUtils");
const summaryController = require("../controllers/summary.controller");

const router = express.Router();

router.get(
  "/summary/total",
  adminAuthentication,
  asynchandler(summaryController.getTotalSumary)
);
router.get(
  "/summary/user/:type",
  adminAuthentication,
  asynchandler(summaryController.getUserSummary)
);
router.get(
  "/summary/post/:type",
  adminAuthentication,
  asynchandler(summaryController.getPostSummary)
);
router.get(
  "/summary/report/:type",
  adminAuthentication,
  asynchandler(summaryController.getReportSummary)
);
router.get(
  "/summary/comment/:type",
  adminAuthentication,
  asynchandler(summaryController.getCommentSummary)
);
module.exports = router;
