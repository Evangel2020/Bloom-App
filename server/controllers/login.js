const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = "bloomApp";

const {getConnection,runQueryValues,loginSyntax} = require('../modals/dbConnect');

const loginController = async (req, res) => {
    const { email, password } = req.body;
     
    const connect = await getConnection();
    try {
        const result = await runQueryValues(connect, loginSyntax, [email]);
        const verifyUser = await bcrypt.compare(password, result[0].password)
        if(verifyUser) {
            const token = jwt.sign({email, password}, secretKey)
            res.status(200).json({ status: 200, message: "Login Successful", token })
            console.log(token)

        } else {
            res.status(403).json({ message: 'invalid login Credentials' })
        }


    }
    catch (err) {
        console.log(err)
    }


}

module.exports = { loginController }