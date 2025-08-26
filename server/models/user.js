'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A User has one Portfolio. The foreign key is in the Portfolio table.
      User.hasOne(models.Portfolio, {
        foreignKey: 'userId',
        onDelete: 'CASCADE' // If a user is deleted, their portfolio is also deleted.
      });
      // A User can make many Trades. The foreign key is in the Trade table.
      User.hasMany(models.Trade, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    cashBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 100000.00
    },
    portfolioValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 100000.00
    }
  }, { sequelize, modelName: 'User' });
  return User;
};