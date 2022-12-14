const router = require("express").Router();
const {getThoughts, getSingleThought, createThought, deleteThought, updateThought} = require('../control/controllers');
const {createReaction, deleteReaction} = require('../control/controllers');
const {getUsers, getSingleUser, createUsers, deleteUser, updateUser} = require('../control/controllers');
const {addFriend, deleteFriend} = require('../control/controllers');


// Modularize later? Folders causing issues with API connection

//thought routes
router.route('/').get(getThoughts).post(createThought)
router.route('/:id').get(getSingleThought).put(updateThought).delete(deleteThought);

//reaction routes
router.route("/api/thoughts/:thoughtId/reactions").post(createReaction).delete(deleteReaction);

router.use("/users",userRoutes);
router.use("/thoughts", thoughtRoutes);

//user routes
router.route("/").get(getUsers).post(createUsers)
router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser)//do the same for add and remove friend

//friend routes
router.route('/:UserId/friends/:friendId').post(addFriend).delete(deleteFriend)

module.exports = router;