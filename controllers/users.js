const User = require("../models/User");


const getUser = async(req,res)=>{
   try {
    const {id} = req.params
    const user = await User.findById(id);
    res.status(200).json(user)
   } catch (error) {
     res.status(404).json({error})
   }
}

const getUserFriends = async(req,res)=>{
    try {
        const {id} = req.body;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map((id)=> User.findById(id))
    )

    const formattedFriendsData = friends.map(({_id,firstName,lastName,occupation,location,picturePath}) =>{
        return {_id,firstName,lastName,occupation,location,picturePath}
    })

    res.status(200).json(formattedFriendsData);
    } catch (error) {
        res.status(401).json({error})
    }
}

const addRemoveFriend = async(req,res)=>{
   try {
    const {id,friendId} = req.body;
    const user = await User.findById(id);
    const user_friend = await User.findById(friendId)

    if(user.friends.includes(friendId)){
        user.friends = user.friends.filter((uId)=> uId!==friendId);
        user_friend.friends = user_friend.friends.filter((fId)=> fId!==id)
    }else{
        user.friends.push(friendId)
        user_friend.push(id)
    }
    await user.save();
    await user_friend.save()

    const friends = await Promise.all(
        user.friends.map((id)=> User.findById(id))
    )

    const formattedFriendsData = friends.map(({_id,firstName,lastName,occupation,location,picturePath}) =>{
        return {_id,firstName,lastName,occupation,location,picturePath}
    })

    res.status(200).json(formattedFriendsData)
   } catch (error) {
    res.status(401).json(error)
   }

}

module.exports = {getUser,getUserFriends,addRemoveFriend}