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
            return result;
        }
    })
    return "Return value not passed, otherwise export working"
}

exports.firstQuery = firstQuery();














/*
const mysql = require("mysql");

//left here for testing purposes, although there is only one colour in DB
const connection = mysql.createConnection({
    host: "remotemysql.com",
    user: "aKlLAqAfXH",
    password: "PZKuFVGRQD",
    database: "aKlLAqAfXH"
});

(async () => {
    connection.connect();
    const result = await getColour("username", 2);
    console.log(result);
    connection.end();
})();

function getColour(username, roomCount) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT hexcode FROM colours WHERE precedence = ?",
            [roomCount],
            (err, result) => {
                return err ? reject(err) : resolve(result[0].hexcode);
            }
        );
    });
}

 */