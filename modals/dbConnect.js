const mysql = require('mysql2');

const poolConnect = mysql.createPool(
    {   connectionLimit: 10, 
        host: "localhost", 
        password: "", 
        user: "root", 
        database:"bloom"
     });

// const poolConnect = mysql.createPool(
//     {   connectionLimit: 10, 
//         host: "bbh1iksljjxbrsechhmh-mysql.services.clever-cloud.com", 
//         password: "yI0loYo0SDwlHeAJBbs9", 
//         user: "ungmszsdi45grwm6", 
//         database:"bbh1iksljjxbrsechhmh"
//      });
     
     

     function getConnection(){
        return new Promise((resolve, reject) => {
            poolConnect.getConnection((err, connection) =>{
                if(err){
                    reject (err)
                }else{
                    resolve(connection)
                }
            })
        })
    }

    function runQueryValues(connect, sqlQuery, values){
        return new Promise((resolve, reject) => {
            connect.query(sqlQuery, values, (err, result) => {
                if(err){
                        reject(err)
                        }else{
                            resolve(result)
                        }
            })
        })
    }


    const signUpSyntax = "insert into userSignIn(email,phoneNumber,password, otp, otpExpiry)values(?,?,?, ?, ?)";
    const loginSyntax = 'SELECT * FROM userSignIn WHERE email = ?';
    //const resetLoginSyntax = "update siginCrendentials set password = ? where email = ?"
   

module.exports = {getConnection, runQueryValues,signUpSyntax,loginSyntax}