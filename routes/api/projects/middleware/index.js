/**
 * Created by wse15 on 20/08/17.
 */

const checkProjectId = require('./checkProjectId');
const validateProject = require('./validateProject');

const middleware = {
  checkProjectId,
  validateProject
}

module.exports = middleware;