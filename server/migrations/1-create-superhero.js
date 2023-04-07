'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('superheroes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nickname: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING
            },
            realName: {
                field: 'real_name',
                allowNull: false,
                type: Sequelize.STRING
            },
            originDescription: {
                field: 'origin_description',
                allowNull: false,
                type: Sequelize.TEXT
            },
            catchPhrase: {
                field: 'catch_phrase',
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                field: 'created_at',
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                field: 'updated_at',
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('superheroes');
    }
}