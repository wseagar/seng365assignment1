/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const middleware = require('./middleware');
const auth = require('../../auth');
const tv4 = require('tv4');
const schema = require('../../schema');

const validateUpdateProject = async (req, res, next) => {
    'use strict';
    const b = req.body;
    if (!tv4.validate(b, schema.projectPut)){
      return res.status(400).send('Malformed request');
    }

    next();
}

router.put('/:id', auth.required, middleware.checkProjectId, validateUpdateProject, async (req, res, next) => {
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - create account to update project';

  if (!req.payload){
    return res.status(401).send(checkAuthErrorMsg);
  }

  const id = res.locals.projectId;
  const project = res.locals.project;

  const creators = await models.Creator.findAll({
    where: {
      ProjectId: id,
      UserId: req.payload.id,
    }
  });

  if (creators.length === 0){
    return res.status(403).send('Forbidden - unable to update a project you do not own');
  }

  return res.sendStatus(201);
});

module.exports = router;