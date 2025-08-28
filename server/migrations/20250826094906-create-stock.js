'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stocks', {
      symbol: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      change: {
        type: Sequelize.DECIMAL(10, 2)
      },
      changePct: {
        type: Sequelize.DECIMAL(10, 4)
      },
      volume: {
        type: Sequelize.BIGINT
      },
      marketCap: {
        type: Sequelize.BIGINT
      },
      lastUpdated: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stocks');
  }
};
