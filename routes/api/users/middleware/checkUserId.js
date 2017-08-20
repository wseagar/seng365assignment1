/**
 * Created by wse15 on 20/08/17.
 */

const models = require('../../../../models');

const checkUserId = async (req, res, next, errorMsg = 'Invalid id supplied') => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)){
    return res.status(400).send(errorMsg);
  }

  const user = await models.User.findById(id);

  if (!user) {
    return res.status(404).send('User not found');
  }

  res.locals.id = id;
  res.locals.user = user;

  next();
};

module.exports = checkUserId;