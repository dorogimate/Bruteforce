const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
nunjucks.configure('templates', {express: app});
app.set('views', './templates');
app.use(express.static('static'));
const port = 8000;

const database = require('./database_common');


app.get('/', (req, res) => {
    let firstQueryResult = database.firstQuery;
    return res.render('index.html', {firstQueryResult});
})


app.get('/main-page', (req, res) => {
    return res.render('main-page.html');
})


app.listen(port, () =>  console.log(`Server running at: http://localhost:${port}`))