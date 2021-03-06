/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../../models');
const middleware = require('../middleware');
const auth = require('../../../auth');
const upload = require('../../../../config/multer');
const path = require('path');
const tv4 = require('tv4');
const schema = require('../../../schema');

const validateReward = async (req, res, next) => {
  const b = req.body;
  if (!tv4.validate(b, schema.rewardsPut)){
    return res.status(400).send('Malformed request');
  }

  next();
}

router.put('/:id/rewards', auth.required, middleware.checkProjectId, validateReward, async (req, res, next) => {
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - create account to update project';
  if (!req.payload){
    return res.status(401).send(checkAuthErrorMsg);
  }

  const b = req.body;

  const creators = await models.Creator.findAll({
    where: {
      ProjectId: res.locals.projectId,
      UserId: req.payload.id,
    }
  });

  if (creators.length === 0){
    return res.status(403).send('Forbidden - unable to update a project you do not own');
  }

  const response = await models.sequelize.query('DELETE FROM Rewards WHERE projectId = :projectId',
      { replacements : {projectId : res.locals.projectId} });

  const newRewards = [];

  for (let reward of b) {
    const newReward = models.Reward.build({
      id: reward.id,
      projectId: res.locals.projectId,
      description: reward.description,
      amount: reward.amount,
    });
    newRewards.push(newReward);
  }

  for (let reward of newRewards){
    await reward.save();
  }

  return res.sendStatus(201);
});

module.exports = router;