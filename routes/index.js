const routes = require('express').Router();
const movies = require('./movies');


routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/movies', movies)



module.exports = routes;