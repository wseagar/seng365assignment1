/**
 * Created by wse15 on 20/08/17.
 */

const models = require('../../../../models');
const tv4 = require('tv4');
const schema = require('../../../schema');

const validateProject = async (req, res, next) => {
  'use strict';
  const b = req.body;
  if (!tv4.validate(b, schema.projectPost)){
    return res.status(400).send('Malformed project data');
  }

  for (let creator of b.creators) {
    const user = await models.User.findById(creator.id);
    if (!user) { return res.status(400).send('Malformed project data'); }
  }

  next();
};

module.exports = validateProject;