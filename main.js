const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
nunjucks.configure('templates', {express: app});
app.set('views', './templates');
const port = 8000;


app.get('/', (req, res) => {
    return res.render('index.html')
})



app.listen(port, () =>  console.log(`Server running at: http://localhost:${port}`))