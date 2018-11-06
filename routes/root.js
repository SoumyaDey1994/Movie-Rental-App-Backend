'use strict';
const express= require('express');
const route= express.Router();

//Root of application
route.get('/', (req, res)=>{
    res.status(200).send('Welcome to Vidly Application');
    // res.render('/index')
})

module.exports= route;