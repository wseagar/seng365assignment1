const router = require('express').Router();
const models = require('../../models');
const passport = require('passport');
const auth = require('../auth');
const jwt = require('jsonwebtoken');


router.post('/', async (req, res, next) => {
  'use strict';
  try {
    const b = req.body;

    const newUser = models.User.build({
      id: b.user.id,
      username: b.user.username,
      location: b.user.location,
      email: b.user.email,
      password: b.password
    });

    await newUser.save();

    return res.status(200).json(newUser.id);
  } catch (ex) {
    return res.status(500).json(ex);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)){
      return res.status(400).send('Invalid id supplied');
    }

    const user = await models.User.findById(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.json(user.toPublicUserJson());
  } catch (ex) {
    return res.status(500).json(ex);
  }

});

router.put('/:id', auth.required, async (req, res, next) => {
  try {
    if (!req.payload) {
      return res.status(401).send('Unauthorized - not Logged in')
    }

    const b = req.body;
    const id = parseInt(req.params.id, 10);

    if (id !== req.payload.id){
      return res.status(403).send('Forbidden - account not owned');
    }

    if (isNaN(id)){
      return res.status(400).send('Invalid id supplied');
    }

    const user = await models.User.findById(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.username = b.user.username;
    user.location = b.user.location;
    user.email = b.user.email;
    user.password = b.password;

    user.save();

    return res.status(200).json(user);
  } catch (ex) {
    return res.status(500).json(ex);
  }
});

router.delete('/:id', auth.required, async (req, res, next) => {
  try {
    if (!req.payload) {
      return res.status(401).send('Unauthorized - not Logged in')
    }

    const b = req.body;
    const id = parseInt(req.params.id, 10);

    if (id !== req.payload.id) {
      return res.status(403).send('Forbidden - account not owned');
    }

    if (isNaN(id)) {
      return res.status(400).send('Invalid id supplied');
    }

    const user = await models.User.findById(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    models.User.destroy({
      where: {
        id : req.params.id
      },
    });

    return res.status(200).send('User deleted');
  } catch (ex) {
    return res.status(500).json(ex);
  }
});


router.post('/login', (req, res, next) => {
  'use strict';
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }

    if (!user) { return res.status(400).send('Invalid username/password supplied'); }

    const token = jwt.sign({
      id: user.id,
    }, "test");

    return res.json({
      id: user.id,
      token: token
    });
  })(req, res, next);
});

router.post('/logout', auth.required, (req, res) => {
  'use strict';
  if (!req.payload) {
    return res.status(401).send('Unauthorized - already logged out');
  }

});


module.exports = router;