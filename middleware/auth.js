const JWT = require("jsonwebtoken");

function auth(req, res, next){
    try{
        const token = req.cookies.token

        if(!token) return res.status(401).json({msg: "Unauthorised"});

        const validatedUser = JWT.verify(token, process.env.JWT_SECRET);
        req.user= validatedUser.id;

        next();
    } catch (err){
        return res.status(401).json({msg: "Unauthorised"});
    }
};

module.exports = auth;