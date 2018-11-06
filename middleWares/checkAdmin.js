function isAdmin(req, res, next){
    const isAdmin=req.user.isAdmin;
    if(!isAdmin)
        return res.status(403).send({'error':'You are not an authorized user'})
    next();
}

module.exports= isAdmin;