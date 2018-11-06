const winston= require('winston');
require('winston-mongodb');

module.exports= function(){
    winston.add(winston.transports.File, {filename: 'logfile.log'})
    winston.add(winston.transports.MongoDB, {db: 'mongodb://localhost/vidly'});

    //Handle uncaught exceptions using winston
    winston.unhandleExceptions(
        new winston.transports.File({filename: 'unhandledExceptions.log'})
    );

    //caught unhandled rejections
    process.on('unhandledRejection', (ex)=>{
        console.log("We got an unhandled rejection");
        throw ex;
    })
}