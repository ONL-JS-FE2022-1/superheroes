'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('super_powers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            heroId: {
                field: 'hero_id',
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'superheroes',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
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
        await queryInterface.dropTable('super_powers');
    }
}