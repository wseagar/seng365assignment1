/**
 * Created by wse15 on 3/08/17.
 */

// PublicUser{
//     id	integer
//     username	string
//     location	string
//     email	string
// }

module.exports = (sequelize, DataTypes) => {
    'use strict';
  const PublicUser = sequelize.define('PublicUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    location: DataTypes.STRING,
    email: DataTypes.STRING
  });

  return PublicUser;
};


