/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();

router.use('/', require('./getProject'));
router.use('/', require('./createProject'));
router.use('/', require('./updateProject'));

router.use('/', require('./images'));
router.use('/', require('./pledges'));
router.use('/', require('./rewards'));


module.exports = router;