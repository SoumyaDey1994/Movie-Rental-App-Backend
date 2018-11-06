const express= require('express');
const config= require('config');
const jwt= require('jsonwebtoken');
const _ = require('lodash');
const bcrypt= require('bcrypt');
const joi= require('joi');

const {User}= require('../models/user');
const router= express.Router();

//Create a new Login Request
router.post('/', async(req, res)=>{
    const validationResult= validateUser(req.body);
    if(validationResult.error){
        console.log(`Validation Error: ${validationResult.error.details[0].message}`);
        return res.status(400).send({'error':validationResult.error.details[0].message});
    }

    try{
        const user= await User.findOne({email: req.body.email})
        if(!user)
            return res.status(400).send({'error':'Invalid email or password. Please try again'});

        const isValidPassword= await bcrypt.compare(req.body.password, user.password);

        if(!isValidPassword)
            return res.status(400).send({'error':'Invalid email or password. Please try again'});

        const authToken= user.generateAuthToken();
        // return res.status(200).send({'message':`Welcome back ${user.name}`});
        return res.status(200).send({'key':authToken});

    }catch(err){
        console.log(`Error while authenticating: ${err}`);
        return res.status(500).send({'error':err})
    }

})
//validate the incoming credential against standards
function validateUser(req){
    const userObjSchema={
        email: joi.string().email().min(8).max(255).trim().required(),
        password: joi.string().min(8).max(255).trim().required()
    }

    const result= joi.validate(req, userObjSchema);
    return result;
}
module.exports= router;