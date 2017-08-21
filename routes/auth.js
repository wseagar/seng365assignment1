const jwt = require('express-jwt');
const secret = "seng365supersecret";

const tokenBlacklist = [];

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
  addToBlacklist: (tokenId) => {
    'use strict';
    tokenBlacklist.push(tokenId);
  }
};

module.exports = auth;