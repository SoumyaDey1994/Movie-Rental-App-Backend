module.exports= function asyncMiddleWare(handler){
    return function(req, res, next){
        try{
            handler(req, res);
        }catch(ex){
            next(ex);
        }
    }
}