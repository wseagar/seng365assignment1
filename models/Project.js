module.exports = (sequelize, DataTypes) => {
  'use strict';
  const Project = sequelize.define('Project', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdDate: {
          type: DataTypes.DATEONLY,
          defaultValue: DataTypes.NOW
        },
        title: DataTypes.STRING,
        subtitle: DataTypes.STRING,
        description: DataTypes.STRING,
        imageUri: DataTypes.STRING,
        target: DataTypes.INTEGER,
      },
      {
        timestamps: false
      });

  return Project;
};