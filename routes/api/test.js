/**
 * Created by wse15 on 3/08/17.
 */

const router = require('express').Router();

router.get('/test', (req, res, next) => {
    res.send("Hello world");
})

module.exports = router;