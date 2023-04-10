const imageRouter = require('express').Router({mergeParams: true})
const ImageController = require('../controllers/imageController');
const {uploadImages} = require('../middlewares/imagesUpload');

imageRouter
.route('/')
.get(ImageController.getHeroImages)
.post(uploadImages, ImageController.addHeroImages);

imageRouter
.route('/:imageId')
.get(ImageController.getImage)
.delete(ImageController.deleteImage);

module.exports = imageRouter;
