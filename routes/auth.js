const jwt = require('express-jwt');
const secret = "test";

const tokenBlacklist = [];

// function getTokenFromHeader(req){
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
//       req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     return req.headers.authorization.split(' ')[1];
//   }
//
//   return null;
// }

function getTokenFromHeader(req) {
  const token = req.get('X-Authorization');

  if (token){
    return token
  }

  return null;
}

const isRevokedCallback = function (req, payload, done) {
  'use strict';
  const tokenId = payload.jti;

  for (let revokedToken of tokenBlacklist) {
    if (tokenId === revokedToken) {
      return done(null, true);
    }
  }

  return done(null, false);
};

const auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader,
    isRevoked: isRevokedCallback
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
  },
  addToBlacklist: (tokenId) => {
    'use strict';
    tokenBlacklist.push(tokenId);
  }
};

module.exports = auth;