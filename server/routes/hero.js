const heroRouter = require('express').Router();
const imageRouter = require('./image');
const powerRouter = require('./powers');
const HeroController = require('../controllers/heroController');
const {uploadImages} = require('../middlewares/imagesUpload');
const paginate = require('../middlewares/paginate');

heroRouter
.route('/')
.get(paginate, HeroController.getHeroes)
.post(uploadImages, HeroController.createHero);

heroRouter
.route('/:id')
.get(HeroController.getHeroById)
.put(uploadImages, HeroController.updateHeroById)
.delete(HeroController.deleteHeroById);

// localhost:5000/api/superheroes:id/images
heroRouter.use('/:heroId/images/', imageRouter);
// localhost:5000/api/superheroes:id/powers
heroRouter.use('/:heroId/powers/', powerRouter);

module.exports = heroRouter;