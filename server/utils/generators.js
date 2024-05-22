const jwt = require('jsonwebtoken')

const genToken = (userid) =>
     jwt.sign({ id: userid }, process.env.JWT_SECRET, {
       expiresIn: process.env.JWT_EXPIRES_IN,
     });

     module.exports = {genToken}


     