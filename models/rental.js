const mongoose= require('mongoose');
const joi= require('joi');

const customerSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
    },
    isGold:{
        type: Boolean,
        required: true
    },
    phone:{
        type: Number,
        required: true,
        min: 10000,
        max: 99999
    }
})

const movieSchema= new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 200
    }
})

const rentalSchema= new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dateOut:{
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned:{
        type: Date
    },
    rentalFee:{
        type: Number,
        min: 0
    }
});

const Rental= mongoose.model('rental', rentalSchema);


function validateRentalObject(reqBody){
    const rentalObjSchema={
        customerId: joi.objectId().required(),
        movieId: joi.objectId().required()
    }
    const validationResult= joi.validate(reqBody, rentalObjSchema);
    return validationResult;
}

exports.Rental= Rental;
exports.validate= validateRentalObject;