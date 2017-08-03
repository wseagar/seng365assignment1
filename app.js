/**
 * Created by wse15 on 31/07/17.
 */

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('sequelize');

const app = express();

const isProduction = process.env.SENG365_PORT || false;


let db = null;

if (!isProduction) {
    db = new sequelize({
        host: 'localhost',
        port: '6033',
        dialect: 'mysql',
        username: 'root',
        password: 'secret',
        database: 'seng365'
    });
} else {
    //prod settings go here
    db = new sequelize({
        host: process.env.SENG365_MYSQL_HOST,
        port: process.env.SENG365_MYSQL_PORT,
        dialect: 'mysql',
        username: 'root',
        password: 'secret',
        database: 'mysql'
    });
}

db.authenticate()
    .then( () => {
        console.log("Connected to MySQL");
    })
    .catch( (err) => {
        console.log("Error can't connect to MySQL:", err);
        throw new err;
    })


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

const server = app.listen(3001, () => {
    console.log("Example app listening on port " + server.address().port);
});