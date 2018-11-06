const express= require('express');
const auth= require('../middleWares/authorization');
const admin= require('../middleWares/checkAdmin');
const {Genre, validate}= require('../models/genre');

const route= express.Router();

//Get complete list of movie genres
route.get('/', async (req, res, next)=>{
    // try{
        throw new Error('Could not get the genres');
        const listOfGenres= await Genre.find()
                                        .sort('genre');
        return res.status(200).send(listOfGenres);
    // }catch(err){
    //     next(err);
    // }
    
})

//get specific movie genre by id
route.get('/:id', async (req, res)=>{
    const genreId= req.params.id;
    try{
        const genre= await Genre.findById(genreId);
        if(!genre)
            return res.status(404).send({"error":`Movie Genre of id ${genreId} does not exists`});

        return res.status(200).send(genre);
    }catch(err){
        return res.status(500).send({"error":`${err}`})
    }
})

//Create a new genre
route.post('/', auth, async (req, res)=>{
    const validationResult= validate(req.body);
    if(validationResult.error)
        return res.status(400).send({"error":validationResult.error.details[0].message});

    const genreName= req.body.genre;
    let genre= new Genre({'genre':genreName})
    try{
        genre= await genre.save();
        return res.status(200).send(genre);
    }catch(err){
        return res.status(500).send({"error":`${err}`})
    }
})

//Update an existing movie genre
route.put('/:id', auth, async (req, res)=>{

    const validationResult= validate(req.body);

    if(validationResult.error)
        return res.status(400).send({"error":validationResult.error.details[0].message})
    try{
        const genreId= req.params.id;
        const updatedGenre= await Genre.findByIdAndUpdate(genreId, {
                                            genre: req.body.genre
                                        },{ new: true })

        if(!updatedGenre)
            return res.status(404).send({"error":`Movie Genre of id ${genreId} does not exists`})

        updatedGenre.genre= req.body.genre;
        return res.status(200).send(updatedGenre);
        
    }catch(err){
        return res.status(500).send({"error":`${err}`})
    }
})

//delete an existing movie genre
route.delete('/:id', [auth, admin], async (req, res)=>{
    try{
        const genreId= req.params.id;
        const deletedGenre= await Genre.findByIdAndRemove(genreId);
        if(!deletedGenre)
            return res.status(404).send({"error":`Movie Genre of id ${genreId} does not exists`})

        return res.status(200).send({"deleted items":1,"item":deletedGenre});
    }catch(err){
        return res.status(500).send({"error":`${err}`})
    }
})

module.exports= route;