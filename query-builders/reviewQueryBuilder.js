const QueryBuilder = require("./queryBuilder");

module.exports = class ReviewQueryBuilder extends QueryBuilder {
  constructor(query, request) {
    super(query, request);
  }

  filter() {
    const { filter = {} } = this.request;
    const { rating } = filter;

    const ratingQuery = this.getRange(rating, "rating");

    if (ratingQuery.length) {
      this.query = this.query.find({
        $and: ratingQuery,
      });
    }

    return this;
  }

  search() {
    const { search = "" } = this.request;
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      this.query = this.query.find({
        $or: [{ review: searchRegex }],
      });
    }

    return this;
  }
};
