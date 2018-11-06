const mongoose= require('mongoose');
const joi= require('joi');
const config= require('config');
const jwt= require('jsonwebtoken');

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email:{
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gim,
        minlength:8,
        maxlength:255
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin:{
        type: Boolean
    }
});

userSchema.methods.generateAuthToken= function(){
    const token= jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}
const User= mongoose.model('user', userSchema);

function validateUser(userObj){
    const userObjSchema={
        name: joi.string().min(5).max(50).required(),
        email: joi.string().email().min(8).max(255).trim().required(),
        password: joi.string().min(8).max(255).trim().required(),
        isAdmin: joi.boolean()
    }

    const result= joi.validate(userObj, userObjSchema);
    return result;
}

exports.User= User;
exports.validate= validateUser;