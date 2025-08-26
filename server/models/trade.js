'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    static associate(models) {
      // A Trade is made by one User.
      Trade.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      // A Trade involves one Stock.
      Trade.belongsTo(models.Stock, {
        foreignKey: 'symbol',
        targetKey: 'symbol'
      });
    }
  }
  Trade.init({
    // Using a UUID for the trade ID as well
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('BUY', 'SELL'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { sequelize, modelName: 'Trade', updatedAt: false }); // A trade record is immutable
  return Trade;
};
