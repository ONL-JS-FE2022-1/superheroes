'use strict'
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Superhero extends Model {
        static associate({SuperPower, Image}) {
            Superhero.hasMany(SuperPower, {
                foreignKey: 'heroId',
                as: 'superPowers'
            });
            Superhero.hasMany(Image, {
                foreignKey: 'heroId',
                as: 'images'
            })
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