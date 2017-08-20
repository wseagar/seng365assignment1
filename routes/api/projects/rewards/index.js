/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();

router.use('/', require('./getRewards'));
router.use('/', require('./updateRewards'));

module.exports = router;