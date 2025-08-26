'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Holding extends Model {
    static associate(models) {
      // A Holding belongs to one Portfolio.
      Holding.belongsTo(models.Portfolio, {
        foreignKey: 'portfolioId'
      });
      // A Holding refers to one Stock.
      Holding.belongsTo(models.Stock, {
        foreignKey: 'symbol',
        targetKey: 'symbol'
      });
    }
  }
  Holding.init({
    // id is created automatically
    portfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    avgPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, { sequelize, modelName: 'Holding' });
  return Holding;
};