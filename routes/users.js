const express= require('express');
const _ = require('lodash');
const bcrypt= require('bcrypt');
const {User, validate}= require('../models/user');
const auth= require('../middleWares/authorization');
const router= express.Router();

//Create a new user
router.post('/', async(req, res)=>{
    const validationResult= validate(req.body);
    if(validationResult.error){
        console.log(`Validation Error: ${validationResult.error.details[0].message}`);
        return res.status(400).send({'error':validationResult.error.details[0].message});
    }

    try{

        let user= await User.findOne({email: req.body.email})
        if(user)
            return res.status(400).send({'error':'User is already registered'});

            user= new User(_.pick(req.body, ['name','email','password']));  //create new object
            //hash the password
            const salt= await bcrypt.genSalt(15);
            user.password=await bcrypt.hash(user.password, salt);

            const result= await user.save();
            const responseObj= _.pick(user, ['_id','name', 'email']);   //save user object to DB

            const authToken= user.generateAuthToken();
            return res.header('x-auth-token', authToken).status(201).send(responseObj);
    }catch(err){
        console.log(`Error while saving document: ${err}`);
        return res.status(500).send({'error':err})
    }

})

//Fetch all Users
router.get('/', async(req, res)=>{
    try{
        const users= User.find().sort({name: 1});
        
        return res.status(200).send(users)
    }catch(err){
        console.log(`Error in getting users: ${err}`);
        return res.status(500).send({'error':err})
    }
})

router.get('/me', auth, async (req, res)=>{
    const userId= req.user._id;
    try{
        const user= await User.findById(userId).select('-password');
        return res.status(200).send(user);
    }catch(ex){
        return res.status(500).send({'error':'We couldn\'t identify you'});
    }

})
module.exports= router;