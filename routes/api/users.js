const router = require('express').Router();
const models = require('../../models');
const passport = require('passport');
const auth = require('../auth');
const jwt = require('jsonwebtoken');

const PublicUser = {
  insert: (user) => models.PublicUser.create(user),
  get: (id) => models.PublicUser.findById(id)
};

const User = {
  insert: (id, password) => models.User.create({
    id: id,
    password: password
  }),
  get: (id) => models.User.findById(id)
};


router.post('/', async (req, res, next) => {
  'use strict';
  try {
    const b = req.body;
    await PublicUser.insert(b.user);
    await User.insert(b.user.id, b.password);
    return res.sendStatus(200).json(b.user.id);
  } catch (ex) {
    return res.sendStatus(500).json(ex);
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await PublicUser.get(id);
  return res.json(user);
});

router.put('/', auth.required, async (req, res, next) => {
  // const user = await PublicUser.get(req.payload.id);
  // if (!user) {
  //   return res.sendStatus(401);
  // }
  //
  // return res.json(user);
});


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