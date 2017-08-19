/**
 * Created by wse15 on 31/07/17.
 */

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require('./models');


app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');
app.use(require('./routes'));

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);
    res.json({'errors' : {
        message: err.message,
        error: err
    }});
});

const server = app.listen(4941, () => {
    console.log("Example app listening on port " + server.address().port);
});