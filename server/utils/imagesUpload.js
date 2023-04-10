const path = require('path');
const multer = require('multer');
const { STATIC_PATH } = require('../config');
const { createPublicFolder } = require('./index');

const pathToImages = path.resolve(STATIC_PATH, 'images');

createPublicFolder(pathToImages);

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, pathToImages);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({storage});

module.exports.uploadImages = upload.array('images', 10);