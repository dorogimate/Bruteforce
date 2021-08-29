const mysql = require('mysql2');
require('dotenv').config();

// Why does not it reach environmental variables -> cursor over process.env.MYSQL_USERNAME can see my variable, but
// with console log it says undefined
let username = process.env.MYSQL_USERNAME;
console.log(username);

// Now has to set manually your own connection variables -> the above code will be implemented if working
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Dorogi',
    password: 'Matthew98',
    database: 'Nodejs_test'
});

// How to return the value of the query and make possible to call the function in main.js -> then use its return value
function firstQuery () {
    connection.query("SELECT * FROM users", function (err, result, fields) {
        if (err) {return err}
        else {
            console.log(result);
            return result;
        }
    })
    return "Return value not passed, otherwise export working"
}


module.exports.loginQuery = function (username, password) {
    connection.query("INSERT INTO users (Name, Password) VALUES (?, ?)", [username, password], function (err, result, fields) {
        if (err) {return err}
        else {
            return result;
        }
    })
    return "Return value not passed, otherwise export working"

}
