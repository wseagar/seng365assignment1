/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../../models');
const middleware = require('../middleware');
const auth = require('../../../auth');
const upload = require('../../../../config/multer');
const path = require('path');

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

module.exports = router;