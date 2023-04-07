const {SuperPower} = require('../models');
const createHttpError = require('http-errors');

module.exports.getHeroPowers = async (req, res, next) => {
    try {
        const {params: {heroId}} = req;

        const powers = await SuperPower.findAll({
            where: {
                heroId
            }
        })

        res.send({data: powers});
    } catch (err) {
        next(err);
    }
}

module.exports.addHeroPowers = async(req, res, next) => {
    try {
        const {params: {heroId}, body} = req;

        const powers = body.powers.map(name => ({name, heroId}));

        const createdPowers = await SuperPower.bulkCreate(powers);

        if(!createdPowers) {
            return next(createHttpError(400))
        }

        res.send({data: createdPowers});
    } catch (err) {
        next(err);
    }
}

module.exports.deletePower = async(req, res, next) => {
    try {
        const {params: {heroId, powerId}} = req;

        const count = await SuperPower.destroy({
            where: {
                heroId,
                id: powerId
            }
        })

        if(count === 0) {
            return next(createHttpError(404));
        }

        res.status(200).end();
    } catch (err) {
        next(err);
    }
}