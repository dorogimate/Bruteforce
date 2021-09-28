const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
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
const {checkEmailAddress} = require("./database_common");


app.use(bodyParser.urlencoded({extended: true}));
app.set('trust proxy', 1)

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());


app.get('/', (req, res) => {
    return res.render('index.html', {session: req.session});
})


app.get('/logout',(req,res) => {
    req.session.destroy();
    return res.render('index.html');
});

app.get('/login', (req, res) => {
    return res.render('login.html', {logIn : true, session: req.session});
})


app.post('/login', async (req, res) => {
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
})

app.get('/sign-up', (req, res) => {
    return res.render('sign-up.html',{signUp: true, session: req.session});
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
            return res.render('sign-up.html', {
                incorrectEmailFormatErrorMessage: "Please enter valid email address!",
                initialName: name, initialEmail: email, initialPhone: phone, initialCompany: company
            });
        } else if (true) {
            (async () => {
                const checkAlreadyUsedEmail = await database.checkEmailAddress(email);
                if (checkAlreadyUsedEmail) {
                    return res.render('sign-up.html', {
                        incorrectEmailFormatErrorMessage: "Email address already in use!",
                        initialName: name, initialEmail: "", initialPhone: phone, initialCompany: company
                    });
                } else {
                    if (req.body.password !== req.body.passwordRepeat) { //ez JavaScriptel is meg tudnám oldani, össze lehet hozni a backendet és a js-t?
                        return res.render('sign-up.html', {notMatchingPasswordsErrorMessage: "Passwords are not matching!",
                            initialName: name, initialEmail: email, initialPhone: phone, initialCompany: company});
                    } else {
                        let currentHashedPassword = password.hashingPassword(req.body.password, 10);
                        currentHashedPassword.then(function(hashedPassword) {
                            const newId = uuidv4();
                            database.signUpQuery(name, email, phone, company, hashedPassword, newId);
                        })
                        setTimeout(function () {
                                return res.render('login.html'); //ennek üzenetet átadni
                            }, 4000
                        )
                    }
                }
            })();
        }
    }

})

app.get('/dashboard', (req, res) => {
    return res.render('dashboard.html');
})

app.listen(port, () =>  console.log(`Server running at: http://localhost:${port}`))