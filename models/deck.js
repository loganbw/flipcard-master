'use strict';
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    card: DataTypes.STRING,
    userdeck: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Deck;
  module.exports = Deck;
};
