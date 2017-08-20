/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const passport = require('passport');
const auth = require('../../auth');

router.post('/logout', auth.required, (req, res) => {
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - already logged out';
  auth.checkAuth(req, res, checkAuthErrorMsg);

  auth.addToBlacklist(req.payload.jti);

  return res.sendStatus(200);
});

module.exports = router;