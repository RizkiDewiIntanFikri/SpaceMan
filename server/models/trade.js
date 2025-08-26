'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trade.init({
    userId: { type: DataTypes.UUID },
    symbol: { type: DataTypes.STRING },
    type: {
      type: DataTypes.ENUM('BUY', 'SELL'), // Define the same ENUM values
      allowNull: false
    },
    quantity: { type: DataTypes.INTEGER },
    price: { type: DataTypes.DECIMAL },
    total: { type: DataTypes.DECIMAL },
    timestamp: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'Trade',
  });
  return Trade;
};