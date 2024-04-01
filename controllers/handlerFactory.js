const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find();

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.getFilteredAll = (Model, QueryBuilder) =>
  catchAsync(async (req, res, next) => {
    const query = Model.find();
    const documentsCount = await Model.countDocuments();

    const queryBuilder = new QueryBuilder(query, req.body)
      .filter()
      .search()
      .select()
      .sort()
      .limit();

    const docs = await queryBuilder.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      count: documentsCount,
      data: {
        data: docs,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;

    if (!doc) {
      next(new AppError(`No document found with ID ${req.params.id}`, 404));
      return;
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      next(new AppError(`No document found with ID ${req.params.id}`, 404));
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      next(new AppError(`No document found with ID ${req.params.id}`, 404));
      return;
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
