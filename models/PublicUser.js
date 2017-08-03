/**
 * Created by wse15 on 3/08/17.
 */

const sequelize = require('sequelize');

// PublicUser{
//     id	integer
//     username	string
//     location	string
//     email	string
// }

const PublicUser = sequelize.define('PublicUser', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: sequelize.STRING,
    location: sequelize.STRING,
    email: sequelize.STRING
});

module.exports = PublicUser;

