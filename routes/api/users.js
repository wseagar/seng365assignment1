const router = require('express').Router();
const models = require('../../models');
const passport = require('passport');
const auth = require('../auth');
const jwt = require('jsonwebtoken');

const PublicUser = {
  insert: (user) => models.PublicUser.create(user)
};

const User = {
  insert: (id, password) => models.User.create({
    id: id,
    password: password
  }),
};


router.post('/', (req, res, next) => {
  'use strict';
  const b = req.body;
  PublicUser.insert(b.user)
    .then(() => User.insert(b.user.id, b.password))
    .then(() => res.status(200).json(b.user.id))
    .catch((ex) => res.status(500).json(ex));
})

router.post('/login', (req, res, next) => {
  'use strict';
  passport.authenticate('local', (err, localUser, info) => {
    if (err) { return next(err); }

    if (localUser) {
      const token = jwt.sign({
        id: localUser.id,
        email: localUser.email
      }, "test");
      return res.json({
        id: localUser.id,
        token: token
      });

    }
  })(req, res, next);
});


module.exports = router;