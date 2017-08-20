const models = require('../models');
const tv4 = require('tv4');
const schema = require('./schema');

const middleware = {
  // checkUserId: async (req, res, next, errorMsg = 'Invalid id supplied') => {
  //   const id = parseInt(req.params.id, 10);
  //
  //   if (isNaN(id)){
  //     return res.status(400).send(errorMsg);
  //   }
  //
  //   const user = await models.User.findById(id);
  //
  //   if (!user) {
  //     return res.status(404).send('User not found');
  //   }
  //
  //   res.locals.id = id;
  //   res.locals.user = user;
  //
  //   next();
  // },
  // putCheckUserId: async (req, res, next) => {
  //   'use strict';
  //   middleware.checkUserId(req, res, next, 'Malformed request');
  // },
  checkProjectId: async (req, res, next) => {
    'use strict';
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)){
      return res.status(400).send('Malformed request');
    }

    const project = await models.Project.findById(id);

    if (!project){
      return res.status(404).send('Not found');
    }

    res.locals.projectId = id;
    res.locals.project = project;

    next();
  },
  // checkUserPost: async (req, res, next) => {
  //   'use strict';
  //   const b = req.body;
  //   if (!tv4.validate(b, schema.usersPost)){
  //     return res.status(400).send('Malformed request');
  //   }
  //
  //   res.locals.b = b;
  //   next();
  // },
  // checkUserPut: async (req, res, next) => {
  //   'use strict';
  //   middleware.checkUserPost(req, res, next);
  // },
  checkProjectPost: async (req, res, next) => {
    'use strict';
    const b = req.body;
    if (!tv4.validate(b, schema.projectPost)){
      return res.status(400).send('Malformed project data');
    }

    for (let creator of b.creators) {
      const user = await models.User.findById(creator.id);
      if (!user) { return res.status(400).send('Malformed project data'); }
    }

    res.locals.b = b;
    next();

  }, checkProjectPut : async (req, res, next) => {
    'use strict';
    const b = req.body;
    if (!tv4.validate(b, schema.projectPut)){
      return res.status(400).send('Malformed request');
    }
    res.locals.b = b;
    next();

  }, checkPledge: async (req, res, next) => {
    'use strict';
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)){
      return res.status(400).send('Bad user, project, or pledge details');
    }

    const project = await models.Project.findById(id);

    if (!project){
      return res.status(404).send('Not found');
    }

    const b = req.body;
    if (!tv4.validate(b, schema.projectPledge)){
      return res.status(400).send('Bad user, project, or pledge details');
    }

    res.locals.projectId = id;
    res.locals.project = project;
    res.locals.b = b;
    next();
  }, checkRewardPut: async (req, res, next) => {
    const b = req.body;
    if (!tv4.validate(b, schema.rewardsPut)){
      return res.status(400).send('Malformed request');
    }

    next();
  }
};

module.exports = middleware;