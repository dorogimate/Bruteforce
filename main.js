const express = require('express');
const nunjucks = require('nunjucks');
let session = require("express-session");
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
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))


app.get('/', (req, res) => {
    return res.render('index.html', {session: req.session});
})


app.get('/login', (req, res) => {
    let actualPage = 'login';
    return res.render('login.html', {actualPage});
})


app.post('/login', (req, res) => {
    (async () => {
        const loginResponse = await database.loginQuery(req.body.email, req.body.password);
        if (loginResponse !== null) {
            req.session.name = loginResponse.name;
            req.session.email = loginResponse.email;
            req.session.phone = loginResponse.phone_number;
            req.session.company = loginResponse.company_name;
            req.session.uniqueId = loginResponse.uuid;
            return res.render('index.html', {session: req.session});
        } else {
            return res.render('login.html', {errorMessage: 'Wrong username or password! Try again!'})
        }

    })();

    /* If we will be able to return the result of the query it is a dictionary with all the user data -> can be forwarded e.g. the company name
       If session works, this is code snippet is uneccessary

        return res.render('dashboard.html'+loginResponse.uuid, {name: loginResponse.name, email: loginResponse.email, --> this part not even needed if session work, however cannot check it currently
                                                          phone: loginResponse.phone_number, company: loginResponse.company_name,
                                                          uniqueId: loginResponse.uuid})
     */
})

app.get('/sign-up', (req, res) => {
    let actualPage = 'signup';
    return res.render('sign-up.html',{actualPage});
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
                database.signUpQuery(name, email, phone, company, hashedPassword, newId);
            })
            setTimeout(function () {
                return res.render('index.html');
                }, 4000
            )
        }
    }

})

app.listen(port, () =>  console.log(`Server running at: http://localhost:${port}`))