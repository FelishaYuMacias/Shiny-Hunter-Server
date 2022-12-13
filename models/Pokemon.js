const { Schema, model } = require('mongoose');

const pokemonSchema = new Schema({
  species: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    min: 1,
    max: 100
  },
  form: {
    type: String
  },
  gender: {
    type: String
  }
});

const Pokemon = model('Pokemon', pokemonSchema);

module.exports = Pokemon;

