const paginate = async ({
  model,
  query = {},
  limit = 10,
  page = 1,
  projection = null,
  options = {},
  populate = null,
  searchText = "",
  searchFields = [],
  searchById = false,
}) => {
  const skip = (page - 1) * limit;
  if (searchText && searchFields.length > 0) {
    const searchRegex = new RegExp(searchText, "i");
    const searchConditions = searchFields.map((field) => ({
      [field]: { $regex: searchRegex },
    }));
    if (searchById) {
      searchConditions.push({
        $expr: {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: searchText,
            options: "i",
          },
        },
      });
    }
    query = {
      $and: [{ ...query }, { $or: searchConditions }],
    };
  }
  const queryChain = model
    .find(query, projection, options)
    .skip(skip)
    .limit(limit)
    .lean();

  if (populate) {
    queryChain.populate(populate);
  }

  const [data, total] = await Promise.all([
    queryChain,
    model.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      limit: +limit,
      page: +page,
      totalPages,
    },
  };
};

module.exports = { paginate };