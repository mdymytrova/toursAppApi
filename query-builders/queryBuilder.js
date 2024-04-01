module.exports = class QueryBuilder {
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
    return this;
  }

  search() {
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
