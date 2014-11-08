
/**
 * Implementation.
 */

function invalidRoute(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
}

function development() {
  return function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  }
}

function production() {
  return function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
  }
}

/**
 * Module exports.
 */

exports.invalidRoute = invalidRoute
exports.development = development
exports.production = production
