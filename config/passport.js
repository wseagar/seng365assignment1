const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');

passport.use(new LocalStrategy(
    (username, password, done) => {
      models.PublicUser.findOne({
        where: {username: username}
      }).then((publicUser) => {
        models.User.findById(publicUser.id).then((user) => {
          'use strict';
          if(!publicUser || user.password !== password){
            return done(null, false, {errors: {'email or password': 'is invalid'}});
          }

          return done(null, publicUser);
        });
      }).catch((err, done) => console.log(err, done));
}));