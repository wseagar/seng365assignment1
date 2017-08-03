/**
 * Created by wse15 on 3/08/17.
 */

const router = require('express').Router();

router.use('/api', require('./api'));

module.exports = router;