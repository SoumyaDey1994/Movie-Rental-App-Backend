const express= require('express');
const {Genre}= require('../models/genre');
const {Movie, validate}= require('../models/movie');
const router= express.Router();

//get all movies
router.get('/', async (req, res)=>{
    try{
        const movies= await Movie.find()
                            .sort({title: 1});
        return res.status(200).send(movies);   
    }catch(err){
        console.log(`Error in fetching movies: ${err}`);
        res.status(503).send(err);
    }           
})
//get specific movie object by movie id
router.get('/:id', async (req, res)=>{
    const movieId= req.params.id;
    try{
        const movie= await Movie.findById(movieId);
        if(!movie)
            return res.status(404).send({'error':`Movie of id ${movieId} is not available`})
        
        return res.status(200).send(movie);
    }catch(err){
        console.log(`Error in fetching movies: ${err}`);
        res.status(500).send(err);
    }    
})
// create new movie
router.post('/', async (req, res)=>{
    const {error}= validate(req.body);
    if(error){
        console.log(`Error in validation: ${error}`);
        return res.status(400).send({'error':error.details[0].message});
    }

    let genre;
    try{
        genre= await Genre.findById(req.body.genreId);
        if(!genre){
            console.log(`Error in getting genre: ${error}`);
            return res.status(404).send({'error':'Invalid Genre'});
        }
    }catch(err){
        console.log("Error: "+err);
        return res.status(503).send({'error':err})
    }

    let movie= new Movie({
        title: req.body.title,
        genre:{
            _id: genre._id,
            genre: genre.genre
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    })

    try{
        const result= await movie.save();
        console.log(`Created Movie Object :\n${result}`);
        return res.status(200).send({'Message':'Success','Movie':result});
    }catch(err){
        console.log("Error in storing in DB: "+err);
        return res.status(503).send({'error':err})
    }
})
//update an existing movie document
router.put('/:id', async (req, res)=>{
    const {error}= validate(req.body);
    if(error){
        console.log(`Error in validation: ${error}`);
        return res.status(400).send({'error':error.details[0].message});
    }

    let genre;
    try{
        genre= await Genre.findById(req.body.genreId);
        if(!genre){
            console.log(`Error in getting genre: ${error}`);
            return res.status(404).send({'error':'Invalid Genre'});
        }
    }catch(err){
        console.log("Error: "+err);
        return res.status(503).send({'error':err})
    }

    try{
        const movieId= req.params.id;
        const result= await Movie.findByIdAndUpdate(movieId, {
            $set:{
                title: req.body.title,
                genre:{
                    _id: genre._id,
                    genre: genre.genre
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate,
            }
        },{
            new: true
        })
   
        return res.status(200).send(result);
    }catch(err){
        console.log(`Error in updating record: ${err}`);
        return res.status(503).send({'error':err});
    }
})
//delete an movie document
router.delete('/:id', async (req, res)=>{
    const movieId= req.params.id;
    try{
        const movie= await Movie.findByIdAndRemove(movieId);
        if(!movie)
            return res.status(404).send({'error':`Movie having id ${movieId} not exists`});
            
        return res.status(200).send(movie)
    }catch(err){
        console.log(`Error in deleting record: ${err}`);
        return res.status(503).send({'error':err});
    }
})

//export the movie router
module.exports= router;