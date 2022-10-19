const express = require('express');
const router = express.Router();
const Users = require('../../models/user.js');
const basic = require('../../auth/middleware/basic.js');


//create users route
router.post('/user/signup', async (req, res) => {
  try {
    let userRecord = await Users.create(req.body);
    console.log('Created a new user', userRecord);
    res.send(userRecord);
  } catch (err) {
    console.log(err.message);
  }
});



//signinRoute

router.post('/user/signin', basic, async(req,res)=> {
  try{
    res.send(req.user);
  }catch(err){
    console.log('failed to in sign');
    res.status(400).send(err);
  }
});


module.exports = router;

