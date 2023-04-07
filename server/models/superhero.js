'use strict'
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Superhero extends Model {
        static associate() {

        }
    }
    Superhero.init(
        {
            nickname: {
                unique: true,
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            },
            realName: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            },
            originDescription: {
                allowNull: false,
                type: DataTypes.TEXT,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            },
            catchPhrase: {
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
            modelName: 'Superhero',
            tableName: 'superheroes',
            underscored: true
        }
    )
    return Superhero;
}