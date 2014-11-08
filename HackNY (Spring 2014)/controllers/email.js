/**
 * Module dependencies.
 */

var request = require('request');
var jsdom = require("jsdom");

/**
 * Module exports.
 */

module.exports = function(req, res) {
  // retrieve query parameters passed into the request
  var city = req.query.city;
  var postID = req.query.postID;

  // construct the url that is used to scrape the email
  var url = 'http://' + city + '.craigslist.org/reply/' + postID;

  // scripts to inject to the scraped page
  var injections = ["http://code.jquery.com/jquery.js"];

  // callback function that wil be called when scraping the email
  var scrapeCallback = function (errors, window) {
    var result = window.$("a.mailto").html();
    console.log(result);
    res.send(result);
  };

  // GET the specified page and scrape it
  request(url, function (error, response, body) {
    if(!error && response.statusCode == 200) {
      jsdom.env(body, injections, scrapeCallback);
    }
  });
};
