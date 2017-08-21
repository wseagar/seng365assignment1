/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const auth = require('../../auth');
const middleware = require('./middleware');

router.delete('/:id', auth.required, middleware.checkUserId, async (req, res, next) => {
  try {
    const checkAuthErrorMsg = 'Unauthorized - not Logged in';
    const checkIfAccountOwnedErrorMsg = 'Forbidden - account not owned';

    const userId = res.locals.id;

    // auth.checkAuth(req, res, checkAuthErrorMsg);
    // auth.checkIfItemOwned(req, res, userId, checkIfAccountOwnedErrorMsg);

    if (!req.payload){
      return res.status(401).send(checkAuthErrorMsg);
    }

    if (userId !== req.payload.id){
      return res.status(403).send(checkIfAccountOwnedErrorMsg);
    }

    models.User.destroy({
      where: {
        id : userId
      },
    });

    return res.status(200).send('User deleted');
  } catch (ex) {
    return res.status(500).json(ex);
  }
});

module.exports = router;