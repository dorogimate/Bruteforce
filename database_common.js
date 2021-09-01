const mysql = require('mysql2');
const {loginQuery, signUpQuery} = require("./database_common");
const {callable} = require("nunjucks/src/tests");
const {checkPasswordForLogin} = require("./password");
const password = require("./password");
const {v4: uuidv4} = require("uuid");
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
    let sql = "SELECT * FROM users WHERE email = ?"
    userConnection.query(sql, [email], function (err, result, fields) {
        if (err) {return err}
        else {
            if (result.length === 0) {
                console.log(null);
                return null;
            }
            else {
                checkPasswordForLogin(password, result[0].password).then(function(isPasswordCorrect) {
                    if (isPasswordCorrect) {
                        console.log(result[0].phone_number);
                        return result[0];
                    } else {
                        console.log(null);
                        return null;
                    }
                })
            }


        }
    })
}

module.exports.signUpQuery = function (name, email, phone_number, company_name, password, uuid) {
    let sql = "INSERT INTO users (name, email, phone_number, company_name, password, uuid) VALUES (?, ?, ?, ?, ?, ?)";
    userConnection.query(sql, [name, email, phone_number, company_name, password, uuid], function (err, result, fields) {
        if(err) {return err}
    })
}

function dataListQuery() {
    connection.query("SELECT * FROM users", function (err, result, fields) {
        if (err) {return err}
        else {
            return result;
        }
    })
}
