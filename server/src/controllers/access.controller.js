"use strict";

const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      data: await AccessService.login(req.body),
    }).send(res);
  };
  singUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK!",
      data: await AccessService.singUp(req.body),
    }).send(res);
  };

  forgotPassword = async (req, res, next) => {
    new SuccessResponse({
      data: await AccessService.forgotPassword(req.body),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "logout successfully",
      data: await AccessService.Logout({ keyStore: req.keyStore }),
    }).send(res);
  };
  updateProfile = async (req, res, next) => {
    new SuccessResponse({
      data: await AccessService.updateProfile(req.file, req.body, req.user),
    }).send(res);
  };
}
module.exports = new AccessController();
