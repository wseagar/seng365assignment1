/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../../models');
const middleware = require('../middleware');
const auth = require('../../../auth');
const upload = require('../../../../config/multer');
const path = require('path');

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

module.exports = router;