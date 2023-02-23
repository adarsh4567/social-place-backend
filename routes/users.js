const express = require('express')
const {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getAllUser
} = require('../controllers/users')
const verifyToken = require('../middlewares/auth')

const router = express.Router();

router.get("/getall",getAllUser);
router.get("/:id",verifyToken,getUser)
router.get("/:id/friends",verifyToken,getUserFriends)

router.patch("/:id/:friendId",verifyToken,addRemoveFriend)

module.exports = router