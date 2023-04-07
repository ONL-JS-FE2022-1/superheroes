const {Superhero, SuperPower, Image} = require('../models');
const createHttpError = require('http-errors');

module.exports.createHero = async (req, res, next) => {
    try {
        const {body, files} = req;

        const hero = await Superhero.create(body);

        if(!hero) {
            return next(createHttpError(400));
        }

        if(files?.length) {
            const images = files.map(file => ({
                path: file.filename,
                heroId: hero.id
            }))

            await Image.bulkCreate(images, {
                returning: true
            })
        }

        if(body?.superPowers?.length) {
            const powers = body.superPowers.map(power => ({
                name: power,
                heroId: hero.id
            }))

            await SuperPower.bulkCreate(powers, {
                returning: true
            })
        }

        const heroWithData = await Superhero.findAll({
            where: {
                id: hero.id
            },
            include: [
                {
                    model: SuperPower,
                    attributes: ['id', 'name'],
                    as: 'superPowers'
                },
                {
                    model: Image,
                    attributes: ['id', 'path'],
                    as: 'images'
                }
            ]
        })

        res.status(201).send({data: heroWithData});
    } catch (err) {
        next(err);
    }
}