'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      // A Stock can be part of many different Holdings across all users.
      Stock.hasMany(models.Holding, {
        foreignKey: 'symbol',
        sourceKey: 'symbol'
      });
      // A Stock can be involved in many different Trades.
      Stock.hasMany(models.Trade, {
        foreignKey: 'symbol',
        sourceKey: 'symbol'
      });
    }
  }
  Stock.init({
    symbol: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    change: DataTypes.DECIMAL(10, 2),
    changePct: DataTypes.DECIMAL(10, 4),
    volume: DataTypes.BIGINT,
    marketCap: DataTypes.BIGINT,
    lastUpdated: DataTypes.DATE
  }, { sequelize, modelName: 'Stock', timestamps: false }); // Stock data doesn't need createdAt/updatedAt
  return Stock;
};
