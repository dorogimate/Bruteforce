const express = require('express');
const nunjucks = require('nunjucks');
const router = express.Router();
const app = express();
//Absolute path?
nunjucks.configure('./templates', {express: app});
app.set('views', './templates');
app.use(express.static('static'));
const port = 8000;

const database = require('./database_common');
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
    database.signUpQuery(req.body.email, req.body.password);
    return res.render('index.html')
})

app.listen(port, () =>  console.log(`Server running at: http://localhost:${port}`))