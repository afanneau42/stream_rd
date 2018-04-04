const translate = require('google-translate-api');;

const routes = require('express').Router();
const movies = require('./movies');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/movies', movies)
// routes.use('/comments', comments)

routes.get('/translate', (req, res) => {
  let {str, lang} = req.query;

  translate(str, {to: lang}).then(ret => {
    res.send(ret.text);
  }).catch(err => {
      console.error(err);
      res.send();
  });
})

module.exports = routes;