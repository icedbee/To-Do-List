const express = require('express');
const path = require('path')
//const serveIndex = require('serve-index');
const PORT = 3000

const app = express();

app.use(express.static(path.join(__dirname + '/public')));

app.use((req, res, next) => {
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
    let time = new Date();
    console.log('404 Not Found Time: ', time.toLocaleString("en-US"));
    next();
});

//app.use('/index.html', (req, res, next) => {
//    console.log('Request type: ', req.method);
//    next();
//});

//app.use('/pubic', express.static('public'));
//app.use('/public', serveIndex('public'));

//app.get('/', (req, res) => {
//    res.send('Successful response.');
//});

app.listen(PORT, () => console.log(`Example app is listening on port ${PORT}.`));
