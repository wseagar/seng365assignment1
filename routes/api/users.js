const router = require('express').Router();
const models = require('../../models');
const passport = require('passport');
const auth = require('../auth');
const middleware = require('../middleware');
const jwt = require('jsonwebtoken');


router.post('/', middleware.checkUserPost, async (req, res, next) => {
  'use strict';
  try {
    const b = res.locals.b;

    const newUser = models.User.build({
      username: b.user.username,
      location: b.user.location,
      email: b.user.email,
      password: b.password
    });

    await newUser.save();

    return res.status(200).json(newUser.id);
  } catch (ex) {
    return res.status(500).json(ex);
  }
});

router.get('/:id', middleware.checkUserId, async (req, res) => {
  try {
    const user = res.locals.user;
    return res.json(user.toPublicUserJson());
  } catch (ex) {
    return res.status(500).json(ex);
  }

});

router.put('/:id', auth.required, middleware.putCheckUserId, middleware.checkUserPut, async (req, res, next) => {
  try {
    const checkAuthErrorMsg = 'Unauthorized - not Logged in';
    const checkIfAccountOwnedErrorMsg = 'Forbidden - account not owned';

    const b = res.locals.b;
    const userId = res.locals.id;
    const user = res.locals.user;

    auth.checkAuth(req, res, checkAuthErrorMsg);
    auth.checkIfItemOwned(req, res, userId, checkIfAccountOwnedErrorMsg);

    user.username = b.user.username;
    user.location = b.user.location;
    user.email = b.user.email;
    user.password = b.password;
    user.save();

    return res.sendStatus(200);
  } catch (ex) {
    return res.status(500).json(ex);
  }
});

router.delete('/:id', auth.required, middleware.checkUserId, async (req, res, next) => {
  try {
    const checkAuthErrorMsg = 'Unauthorized - not Logged in';
    const checkIfAccountOwnedErrorMsg = 'Forbidden - account not owned';

    const userId = res.locals.id;

    auth.checkAuth(req, res, checkAuthErrorMsg);
    auth.checkIfItemOwned(req, res, userId, checkIfAccountOwnedErrorMsg);

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


router.post('/login', (req, res, next) => {
  'use strict';
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }

    if (!user) { return res.status(400).send('Invalid username/password supplied'); }

    const token = jwt.sign({
      id: user.id,
    }, "test");

    return res.json({
      id: user.id,
      token: token
    });
  })(req, res, next);
});

router.post('/logout', auth.required, (req, res) => {
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - already logged out';
  auth.checkAuth(req, res, checkAuthErrorMsg);

});


module.exports = router;