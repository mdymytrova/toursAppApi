const QueryBuilder = require("./queryBuilder");

module.exports = class ReviewQueryBuilder extends QueryBuilder {
  constructor(request) {
    super(request);
  }

  filter() {
    const { filter = {} } = this.request;
    const filterMatchProps = this.getFilterRangeMatchers(filter, ["rating"]);

    if (Object.keys(filterMatchProps).length) {
      this.addMatchAggregation(filterMatchProps);
    }

    return this;
  }

  search() {
    const { search = "" } = this.request;
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      this.addMatchAggregation({
        $or: [{ review: searchRegex }],
      });
    }

    return this;
  }
};
