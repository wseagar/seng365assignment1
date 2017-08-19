const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');

passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await models.User.findOne({
          where: {username: username},
        });

        if (!user || user.password !== password) {
          return done(null, false,
              {errors: {'email or password': 'is invalid'}});
        }

        return done(null, user);
      } catch (e) {
        done();
      }
    })
);