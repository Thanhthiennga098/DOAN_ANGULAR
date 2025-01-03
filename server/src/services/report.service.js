"use strict";

const { NotFoundError } = require("../core/error.response");
const { Report } = require("../models/report.model");
const { paginate } = require("../utils/paginate");

class ReportService {
  static getAllReport = async ({
    limit = 10,
    page = 1,
    options = {},
    searchText = "",
    ...query
  }) => {
    return await paginate({
      model: Report,
      limit,
      page,
      options,
      query,
      searchText: searchText,
      searchFields: ["reson"],
      populate: [
        {
          path: "author",
          select: "userName avatar email",
        },
        {
          path: "post",
          select: "_id title content",
        },
        {
          path: "comment",
          select: "_id content",
        },
      ],
    });
  };
  static CreateNewReport = async (payload, user) => {
    if (!payload.reson || !payload.post) throw new NotFoundError("Not found");
    return await Report.create({
      author: user.userId,
      ...payload,
    });
  };
  static deleteReport = async (id) => {
    if (!id) throw new NotFoundError("Not found");
    return await Report.findOneAndDelete({ _id: id });
  };
}
module.exports = { ReportService };
