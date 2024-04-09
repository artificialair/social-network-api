const Thought = require("../models/Thought");
const User = require("../models/User");

// GET all thought
const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// GET a single thought by its _id and populated thought and friend data
const getOneThought = async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId }).select(
      "-__v"
    );

    if (!thought) {
      return res.status(404).json({ message: "This thought does not exist!" });
    }

    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// POST a new thought
const newThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Thought created, but no user exists with that id",
      });
    }

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT to update a thought by its _id
const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "This thought does not exist!" });
    }

    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// DELETE to remove a thought by its _id
const removeThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndRemove({
      _id: req.params.thoughtId,
    });

    if (!thought) {
      return res.status(404).json({ message: "This thought does not exist!" });
    }

    const user = await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );

    // Could return 404 if !user, felt it was unnecessary though.

    res.status(200).json({ message: "Thought successfully removed." });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// POST to create a reaction stored in a single thought's reactions array field
const addReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidatiors: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "This thought does not exist!" });
    }
    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// DELETE to pull and remove a reaction by the reaction's reactionId value
const removeReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidatiors: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "This thought does not exist!" });
    }

    res.json("Reaction successfully removed.");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getAllThoughts,
  getOneThought,
  newThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction
};
