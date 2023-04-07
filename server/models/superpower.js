'use strict'
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SuperPower extends Model {
        static associate({ Superhero }) {
            SuperPower.belongsTo(Superhero, {
                foreignKey: 'heroId'
            })
        }
    }
    SuperPower.init(
        {
            name: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            }
        },
        {
            sequelize,
            modelName: 'SuperPower',
            tableName: 'super_powers',
            underscored: true
        }
    )
    return SuperPower;
}