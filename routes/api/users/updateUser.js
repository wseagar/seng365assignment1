/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const passport = require('passport');
const auth = require('../../auth');
const middleware = require('./middleware');

const tv4 = require('tv4');
const schema = require('../../schema');

const validateUser = async (req, res, next) => {
  'use strict';
  const b = req.body;
  if (!tv4.validate(b, schema.usersPost)){
    return res.status(400).send('Malformed request');
  }
  next();
};

const checkUserId = async (req, res, next) => {
  'use strict';
  middleware.checkUserId(req, res, next, 'Malformed request');
};

router.put('/:id', auth.required, validateUser, checkUserId, async (req, res, next) => {
  try {
    const checkAuthErrorMsg = 'Unauthorized - not Logged in';
    const checkIfAccountOwnedErrorMsg = 'Forbidden - account not owned';

    const b = req.body;
    const userId = res.locals.id;
    const user = res.locals.user;


    if (!req.payload){
      return res.status(401).send(checkAuthErrorMsg);
    }

    if (userId !== req.payload.id){
      return res.status(403).end(checkIfAccountOwnedErrorMsg);
    }


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

module.exports = router;