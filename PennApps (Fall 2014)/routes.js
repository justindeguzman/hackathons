
/**
 * Module exports.
 */

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index')
  })

  app.post('/highscore', function(req, res) {
    res.send('High score updated!')
  })
}
