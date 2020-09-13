const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const config = require('./config.json');

const apiRouter = require('./apiRouter');

const port = 9000;
const app = express();
const router = express.Router();

app.set('views', path.join(__dirname, '/views'));
app.use(methodOverride());
app.use(bodyParser.raw({extended: false}));
app.use(router);

app.get('/', (req, res) => {
    res.render('index.pug', {
        title: config.game.title
    });
});

if (config.mode === 'development') {
    app.get('/weltmeister', (req, res) => {
        res.render('weltmeister.pug');
    });

    // Weltmeister API
    app.use('/lib/weltmeister/api', apiRouter);
}

app.use('/dist', express.static('./dist'));
app.use('/lib', express.static('./dist/lib'));
app.use('/media', express.static('./dist/media'));
app.use('/tools', express.static('./dist/tools'));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
