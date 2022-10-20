const express = require('express');
const router = express.Router();
const Users = require('../../models/user.js');
const basic = require('../../auth/middleware/basic.js');

router.use(express.json());
//create users route
router.post('/user/signup', async (req, res) => {
  try {
    let userRecord = await Users.create(req.body);
    console.log('Created a new user', userRecord);
    res.status(201).send(userRecord);
  } catch (err) {
    res.status(400).send('Invalid Request');
  }
});



//signinRoute

router.post('/user/signin', basic, async(req,res)=> {
  try{
    res.status(200).send(req.user);
    console.log(req.user);
  }catch(err){
    console.log('failed to in sign');
    res.status(400).send('Invalid Login');
  }
});


module.exports = router;

