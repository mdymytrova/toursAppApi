module.exports = class TourQueryBuilder {
  defaultSort = {
    sortBy: "name",
    order: 1,
  };

  defaultPaging = {
    pageSize: 10,
    pageNumber: 1,
  };

  constructor(query, request) {
    this.query = query;
    this.request = request || {};
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

  select() {
    this.query = this.query.select("-__v");
    return this;
  }

  sort() {
    const { sort = this.defaultSort } = this.request;
    this.query = this.query.sort({ [sort.sortBy]: sort.order });
    return this;
  }

  limit() {
    const { paging = this.defaultPaging } = this.request;
    this.query = this.query
      .skip(paging.pageSize * (paging.pageNumber - 1))
      .limit(paging.pageSize);
    return this;
  }

  getRange = (rangeObj = {}, prop) => {
    const rangeQuery = [];

    if (rangeObj.min) {
      rangeQuery.push({ [prop]: { $gte: rangeObj.min } });
    }

    if (rangeObj.max) {
      rangeQuery.push({ [prop]: { $lte: rangeObj.max } });
    }

    return rangeQuery;
  };
};
