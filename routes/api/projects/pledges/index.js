/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();

router.use('/', require('./createPledge'));

module.exports = router;