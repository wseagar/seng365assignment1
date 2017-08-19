module.exports = (sequelize, DataTypes) => {
  'use strict';
  const Backer = sequelize.define('Backer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ProjectId : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    anonymous: DataTypes.BOOLEAN,
  },
  {
    timestamps: false
  });

  return Backer;
};