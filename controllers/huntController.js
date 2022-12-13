const { Hunt, User, Pokemon } = require('../models');
const express = require('express');
const router = express();


// Function to get all of the hunts by invoking the find() method with no arguments.
// Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
router.get("/", (req, res) => {
  Hunt.find({})
    .populate('pokemon')
    .then((hunts) => res.json(hunts))
    .catch((err) => res.status(500).json(err));
})
// Gets a single hunt using the findOneAndUpdate method. We pass in the ID of the hunt and then respond with it, or an error if not found
router.get("/:huntId", (req, res) => {
  Hunt.findOne({ _id: req.params.huntId })
    .then((hunt) =>
      !hunt
        ? res.status(404).json({ message: 'No hunt with that ID' })
        : res.json(hunt)
    )
    .catch((err) => res.status(500).json(err));
})
// Creates a new hunt. Accepts a request body with the entire hunt object.
// Because hunts are associated with Users, we then update the User who created the app and add the ID of the hunt to the hunts array
router.post("/", (req, res) => {
  Hunt.create(req.body)
    .then((hunt) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { hunts: hunt._id } },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res.status(200).json({
          message: 'Hunt created, but found no user with that ID',
        })
        : res.json('Created the hunt 🎉')
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})
// Updates and hunt using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
router.put("/:huntId", (req, res) => {
  Hunt.findOneAndUpdate(
    { _id: req.params.huntId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((hunt) =>
      !hunt
        ? res.status(404).json({ message: 'No hunt with this id!' })
        : res.json(hunt)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})
// Deletes an hunt from the database. Looks for an app by ID.
// Then if the app exists, we look for any users associated with the app based on he app ID and update the hunts array for the User.
router.delete("/:huntId", (req, res) => {
  Hunt.findOneAndRemove({ _id: req.params.huntId })
    .then((hunt) =>
      !hunt
        ? res.status(404).json({ message: 'No hunt with this id!' })
        : User.findOneAndUpdate(
          { hunts: req.params.huntId },
          { $pull: { hunts: req.params.huntId } },
          { new: true }
        )
    )
    .then((user) =>
      !user
        ? res.status(404).json({
          message: 'Hunt deleted but no user with this id!',
        })
        : res.json({ message: 'Hunt successfully deleted!' })
    )
    .catch((err) => res.status(500).json(err));
})
module.exports = router  