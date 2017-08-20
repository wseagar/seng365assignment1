/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../../models');
const middleware = require('../../../middleware');
const auth = require('../../../auth');
const upload = require('../../../../config/multer');
const path = require('path');


router.post('/:id/pledge', auth.required, middleware.checkPledge, async (req, res, next) =>{
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - create account to pledge to a project';
  auth.checkAuth(req, res, checkAuthErrorMsg);

  const id = res.locals.projectId;
  const project = res.locals.project;
  const b = res.locals.b;

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