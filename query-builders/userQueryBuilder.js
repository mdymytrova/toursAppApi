const QueryBuilder = require("./queryBuilder");

module.exports = class UserQueryBuilder extends QueryBuilder {
  constructor(query, request) {
    super(query, request);
  }

  filter() {
    const { filter = {} } = this.request;
    const { roles } = filter;

    if (roles?.length) {
      this.query = this.query.find({
        role: {
          $in: roles,
        },
      });
    }

    return this;
  }

  search() {
    const { search = "" } = this.request;
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      this.query = this.query.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { username: searchRegex },
        ],
      });
    }

    return this;
  }
};
