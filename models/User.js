/**
 * Created by wse15 on 3/08/17.
 */
module.exports = (sequelize, DataTypes) => {
  'use strict';
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    password: DataTypes.STRING
  });

  User.associate = (models) => {
    User.belongsTo(models.PublicUser, { foreignKey: 'id', targetKey: 'id' });
  };

  return User;
};