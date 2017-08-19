"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");

let env = "linuxDev";

if (process.env.SENG365_MYSQL_HOST){
  env = "production";
}

const config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

if (env === "production"){
  config['host'] = process.env.SENG365_MYSQL_HOST;
  config['port'] = process.env.SENG365_MYSQL_PORT;
}

const sequelize = new Sequelize(config);
const db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

const createView = () => {
  sequelize.query('CREATE OR REPLACE VIEW progress as \n' +
      'SELECT P.ID as id, P.TARGET as target, COALESCE(SUM(B.AMOUNT), 0) AS currentPledged, COUNT(B.ID) AS numberOfBackers\n' +
      'FROM Projects P LEFT JOIN Backers' +
      ' B ON P.ID = B.PROJECTID\n' +
      'GROUP BY P.ID, P.TARGET');
};

const connectAndBuildTables = function() {
  console.log('Trying to connect to database');
  return sequelize.authenticate()
    .then(() => {
      sequelize.sync({force: true})
          .then(() => {
            console.log("Tables Created");
            createView();
            console.log("View created");
          })
    }).catch(error => {
      setTimeout(connectAndBuildTables, 5000);
    })
};

connectAndBuildTables();


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;