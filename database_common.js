const mysql = require('mysql2');
const {loginQuery, signUpQuery} = require("./database_common");
const {callable} = require("nunjucks/src/tests");
const {checkPasswordForLogin} = require("./password");
const password = require("./password");
const {v4: uuidv4} = require("uuid");
const {reject} = require("bcrypt/promises");
require('dotenv').config();

// Why does not it reach environmental variables -> cursor over process.env.MYSQL_USERNAME can see my variable, but
// with console log it says undefined
let username = process.env.MYSQL_USERNAME;
//console.log(username);

// Now has to set manually your own connection variables -> the above code will be implemented if working
const databaseConnection = mysql.createConnection({
    host: 'skriba.ddns.net',
    user: 'bruteforce',
    password: '/@6ueXB6',
    database: 'bruteforce'
});

const userConnection = mysql.createConnection({
    host: 'skriba.ddns.net',
    user: 'bruteforce',
    password: '/@6ueXB6',
    database: 'userdata'
});

// How to return the value of the query and make possible to call the function in main.js -> then use its return value
module.exports.loginQuery = function (email, password) {
    return new Promise(((resolve, reject) => {
        let sql = "SELECT * FROM users WHERE email = ?";
        userConnection.query(sql, [email], function (err, result, fields) {
            if (err) {reject(err)}
            else {
                if (result.length === 0) {
                    return resolve(null);
                }
                else {
                    checkPasswordForLogin(password, result[0].password).then(function(isPasswordCorrect) {
                        if (isPasswordCorrect) {
                            return resolve(result[0]);
                        } else {
                            return resolve(null) ;
                        }
                    })
                }
            }
        })
    }))
}




module.exports.signUpQuery = function (name, email, phone_number, company_name, password, uuid) {
    let sql = "INSERT INTO users (name, email, phone_number, company_name, password, uuid) VALUES (?, ?, ?, ?, ?, ?)";
    userConnection.query(sql, [name, email, phone_number, company_name, password, uuid], function (err, result, fields) {
        if(err) {return err}
    })
}


module.exports.checkEmailAddress = function(email) {
    return new Promise(((resolve, reject) => {
        let sql = "SELECT * FROM users WHERE email = ?";
        userConnection.query(sql, [email], function(err, result, fields){
            if(err) {reject(err)}
            else {
                if (result.length !== 0) {
                    return resolve(true)
                } else return resolve(false);
            }
        })

    }))
}


// Easy example how database queries can be returned
module.exports.dataListQuery = function () {
    return new Promise((resolve, reject) => {
        userConnection.query(
            "SELECT * FROM users",
            (err, result) => {
                return err ? reject(err) : resolve(result);
            }
        );
    });
}
