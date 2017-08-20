/**
 * Created by wse15 on 20/08/17.
 */

const router = require('express').Router();
const models = require('../../../../models');
const middleware = require('../../../middleware');
const auth = require('../../../auth');
const upload = require('../../../../config/multer');
const path = require('path');

router.get('/:id/rewards', middleware.checkProjectId, async (req, res, next) => {
  'use strict';
  const id = res.locals.projectId;
  const rewards = await models.Reward.findAll({
    where: {
      ProjectId: id
    },
    attributes: ['id', 'amount', 'description']
  });

  return res.status(200).json(rewards);
});

module.exports = router;