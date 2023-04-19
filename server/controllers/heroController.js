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

module.exports.getHeroes = async(req, res, next) => {
    try {
        const { pagination } = req;
        const heroes = await Superhero.findAll({
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
            ],
            order: [['updated_at', 'DESC']],
            ...pagination
        })

        const totalHeroesCount = await Superhero.count();

        res.send({data: heroes, totalHeroesCount});
    } catch (err) {
        next(err);
    }
}

module.exports.getHeroById = async (req, res, next) => {
    try {
        const {params: {id}} = req;

        const hero = await Superhero.findByPk(id, {
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

        if(!hero) {
            return next(createHttpError(404));
        }

        res.send({data: hero});
    } catch (err) {
        next(err);
    }
}

module.exports.updateHeroById = async(req, res, next) => {
    try {
        const {params: {id}, body: {files}, body} = req;

        const [count, [updatedHero]] = await Superhero.update(body, {
            where: { id },
            returning: true
        })

        if(files?.length) {
            const images = files.map(file => ({
                path: file.filename,
                heroId: updatedHero.id
            }))

            await Image.bulkCreate(images, {
                returning: true
            })
        }

        if(body?.superPowers?.length) {
            const powers = body.superPowers.map(power => ({
                name: power,
                heroId: updatedHero.id
            }))

            await SuperPower.bulkCreate(powers, {
                returning: true
            })
        }

        if(count === 0) {
            return next(createHttpError(404));
        }

        const heroWithData = await Superhero.findAll({
            where: {
                id: updatedHero.id
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

        res.send({data: heroWithData});

    } catch (err) {
        next(err);
    }
}

module.exports.deleteHeroById = async(req, res, next) => {
    try {
        const {params: {id}} = req;

        const count = await Superhero.destroy({where: {id}});

        if(count === 0) {
            return next(createHttpError(404));
        }

        res.status(200).end();
    } catch (err) {
        next(err);
    }
}