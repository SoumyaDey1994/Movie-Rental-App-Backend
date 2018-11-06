const mongoose= require('mongoose');
const joi= require('joi');
//Define Genre schema
const genreSchema= new mongoose.Schema({
    genre:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 15
    }
})
//Create a Genre model from schema
const Genre= mongoose.model('Genre', genreSchema);

//validate the genre object passed as request body
function validateGenre(requestBody){
    const requestObjectSchema={
        genre: joi.string().min(5).max(15).required()
    }
    const result= joi.validate(requestBody, requestObjectSchema);
    return result;
}

exports.Genre= Genre;
exports.validate= validateGenre;
exports.genreSchema= genreSchema;