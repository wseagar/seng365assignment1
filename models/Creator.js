module.exports = (sequelize, DataTypes) => {
  'use strict';
  const Creator = sequelize.define('Creator', {
    UserId : {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ProjectId : {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    timestamps: false
  });

  return Creator;
};