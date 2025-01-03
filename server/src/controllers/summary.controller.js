const { SuccessResponse, CREATED } = require("../core/success.response");
const { SummaryService } = require("../services/summary.service");

class SummaryController {
  getTotalSumary = async (req, res, next) => {
    new SuccessResponse({
      data: await SummaryService.getTotalSumary(),
    }).send(res);
  };
  getUserSummary = async (req, res, next) => {
    const { type } = req.params;
    new SuccessResponse({
      data: await SummaryService.getUserSummary(type),
    }).send(res);
  };
  getPostSummary = async (req, res, next) => {
    const { type } = req.params;
    new SuccessResponse({
      data: await SummaryService.getPostSummary(type),
    }).send(res);
  };
  getCommentSummary = async (req, res, next) => {
    const { type } = req.params;
    new SuccessResponse({
      data: await SummaryService.getCommentSummary(type),
    }).send(res);
  };
  getReportSummary = async (req, res, next) => {
    const { type } = req.params;
    new SuccessResponse({
      data: await SummaryService.getReportSummary(type),
    }).send(res);
  };
}
module.exports = new SummaryController();
