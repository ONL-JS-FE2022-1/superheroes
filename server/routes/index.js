const router = require('express').Router();
const heroRouter = require('./hero');

router.use('/superheroes', heroRouter);

module.exports = router;