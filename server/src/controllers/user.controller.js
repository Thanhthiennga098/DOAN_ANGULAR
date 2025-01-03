const { SuccessResponse, CREATED } = require("../core/success.response");
const { UserService } = require("../services/user.service");

class UserController {
  getAllUser = async (req, res, next) => {
    new SuccessResponse({
      data: await UserService.getALlUser(req.query),
    }).send(res);
  };
  createNewUser = async (req, res, next) => {
    new CREATED({
      data: await UserService.createNewUser(req.body),
    }).send(res);
  };
  updateUser = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await UserService.updateUser(req.body, id),
    }).send(res);
  };
  lockUser = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await UserService.lockUser(id),
    }).send(res);
  };
}
module.exports = new UserController();
