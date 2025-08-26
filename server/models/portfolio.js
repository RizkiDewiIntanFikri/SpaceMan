'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    static associate(models) {
      // A Portfolio belongs to exactly one User.
      Portfolio.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      // A Portfolio can contain holdings of many different stocks.
      Portfolio.hasMany(models.Holding, {
        foreignKey: 'portfolioId',
        onDelete: 'CASCADE' // If a portfolio is deleted, all its holdings are deleted.
      });
    }
  }
  Portfolio.init({
    // id is created automatically by Sequelize
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    totalValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 100000.00
    }
  }, { sequelize, modelName: 'Portfolio' });
  return Portfolio;
};