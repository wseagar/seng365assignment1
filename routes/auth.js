const jwt = require('express-jwt');
const secret = "test";

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

const auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }),
  checkAuth: (req, res, errorMsg) => {
    'use strict';
    if (!req.payload){
      return res.status(401).send(errorMsg);
    }
  },
  checkIfItemOwned: (req, res, itemId, errorMsg) => {
    'use strict';
    if (itemId !== req.payload.id){
      return res.status(403).send(errorMsg);
    }
  }
};

module.exports = auth;