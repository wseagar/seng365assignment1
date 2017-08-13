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
    username: DataTypes.STRING,
    location: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  },
  {
    timestamps: false
  });

  User.prototype.toUserJson = function toUserJson() {
    return {
      user: {
        id : this.id,
        username: this.username,
        location: this.location,
        email: this.email
      },
      password: this.password
    };
  }

  User.prototype.toPublicUserJson = function toPublicUserJson() {
    return {
      id : this.id,
      username: this.username,
      location: this.location,
      email: this.email
    };
  }

  return User;
};