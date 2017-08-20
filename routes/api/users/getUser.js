/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const middleware = require('./middleware');

router.get('/:id', middleware.checkUserId, async (req, res) => {
  try {
    const user = res.locals.user;
    return res.json(user.toPublicUserJson());
  } catch (ex) {
    return res.status(500).json(ex);
  }
});

module.exports = router;