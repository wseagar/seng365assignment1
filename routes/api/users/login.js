/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const passport = require('passport');
const auth = require('../../auth');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
  'use strict';
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }

    if (!user) { return res.status(400).send('Invalid username/password supplied'); }

    const token = jwt.sign({
      id: user.id,
      jti: Math.random().toString(36).slice(2)
    }, "seng365supersecret");

    return res.json({
      id: user.id,
      token: token
    });
  })(req, res, next);
});

module.exports = router;