const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');

passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const publicUser = await models.PublicUser.findOne({
          where: {username: username}
        });

        const user = await models.User.findById(publicUser.id);

        if (!publicUser || user.password !== password) {
          return done(null, false, {errors: {'email or password': 'is invalid'}});
        }

        return done(null, publicUser);
      } catch (e) {
        done();
      }
    }
  )
);