/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, ' A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, ' A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // e.g. 4.66666 => 4.7
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to the current doc on NEW documents creation
          return val < this.price; // price discount value should be lower than the current price (this.price)
        },
        message: 'Discount price ({VALUE}) should be below a regular price', //{VALUE} will access the input value!
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, ' A tour must have a cover image'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now() },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //number array - it will be like [0]:lattitude, [1]:longitude
      address: String,
      descrption: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 }); //1 : ascending order
tourSchema.index({ price: 1, ratingsAverage: -1 }); //1 : ascending order
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//Virtual populate
// When you `populate()` the `reviews` virtual, Mongoose will find the
// first document in the Review model whose `tour` matches this document's
// `_id` property.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

//Document MIDDLEWARE: runs before only both .save() and .create(),, Not .insertMany() or update!
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // this object is 4ing a current document
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('will save document ...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  //regular expression - /^xxx/ : start with xxx
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } }); //this object is pointing a current query
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt', // -"field name" : not showing "field"
  });

  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} millisecs`);
  next();
});

// //AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline()); //this obj is pointing a current aggregation object

//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
