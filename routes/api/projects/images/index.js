/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();

router.use('/', require('./getImage'));
router.use('/', require('./updateImage'));


module.exports = router;