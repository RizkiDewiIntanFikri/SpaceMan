'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Stock.init({
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    change: DataTypes.DECIMAL,
    changePct: DataTypes.DECIMAL,
    volume: DataTypes.BIGINT,
    marketCap: DataTypes.BIGINT,
    lastUpdated: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};