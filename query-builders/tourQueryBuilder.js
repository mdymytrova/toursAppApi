const QueryBuilder = require("./queryBuilder");

module.exports = class TourQueryBuilder extends QueryBuilder {
  constructor(request) {
    super(request);
  }

  filter() {
    const { filter = {} } = this.request;
    const filterMatchProps = {
      ...this.getFilterRangeMatchers(filter, [
        "duration",
        "price",
        "ratingAvg",
      ]),
    };

    if (filter.level) {
      filterMatchProps.level = filter.level;
    }

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
        $or: [
          { name: searchRegex },
          { summary: searchRegex },
          { description: searchRegex },
        ],
      });
    }

    return this;
  }

  build() {
    const aggregations = super.build();

    aggregations.push({
      $addFields: {
        startDate: {
          $min: "$startDates",
        },
        startLocation: "$startLocation.description",
        stops: {
          $size: "$locations",
        },
        id: "$_id",
      },
    });

    aggregations.push({
      $project: {
        _id: 0,
        __v: 0,
        description: 0,
        images: 0,
        locations: 0,
        guides: 0,
        createdAt: 0,
        startDates: 0,
      },
    });

    return aggregations;
  }
};
