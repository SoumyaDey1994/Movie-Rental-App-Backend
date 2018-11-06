const express= require('express');

const helmet= require('helmet');

const error= require('../middleWares/error');
const logger= require('../middleWares/logger');
const authenticator= require('../middleWares/authentication');
const genreRoute= require('../routes/genres');
const customerRoute= require('../routes/customers');
const movieRoute= require('../routes/movies');
const rootRoute= require('../Routes/root');
const rentalRoute= require('../routes/rentals');
const userRoute= require('../routes/users');
const authRoute= require('../routes/auth');

module.exports= function(app){
    //built-in middlewares
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'));
    app.use(helmet());

    //Custom middlewares
    app.use(logger);
    app.use(authenticator);
    
    app.use('/', rootRoute);   // redirect to route root
    app.use('/api/genres', genreRoute);   // redirect to route genre
    app.use('/api/customers', customerRoute);   // redirect to route customer
    app.use('/api/movies', movieRoute); // redirect to route movie
    app.use('/api/rentals', rentalRoute); // redirect to route movie
    app.use('/api/users', userRoute); // redirect to route user
    app.use('/api/login', authRoute); // redirect to route login

    app.use(error); //middleware to log errors
}