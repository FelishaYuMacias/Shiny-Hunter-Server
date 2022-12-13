const { Hunt, Pokemon } = require('../models');
const express = require('express');
const router = express();


// Function to get all of the pokemons by invoking the find() method with no arguments.
// Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
router.get("/", (req, res) => {
  Pokemon.find()
    .then((pokemons) => res.json(pokemons))
    .catch((err) => res.status(500).json(err));
})
// Gets a single pokemon using the findOneAndUpdate method. We pass in the ID of the pokemon and then respond with it, or an error if not found
router.get("/:pokemonId", (req, res) => {
  Pokemon.findOne({ _id: req.params.pokemonId })
    .then((pokemon) =>
      !pokemon
        ? res.status(404).json({ message: 'No pokemon with that ID' })
        : res.json(pokemon)
    )
    .catch((err) => res.status(500).json(err));
})
// Creates a new pokemon. Accepts a request body with the entire pokemon object.
// Because pokemons are associated with Hunt, we then update the Hunt who created the app and add the ID of the pokemon to the pokemons array
router.post("/", (req, res) => {
  Pokemon.create(req.body)
    .then((pokemon) => {
      res.status(200).json({ pokemon: pokemon })
      Hunt.findOneAndUpdate(
        { _id: req.body.huntId },
        { $addToSet: { pokemons: pokemon._id } },
        { new: true }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})
// Updates and pokemon using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
router.put("/:pokemonId", (req, res) => {
  Pokemon.findOneAndUpdate(
    { _id: req.params.pokemonId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((pokemon) =>
      !pokemon
        ? res.status(404).json({ message: 'No pokemon with this id!' })
        : res.json(pokemon)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})
// Deletes an pokemon from the database. Looks for an app by ID.
// Then if the app exists, we look for any hunts associated with the app based on he app ID and update the pokemons array for the hunt.
router.delete("/:pokemonId", (req, res) => {
  Pokemon.findOneAndRemove({ _id: req.params.pokemonId })
    .then((pokemon) =>
      !pokemon
        ? res.status(404).json({ message: 'No pokemon with this id!' })
        : Hunt.findOneAndUpdate(
          { pokemons: req.params.pokemonId },
          { $pull: { pokemons: req.params.pokemonId } },
          { new: true }
        )
    )
    .then((hunt) =>
      !hunt
        ? res.status(404).json({
          message: 'Pokemon deleted but no hunt with this id!',
        })
        : res.json({ message: 'Pokemon successfully deleted!' })
    )
    .catch((err) => res.status(500).json(err));
})

module.exports = router  