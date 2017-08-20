/**
 * Created by wse15 on 20/08/17.
 */

const models = require('../../../../models');

const checkProjectId = async (req, res, next) => {
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
};

module.exports = checkProjectId;