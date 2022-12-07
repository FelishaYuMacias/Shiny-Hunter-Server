const { Schema, model } = require('mongoose');

const pokemonSchema = new Schema({
  species: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  form: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  }
});

const Pokemon = model('Pokemon', pokemonSchema);

module.exports = Pokemon;

