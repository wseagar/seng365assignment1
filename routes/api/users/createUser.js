/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const tv4 = require('tv4');
const schema = require('../../schema');


const validateUser = async (req, res, next) => {
  'use strict';
  const b = req.body;

  const results = await models.User.findAll({
    where: {
      username: b.user.username
    }
  });

  if (results.length !== 0) {
    return res.status(400).send('Malformed request')
  }

  if (!tv4.validate(b, schema.usersPost)){
    return res.status(400).send('Malformed request');
  }
  next();
};

router.post('/', validateUser, async (req, res, next) => {
  'use strict';
  try {
    const b = req.body;

    const newUser = models.User.build({
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

module.exports = router;