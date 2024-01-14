const router = require('express').Router();
const User = require('../models/User');
// get a user
// get the user's followed by a particular user
// follow a user
// un-follow a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
  
    try {
      const user = userId 
        ? await User.findById(userId) 
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get list of followings
  router.get('/followers/:userId', async (req,res)=>{
    try{
       const user = await User.findById(req.params.userId);
       const followingUsers = await Promise.all(
        user.followings.map( (following) =>{
          return user.findById(following);
        })
       );
       let followingsList = [];
       followingUsers.map((following)=>{
        const {_id,username,profilePicture} = following;
        followingsList.push({_id,username,profilePicture});
       });
       res.status(200).json(followingsList);
    } catch(err){
      res.status(500).json(err);
    }
  });
  //follow a user
  router.put('/:id/follow', async (req,res)=>{
    if (req.body.userId != req.params.id){
      try{
        const user = await User.findById(req.body.userId);
        const userToFollow = await User.findById(req.params.userId);
        if(!userToFollow.followers.includes(req.body.userId)){
          await userToFollow.updateOne({$push:{followers:req.body.userId}});
          await user.updateOne({$push:{followers:req.params.id}});
          res.status(200).json('user has been added to your following')
        } else{
          res.status(403).json('you already follow this user');
        }
      } catch(err){
        res.status(500).json(err);
      }
    } else{
      res.status(403).json('You cant follow yourself');
    }
  });

  //unfollow a user
  router.put('/:id/unfollow',async (req,res)=>{
    if(req.body.userId != req.params.id){
      try{
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json('user has been un followed and removed from your following list');
        }
        else{
          res.status(403).json('You do not follow this user');
        }
      } catch(err){
        res.status(500).json(err);
      }
    } else{
      res.status(403).json('You cant unfollow yourself');
    }
  });

module.exports = router;