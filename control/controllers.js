const { User, Thought } = require("../models");

const thoughtController = {
  //get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one thoughts by id
  getSingleThought({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thoughts found !" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //update thoughts
  updateThought({ body,params }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, 
      {
      $set: body
      },
      {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thoughts found !" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //create new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.UserId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No user found!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //delete thoughts
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thoughts with this ID." });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Nope!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  }
};
const userController = {
    //get all users
    getUsers(req, res) {
      User.find({})
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
          console.log(err);
          res.sendStatus(400);
        });
    },
  
    //get a single user
    getSingleUser({ params }, res) {
      User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .then((dbUserData) => {
          if (!dbUserData) {
            res.status(404).json({ message: "No user found !" });
            return;
          }
          res.json(dbUserData);
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(400);
        });
    },
  
    //update users
    updateUser(req, res) {
      User.findOneAndUpdate({ _id: req.params.id },  
      {
      $set: req.body
      },
      {
        new: true,
        runValidators: true,
      })
        .then((dbUserData) => {
          if (!dbUserData) {
            res.status(404).json({ message: "No user found !" });
            return;
          }
          res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
  
    //create user
    createUsers({ body }, res) {
      User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    },
  
    //delete user
    deleteUser({ params }, res) {
      User.findOneAndDelete({ _id: params.id })
        .then((dbUserData) => {
          if (!dbUserData) {
            res.status(404).json({ message: "No user found!" });
            return;
          }
          res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
  
    //add friend
    addFriend({ params }, res) {
      User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
      )
        .then((dbUserData) => {
          if (!dbUserData) {
            res.status(404).json({ message: "No user found!" });
            return;
          }
          res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
  
    //delete friend
    deleteFriend({ params }, res) {
      User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      )
        .then((dbUserData) => {
          if (!dbUserData) {
            return res.status(404).json({ message: "No user with this id!" });
          }
          res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    }
  
  };

module.exports = thoughtController;
module.exports = userController;