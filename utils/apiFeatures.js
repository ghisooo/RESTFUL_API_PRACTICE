class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join('');
      this.query = this.query.sort(sortBy);
    } else {
      //if there is no sorting criteria, then default criterion is "createdAt" (-createdAt : descending order)
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //exclude(-) __v
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1; // default value is 1
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //page=2&limit=10, 1-10, page1, 11-20, page2, 21-30, page3 ,...
    this.query = this.query.skip(skip).limit(limit); // it means "11-20"

    return this;
  }
}

module.exports = APIFeatures;
