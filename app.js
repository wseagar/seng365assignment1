/**
 * Created by wse15 on 31/07/17.
 */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//const port = process.env.SENG365_PORT || 3001;

//SENG365_PORT = 4926

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.listen(80, () => {
    console.log("Example app listening on port 3001");
});