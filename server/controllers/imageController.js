const {Image} = require('../models');
const createHttpErrors = require('http-errors');

module.exports.getHeroImages = async (req, res, next) => {
    try {
        const {params: {heroId}} = req;

        const images = await Image.findAll({
            where: {
                heroId
            }
        })

        res.send({data: images});
    } catch (err) {
        next(err);
    }
}

module.exports.addHeroImages = async(req, res, next) => {
    try {
        const {params: {heroId}, files} = req;

        const images = files.map(file => ({path: file.filename, heroId}));
        const newImages = await Image.bulkCreate(images, {returning: true});

        res.status(201).send({data: newImages});
    } catch (err) {
        next(err);
    }
}

module.exports.getImage = async(req, res, next) => {
    try {
        const {params: {heroId, imageId}} = req;

        const image = await Image.findOne({
            where: {
                heroId,
                id: imageId
            }
        })

        if(!image) {
            return next(createHttpErrors(404));
        }

        res.status(200).send({data: image })
    } catch (err) {
        next(err);
    }
}

module.exports.deleteImage = async (req, res, next) => {
    try {
        const {params: {heroId, imageId}} = req;
        const count = await Image.destroy({
            where: {
                heroId,
                id: imageId
            }
        });

        if(count === 0) {
            return next(createHttpErrors(404))
        }

        res.status(200).end();
    } catch (err) {
        next(err);
    }
}