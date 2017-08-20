/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../models');
const middleware = require('../../middleware');
const auth = require('../../auth');
const upload = require('../../../config/multer');
const path = require('path');

router.get('/', async (req, res, next) => {
  'use strict';
  const offset = req.query.startIndex | 0;
  const limit = req.query.count | 0;

  const projects = await models.Project.findAll({
    limit: limit,
    offset: offset,
    attributes: ['id', 'title', 'subtitle', 'imageUri']
  });

  return res.status(200).json(projects);
});

router.get('/:id', middleware.checkProjectId, async(req, res, next) => {
  'use strict';
  const id = res.locals.projectId;
  const project = res.locals.project;

  const creators = await models.Creator.findAll({
    where: {
      ProjectId: id
    }
  });
  const rewards = await models.Reward.findAll({
    where: {
      ProjectId: id
    }
  });
  const backers = await models.Backer.findAll({
    where: {
      ProjectId: id,
      anonymous: false
    }
  });

  const progress = await models.sequelize.query('SELECT * FROM progress WHERE id = :projectId',
      { replacements : {projectId : id}, type: models.sequelize.QueryTypes.SELECT });
  progress[0].currentPledged = parseInt(progress[0].currentPledged) || 0;

  const mappedRewards = rewards.map(x => { return {"id": x.id, "amount": x.amount, "description": x.description} } );
  const mappedCreators = creators.map(x => { return {"id": x.UserId, "name": x.name} } );
  const mappedBackers = backers.map(x => { return {"name": x.UserId, "amount": x.amount }});
  const mappedProgress = progress.map(x => {return {"target" : x.target, 'currentPledged': x.currentPledged, 'numberOfBackers': x.numberOfBackers}});

  const response = {
    "project" : {
      "id": project.id,
      "creationDate": new Date(project.createdDate).getTime(),
      "data": {
        "title": project.title,
        "subtitle": project.subtitle,
        "description": project.description,
        "imageUri": project.imageUri,
        "target": project.target,
        "creators": mappedCreators,
        "rewards": mappedRewards,
      }
    },
    "progress": mappedProgress[0],
    "backers": mappedBackers
  };

  return res.status(200).json(response);
});

module.exports = router;