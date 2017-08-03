"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const env       = "windowsDev";
const config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];


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

sequelize.sync({force: true})
    .then(() => {
  console.log("Tables Created");
}).catch(error => {
  throw error;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;