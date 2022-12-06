const { Schema, model } = require('mongoose');
// const dateFormat = require('../utils/dateFormat');

const huntSchema = new Schema({
  method: {
    type: String,
    required: 'You need to pick a method!',
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  counter: {
    type: Number,
    required: true,
    default: 0,
  },
  dateStarted: {
    type: Date,
    default: Date.now,
    // get: (timestamp) => dateFormat(timestamp),
  },
  dateCompleted: {
    type: Date,
    // get: (timestamp) => dateFormat(timestamp),
  },
  phase: {
    type: String,
    required: 'You need to pick a phase!',
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  game: {
    type: String,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  pokemon: {
      type: Schema.Types.ObjectId,
      ref: 'Pokemon',
    }
});

const Hunt = model('Hunt', huntSchema);

module.exports = Hunt;
