const mongoose= require('mongoose');
const joi= require('joi');

const {genreSchema}= require('./genre');    //import genre schema

//define schema of movie document
const movieSchema= new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    genre:{
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 200
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 200
    }
})
// create model of movie document
const Movie= mongoose.model('movie', movieSchema);

//validate request body againt movie schema
function validateMovieSchema(movieObj){
    const requestedObjectSchema={
        title: joi.string().min(5).max(50).required(),
        genreId: joi.objectId().required(),
        numberInStock: joi.number().min(0).required(),
        dailyRentalRate: joi.number().min(0).required(),
    }

    const result= joi.validate(movieObj, requestedObjectSchema);
    return result;
}

//export validation logic and Movie model
exports.Movie= Movie;
exports.validate= validateMovieSchema;