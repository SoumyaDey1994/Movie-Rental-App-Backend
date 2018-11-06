function logTheMessage(req, res, next){
    console.log(`Logging Messages`);
    next();
}

module.exports= logTheMessage;