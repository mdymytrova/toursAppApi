const QueryBuilder = require("./queryBuilder");

module.exports = class TourQueryBuilder extends QueryBuilder {
  constructor(query, request) {
    super(query, request);
  }

  filter() {
    const { filter = {} } = this.request;
    const { duration, level, price, rating } = filter;
    const durationQuery = this.getRange(duration, "duration");
    const priceQuery = this.getRange(price, "price");
    const ratingQuery = this.getRange(rating, "ratingAvg");

    if (durationQuery.length) {
      this.query = this.query.find({
        $and: durationQuery,
      });
    }

    if (priceQuery.length) {
      this.query = this.query.find({
        $and: priceQuery,
      });
    }

    if (ratingQuery.length) {
      this.query = this.query.find({
        $and: ratingQuery,
      });
    }

    if (level) {
      this.query = this.query.where("level").equals(level);
    }

    return this;
  }

  search() {
    const { search = "" } = this.request;
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      this.query = this.query.find({
        $or: [
          { name: searchRegex },
          { summary: searchRegex },
          { description: searchRegex },
        ],
      });
    }

    return this;
  }
};
