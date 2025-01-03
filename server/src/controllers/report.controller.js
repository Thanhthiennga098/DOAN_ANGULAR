const { SuccessResponse, CREATED } = require("../core/success.response");
const { ReportService } = require("../services/report.service");

class ReportController {
  getAllReport = async (req, res, next) => {
    new SuccessResponse({
      data: await ReportService.getAllReport(req.query),
    }).send(res);
  };
  CreateNewReport = async (req, res, next) => {
    new CREATED({
      data: await ReportService.CreateNewReport(req.body, req.user),
    }).send(res);
  };
  deleteReport = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await ReportService.deleteReport(id),
    }).send(res);
  };
}
module.exports = new ReportController();
