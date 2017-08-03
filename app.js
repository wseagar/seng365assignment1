/**
 * Created by wse15 on 31/07/17.
 */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.SENG365_PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.listen(port, () => {
    console.log("Example app listening on port 3000");
});