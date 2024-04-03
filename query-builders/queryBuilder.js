module.exports = class QueryBuilder {
  defaultSort = {
    sortBy: "name",
    order: 1,
  };

  defaultPaging = {
    pageSize: 10,
    pageNumber: 1,
  };

  matchAggregations = [];
  sortAggregation = {};
  pagingAggregation = {};
  aggregations = [];

  constructor(request) {
    this.request = request || {};
  }

  filter() {
    return this;
  }

  search() {
    return this;
  }

  sort() {
    const { sort = this.defaultSort } = this.request;
    this.sortAggregation = { [sort.sortBy]: sort.order };
    return this;
  }

  limit() {
    const { paging = this.defaultPaging } = this.request;
    this.pagingAggregation = {
      skip: paging.pageSize * (paging.pageNumber - 1),
      limit: paging.pageSize,
    };
    return this;
  }

  build() {
    let aggregations = [];
    if (this.matchAggregations.length) {
      aggregations.push({
        $match: {
          $and: this.matchAggregations,
        },
      });
    }

    if (Object.keys(this.sortAggregation).length) {
      aggregations.push({
        $sort: this.sortAggregation,
      });
    }

    if (Object.keys(this.pagingAggregation).length) {
      aggregations.push({
        $skip: this.pagingAggregation.skip,
      });

      aggregations.push({
        $limit: this.pagingAggregation.limit,
      });
    }

    return aggregations;
  }

  addMatchAggregation(propObject) {
    this.matchAggregations.push(propObject);
  }

  getFilterRangeMatchers = (filter, props = []) => {
    const matcherObj = {};

    props.forEach((prop) => {
      if (filter[prop]) {
        matcherObj[prop] = {};

        if (filter[prop].min) {
          matcherObj[prop].min = { $gte: filter[prop].min };
        }

        if (filter[prop].max) {
          matcherObj[prop].max = { $gte: filter[prop].max };
        }
      }
    });

    return matcherObj;
  };
};
