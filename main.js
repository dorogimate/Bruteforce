const express = require('express');
const nunjucks = require('nunjucks');
const router = express.Router();
const app = express();
//Absolute path? - with linux OS
nunjucks.configure('./templates', {express: app});
app.set('views', './templates');
app.use(express.static('static'));
const port = 8000;
const {v4 : uuidv4} = require('uuid');

const database = require('./database_common');
const password = require('./password');
const {request} = require("express");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    let firstQueryResult = database.firstQuery;
    return res.render('index.html', {firstQueryResult});
})


app.get('/login', (req, res) => {
    return res.render('login.html');
})

app.get('/main-page', (req, res) => {
    return res.render('main-page.html');
})

app.post('/login', (req, res) => {
    database.loginQuery(req.body.email, req.body.password);
    return res.render('index.html');
})

app.get('/sign-up', (req, res) => {
    return res.render('sign-up.html');
})


app.post('/sign-up', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let company = req.body.company;
    let checkAllFieldsFulfilled = name === '' || email === '' || phone === '' || company === '' ||
                                  req.body.password === '' || req.body.passwordRepeat === '';
    let checkEmail = !email.includes('@') || !email.includes('.com');

    if (checkAllFieldsFulfilled) {
        return res.render('sign-up.html', {notAllFieldFulfilledErrorMessage: "Please fill all fields!",
            initialName: name, initialEmail: email, initialPhone: phone, initialCompany: company});
    } else {
        if (checkEmail) {
            return res.render('sign-up.html', {incorrectEmailFormatErrorMessage: "Please enter valid email address!",
                initialName: name, initialEmail: email, initialPhone: phone, initialCompany: company});
        } else if (req.body.password !== req.body.passwordRepeat) { //ez JavaScriptel is meg tudnám oldani, össze lehet hozni a backendet és a js-t?
            return res.render('sign-up.html', {notMatchingPasswordsErrorMessage: "Passwords are not matching!",
                initialName: name, initialEmail: email, initialPhone: phone, initialCompany: company});
        } else {
            let currentHashedPassword = password.hashingPassword(req.body.password, 10);
            currentHashedPassword.then(function(hashedPassword) {
                const newId = uuidv4();
                database.signUpQuery(name, email, req.body.phonePrefix + phone, company, hashedPassword, newId);
            })
            setTimeout(function () {
                return res.render('index.html');
                }, 4000
            )
        }
    }

})

app.listen(port, () =>  console.log(`Server running at: http://localhost:${port}`))