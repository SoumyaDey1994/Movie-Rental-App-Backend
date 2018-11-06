const mongoose= require('mongoose');
const joi= require('joi');

//Define Customer schema
const customerSchema= new mongoose.Schema({
    isGold:{
        type: Boolean,
        required: true
    },
    name:{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    },
    phone:{
        type: Number,
        required: true,
        min: 10000,
        max: 99999
    }
})
//Create a customer model from customer schema
const Customer= mongoose.model('Customer', customerSchema);

//validate a customer object passes by user as request body
function validateCustomer(customerObj){
    const customerSchema={
        isGold: joi.boolean().required(),
        name: joi.string().required(),
        phone: joi.number().min(10000).max(99999).required()
    }

    const result= joi.validate(customerObj, customerSchema);
    return result;
}

exports.Customer= Customer;
exports.validate= validateCustomer;