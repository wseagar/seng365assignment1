/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../../models');
const auth = require('../../../auth');
const path = require('path');

const tv4 = require('tv4');
const schema = require('../../../schema');

const validatePledge = async (req, res, next) => {
  'use strict';
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send('Bad user, project, or pledge details');
  }

  const project = await models.Project.findById(id);

  if (!project) {
    return res.status(404).send('Not found');
  }

  const b = req.body;
  if (!tv4.validate(b, schema.projectPledge)) {
    return res.status(400).send('Bad user, project, or pledge details');
  }

  res.locals.projectId = id;
  res.locals.project = project;
  next();
};

router.post('/:id/pledge', auth.required, validatePledge, async (req, res, next) =>{
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - create account to pledge to a project';
  if (!req.payload){
    return res.status(401).send(checkAuthErrorMsg);
  }

  const id = res.locals.projectId;
  const project = res.locals.project;
  const b = req.body;

  const creators = await models.Creator.findAll({
    where: {
      ProjectId: id,
      UserId: req.payload.id,
    }
  });

  if (creators.length !== 0){
    return res.status(403).send('Forbidden - cannot pledge to own project - this is fraud!');
  }

  const backer = await models.Backer.create({
    UserId: req.payload.id,
    ProjectId: id,
    amount: b.amount,
    anonymous: b.anonymous
  });

  await backer.save();

  return res.sendStatus(200);
});

module.exports = router;