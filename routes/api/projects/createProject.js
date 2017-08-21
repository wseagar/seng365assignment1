/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const auth = require('../../auth');
const middleware = require('./middleware')
const upload = require('../../../config/multer');
const path = require('path');



router.post('/', auth.required, middleware.validateProject, async (req, res, next) => {
  'use strict';
  try {
    const checkAuthErrorMsg = 'Unauthorized - create account to create project';

    if (!req.payload){
      return res.status(401).send(checkAuthErrorMsg);
    }

    const b = req.body;
    const newObjects = [];
    const newProject = models.Project.build({
      title: b.title,
      subtitle: b.subtitle,
      description: b.description,
      target: b.target
    });

    await newProject.save();

    for (let creator of b.creators) {
      const newCreator = models.Creator.build({
        UserId: creator.id,
        ProjectId: newProject.id,
        name: creator.name
      });
      newObjects.push(newCreator);
    }

    for (let reward of b.rewards) {
      const newReward = models.Reward.build({
        id: reward.id,
        projectId: newProject.id,
        description: reward.description,
        amount: reward.amount,
      });
      newObjects.push(newReward);
    }

    for (let obj of newObjects){
      await obj.save();
    }

    return res.status(201).json(newProject.id);
  } catch (ex) {
    return res.status(500).json(ex);
  }
});

module.exports = router;