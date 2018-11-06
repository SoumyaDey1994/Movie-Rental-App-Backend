const winston= require('winston');

function errorHandler(err, req, res, next){
    //log the exception
    winston.error(err.messsage, err);
    // console.log("Error: "+err);
    res.status(500).send({'error':`${err}`});
}

module.exports= errorHandler;