const jwt = require('jsonwebtoken')

const verifyAuth = (req, res, next) =>{
    const bearer = req.headers["authorization"];
    if (typeof bearer == "undefined"){
        res.status(403).json({message: "Unauthorized token"})
    }else{
        try {
            const fullbearer = bearer.split(' ');
            //Access the web token 
            req.webToken = fullbearer[1]
            req.decoded = jwt.verify(fullbearer[1],"bloomApp");
            console.log(req.decoded)
            next();
        } catch (err) {
            res.status(403).json({message: "Invalid webtoken"})
        }
    }
    console.log(bearer);
    
}
module.exports = {verifyAuth}