module.exports = (sequelize, DataTypes) => {
  'use strict';
  const Reward = sequelize.define('Reward', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        projectId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        description: DataTypes.STRING,
        amount: DataTypes.INTEGER,
      },
      {
        timestamps: false
      });

  return Reward;
};