const jwt= require('jsonwebtoken');
const config= require('config');

function authorize(req, res, next){

    const token= req.header('x-auth-token');
    if(!token)
        return res.status(401).send({'error':'Access denied. Authorization required.'});

    try{
        const payload= jwt.verify(token, config.get('jwtPrivateKey'));
        req.user= payload;
        next();
    }catch(ex){
        return res.status(400).send({'error':'Invalid token'});
    }    

}

module.exports= authorize;