const express= require('express');
const mongoose= require('mongoose');
const Fawn= require('fawn');    //third party module for transaction
const {Rental, validate}= require('../models/rental');
const {Movie}= require('../models/movie');
const {Customer}= require('../models/customer');
const router= express.Router();

Fawn.init(mongoose);

//Get all rentals
router.get('/', async(req, res)=>{
    try{
        const rentals= await Rental.find()
                                .sort({dateOut: -1})
        return res.status(200).send(rentals);
    }catch(err){
        console.log(`Error in fetching rentals: ${err}`);
        res.status(503).send(err);
    }
})

// add a new rental item
router.post('/', async(req, res)=>{
    const {error}= validate(req.body);
    if(error)
        return res.status(400).send({'error':error.details[0].message});

    let customerId, movieId;    
    let customer, movie;
    //get the customer details
    try{
        customerId= req.body.customerId;
        customer= await Customer.findById(customerId);
        if(!customer)
            return res.status(404).send({'error':`Customer having id ${customerId} does not exists`});
        
    }catch(err){
        console.log(`Error in getting movie: ${err}`);
        res.status(503).send(err);
    }
    //get the movie details
    try{
        movieId= req.body.movieId;
        movie= await Movie.findById(movieId);
        if(!movie)
            return res.status(404).send({'error':`Movie having id ${movieId} does not exists`});
        
    }catch(err){
        console.log(`Error in getting customer: ${err}`);
        return res.status(503).send(err)
    }

    if(movie.numberInStock===0)
        return res.status(200).send({'error':`Movie ${movie.title} is out of stock`});

    try{
        const rental= new Rental({
            customer:{
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie:{
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        })

        // const resultOfRentalStore= await rental.save();
        // movie.numberInStock--;
        // const resultOfMovieUpdate= await movie.save();
        // return res.status(200).send(resultOfRentalStore);

        //Implement Transaction
        new Fawn.Task()
                .save('rentals', rental)
                .update('movies', {_id: movie._id}, {
                    $inc: {numberInStock: -1}
                })
                .run()
        return res.status(200).send(rental);
    }catch(err){
        console.log(`Error in storing rental info: ${err}`);
        return res.status(500).send({"error":`Something bad happend...`});
    }    
})

module.exports= router;