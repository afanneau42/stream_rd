const express = require('express');
const moviesCtrl = require('../controller/movies');

const router = new express.Router();

router.route('/')
    .get(moviesCtrl.getMovies);

module.exports = router;
