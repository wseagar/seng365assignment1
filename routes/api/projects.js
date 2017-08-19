const router = require('express').Router();
const models = require('../../models');
const middleware = require('../middleware');
const auth = require('../auth');
const upload = require('../../config/multer');
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

  const response = {
    "project" : {
      "id": project.id,
      "creationDate": project.creationDate.getTime(),
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
    "progress": progress[0],
    "backers": mappedBackers
  };

  return res.status(200).json(response);

});

router.post('/', auth.required, middleware.checkProjectPost, async (req, res, next) => {
  'use strict';
  try {
    const checkAuthErrorMsg = 'Unauthorized - create account to create project';
    auth.checkAuth(req, res, checkAuthErrorMsg);

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

router.put('/:id', auth.required, middleware.checkProjectId, middleware.checkProjectPut, async (req, res, next) => {
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - create account to update project';
  auth.checkAuth(req, res, checkAuthErrorMsg);

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

router.get('/:id/image', middleware.checkProjectId, async (req, res, next) => {
  'use strict';
  const id = res.locals.projectId;
  const project = res.locals.project;

  if (!project || !project.imageUri) {
    return res.status(404).send('Not found');
  }

  const filePath = path.resolve(project.imageUri);

  return res.sendFile(filePath);
});

router.put('/:id/image', auth.required, middleware.checkProjectId, async (req, res, next) => {
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - create account to update project';
  auth.checkAuth(req, res, checkAuthErrorMsg);

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

  upload(req, res, async function(err) {
    if (err || !req.file) {
      return res.status(400).send('Malformed request');
    }
    project.imageUri = req.file.path;
    await project.save();
    return res.sendStatus(201);
  });
});

router.post(':id/pledge', auth.required, middleware.checkPledge, async (req, res, next) =>{
  'use strict';
  const checkAuthErrorMsg = 'Unauthorized - create account to pledge to a project';
  auth.checkAuth(req, res, checkAuthErrorMsg);

  const id = res.locals.projectId;
  const project = res.locals.project;

  const creators = await models.Creator.findAll({
    where: {
      ProjectId: id,
      UserId: req.payload.id,
    }
  });

  if (creators.length === 0){
    return res.status(403).send('Forbidden - cannot pledge to own project - this is fraud!');
  }

  const backer = models.Backer.create({
    UserId: req.payload.id,
    ProjectId: id,
    amount: b.amount,
    anonymous: b.anonymous
  });

  await backer.save();

  return res.sendStatus(200);
});

router.get('/:id/rewards', middleware.checkProjectId, (req, res, next) => {
  'use strict';
  const id = res.locals.projectId;
  const rewards = models.Reward.findAll({
    where: {
      ProjectId: id
    }
  });

  return res.status(200).json(rewards);
});

module.exports = router;