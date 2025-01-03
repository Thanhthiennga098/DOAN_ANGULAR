"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { adminAuthentication, authentication } = require("../auth/authUtils");
const reportController = require("../controllers/report.controller");

const router = express.Router();

router.get(
  "/report",
  adminAuthentication,
  asynchandler(reportController.getAllReport)
);
router.post(
  "/report",
  authentication,
  asynchandler(reportController.CreateNewReport)
);
router.delete(
  "/report/:id",
  authentication,
  asynchandler(reportController.deleteReport)
);
module.exports = router;
