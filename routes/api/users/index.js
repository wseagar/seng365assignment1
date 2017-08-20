const router = require('express').Router();

router.use('/', require('./createUser'));
router.use('/', require('./getUser'));
router.use('/', require('./deleteUser'));
router.use('/', require('./login'));
router.use('/', require('./logout'));
router.use('/', require('./updateUser'));


module.exports = router;