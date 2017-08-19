/**
 * Created by wse15 on 3/08/17.
 */

const router = require('express').Router();

router.use('/api/v1', require('./api'));

module.exports = router;