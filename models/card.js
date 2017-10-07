'use strict';
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    fcard: DataTypes.STRING,
    bcard: DataTypes.STRING,
    carddeck: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Card;
  module.exports = Card;
};
